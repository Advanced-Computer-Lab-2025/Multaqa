import { IEvent } from "../interfaces/models/event.interface";
import { ITrip } from "../interfaces/models/trip.interface";
import { IWorkshop } from "../interfaces/models/workshop.interface";
import { IStudent } from "../interfaces/models/student.interface";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import { Trip } from "../schemas/event-schemas/tripSchema";
import { Workshop } from "../schemas/event-schemas/workshopEventSchema";
import createError from "http-errors";
import { EVENT_TYPES } from "../constants/events.constants";
import { NotificationType } from "../constants/user.constants";
import { UserService } from "./userService";
import {
  sendWaitlistJoinedEmail,
  sendWaitlistPromotionEmail,
  sendWaitlistAutoRegisteredEmail,
  sendWaitlistDeadlineExpiredEmail,
} from "./emailService";
import mongoose from "mongoose";
import { NotificationService } from "./notificationService";
import { Notification } from "./notificationService";

const { Types } = require("mongoose");

// Waitlist payment deadline configuration
const WAITLIST_DEADLINE_SECONDS = process.env.WAITLIST_DEADLINE_SECONDS
  ? parseInt(process.env.WAITLIST_DEADLINE_SECONDS)
  : 3 * 24 * 60 * 60; // 3 days in seconds

export class WaitlistService {
  private eventRepo: GenericRepository<IEvent>;
  private tripRepo: GenericRepository<ITrip>;
  private workshopRepo: GenericRepository<IWorkshop>;
  private userService: UserService;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.tripRepo = new GenericRepository(
      Trip
    ) as unknown as GenericRepository<ITrip>;
    this.workshopRepo = new GenericRepository(
      Workshop
    ) as unknown as GenericRepository<IWorkshop>;
    this.userService = new UserService();
  }

  /**
   * Add user to event waitlist and send confirmation email
   * @param eventId - Event ID
   * @param userId - User ID to add to waitlist
   * @returns Updated event
   */
  async joinWaitlist(eventId: string, userId: string): Promise<IEvent> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    // Only trips and workshops support waitlist
    if (
      event.type !== EVENT_TYPES.TRIP &&
      event.type !== EVENT_TYPES.WORKSHOP
    ) {
      throw createError(
        400,
        "Waitlist is only available for trips and workshops"
      );
    }

    // Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      throw createError(400, "Registration deadline has passed for this event");
    }

    // Check if user has access based on allowedUsers restrictions
    if (event.allowedUsers && event.allowedUsers.length > 0) {
      const user = await this.userService.getUserById(userId);
      if (user) {
        const userRole = (user as any).role;
        const userPosition = (user as any).position;
        const allowedList = event.allowedUsers as string[];

        const hasAccess =
          allowedList.includes(userRole) ||
          (userPosition && allowedList.includes(userPosition));

        if (!hasAccess) {
          throw createError(
            403,
            "You do not have access to join the waitlist for this event due to role/position restrictions"
          );
        }
      }
    }

    // Check if user is already an attendee
    const isAttendee = event.attendees?.some((attendee: any) => {
      const attendeeId = attendee._id || attendee;
      return attendeeId.toString() === userId.toString();
    });
    if (isAttendee) {
      throw createError(409, "You are already registered for this event");
    }

    // Check if user is already on waitlist
    const isOnWaitlist = event.waitlist?.some(
      (entry) => entry.userId.toString() === userId.toString()
    );
    if (isOnWaitlist) {
      throw createError(409, "You are already on the waitlist for this event");
    }

    // Verify event is at full capacity before allowing waitlist join
    const typedEvent = event as ITrip | IWorkshop;
    const capacity = typedEvent.capacity || 0;
    const currentAttendees = event.attendees?.length || 0;
    const pendingPaymentCount =
      event.waitlist?.filter((entry) => entry.status === "pending_payment")
        .length || 0;
    const reservedSlots = currentAttendees + pendingPaymentCount;

    if (reservedSlots < capacity) {
      const availableSlots = capacity - reservedSlots;
      throw createError(
        400,
        `Cannot join waitlist. There are ${availableSlots} spot(s) still available. Please register directly for the event.`
      );
    }

    // Initialize waitlist if it doesn't exist
    if (!event.waitlist) {
      event.waitlist = [];
    }

    // Add user to waitlist
    event.waitlist.push({
      userId: new Types.ObjectId(userId),
      joinedAt: new Date(),
      status: "waitlist",
    } as any);

    await event.save();

    // Send waitlist joined email
    const user = (await this.userService.getUserById(userId)) as
      | IStudent
      | IStaffMember;
    if (user) {
      await sendWaitlistJoinedEmail(
        user.email,
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.email,
        event.eventName,
        event.eventStartDate
      );
    }

    return event;
  }

  /**
   * Remove user from event waitlist
   * @param eventId - Event ID
   * @param userId - User ID to remove from waitlist
   * @returns Updated event
   */
  async leaveWaitlist(eventId: string, userId: string): Promise<IEvent> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    if (!event.waitlist || event.waitlist.length === 0) {
      throw createError(404, "You are not on the waitlist for this event");
    }

    const waitlistIndex = event.waitlist.findIndex(
      (entry) => entry.userId.toString() === userId.toString()
    );

    if (waitlistIndex === -1) {
      throw createError(404, "You are not on the waitlist for this event");
    }

    // Check if user has pending_payment status (had a reserved slot)
    const hadReservedSlot =
      event.waitlist[waitlistIndex].status === "pending_payment";

    // Remove user from waitlist
    event.waitlist.splice(waitlistIndex, 1);
    await event.save();

    // If user had a reserved slot, promote next person
    if (hadReservedSlot) {
      await this.promoteFromWaitlist(eventId, 1);
    }

    return event;
  }

  /**
   * Get user's waitlist status for an event
   * @param eventId - Event ID
   * @param userId - User ID
   * @returns Waitlist status information
   */
  async getWaitlistStatus(
    eventId: string,
    userId: string
  ): Promise<{
    isOnWaitlist: boolean;
    userId?: string;
    eventId?: string;
    status?: "waitlist" | "pending_payment";
    paymentDeadline?: Date;
    joinedAt?: Date;
  }> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    if (!event.waitlist || event.waitlist.length === 0) {
      return { isOnWaitlist: false };
    }

    const waitlistEntry = event.waitlist.find(
      (entry) => entry.userId.toString() === userId.toString()
    );

    if (!waitlistEntry) {
      return { isOnWaitlist: false };
    }

    return {
      isOnWaitlist: true,
      userId,
      eventId,
      status: waitlistEntry.status,
      paymentDeadline: waitlistEntry.paymentDeadline,
      joinedAt: waitlistEntry.joinedAt,
    };
  }

  /**
   * Validate if a user can register for an event (checks slot availability and waitlist priority)
   * @param eventId - Event ID
   * @param userId - User ID attempting to register
   * @returns True if registration is allowed, throws error if blocked
   */
  async validateSlotAvailability(
    eventId: string,
    userId: string
  ): Promise<boolean> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    // Only trips and workshops have capacity limits and waitlists
    if (
      event.type !== EVENT_TYPES.TRIP &&
      event.type !== EVENT_TYPES.WORKSHOP
    ) {
      return true; // No restrictions for other event types
    }

    const capacity = (event as any).capacity || 0;
    const attendeesCount = event.attendees?.length || 0;
    const availableSlots = capacity - attendeesCount;

    // Check if user is on waitlist
    const waitlistEntry = event.waitlist?.find(
      (entry) => entry.userId.toString() === userId.toString()
    );

    // If user is on waitlist with pending_payment status, check deadline
    if (waitlistEntry && waitlistEntry.status === "pending_payment") {
      if (
        waitlistEntry.paymentDeadline &&
        new Date(waitlistEntry.paymentDeadline) < new Date()
      ) {
        throw createError(
          410,
          "Your payment deadline has expired. You have been removed from the waitlist."
        );
      }
      return true; // User has a reserved slot
    }

    // Count users with reserved slots (waitlist or pending_payment)
    const reservedSlotsCount =
      event.waitlist?.filter((entry) => entry.status === "pending_payment")
        .length || 0;

    // If there are people on the waitlist and available slots <= reserved slots, block registration
    if (
      reservedSlotsCount > 0 &&
      !waitlistEntry &&
      availableSlots <= reservedSlotsCount
    ) {
      throw createError(
        409,
        "All available slots are currently reserved for waitlisted users. Please join the waitlist."
      );
    }

    return true;
  }

  /**
   * Remove user from waitlist after successful payment
   * Called by webhook service after payment confirmation
   * @param eventId - Event ID
   * @param userId - User ID who completed payment
   */
  async removeUserAfterPayment(eventId: string, userId: string): Promise<void> {
    // Use discriminator repo to access waitlist
    const baseEvent = await this.eventRepo.findById(eventId);
    if (!baseEvent) {
      return;
    }

    let event: any;
    if (baseEvent.type === EVENT_TYPES.TRIP) {
      event = await this.tripRepo.findById(eventId);
    } else if (baseEvent.type === EVENT_TYPES.WORKSHOP) {
      event = await this.workshopRepo.findById(eventId);
    } else {
      return; // Other event types don't have waitlists
    }

    if (!event || !event.waitlist || event.waitlist.length === 0) {
      return;
    }

    const waitlistIndex = event.waitlist.findIndex(
      (entry: any) => entry.userId.toString() === userId.toString()
    );

    if (waitlistIndex !== -1) {
      event.waitlist.splice(waitlistIndex, 1);
      await event.save();
    }
  }

  /**
   * Promote users from waitlist to pending payment or direct registration
   * Handles FIFO promotion based on available slots
   * @param eventId - Event ID
   * @param freedSlots - Number of spots that became available
   */
  async promoteFromWaitlist(
    eventId: string,
    freedSlots: number
  ): Promise<void> {
    // Get base event to determine type
    const baseEvent = await this.eventRepo.findById(eventId);
    if (!baseEvent) {
      return;
    }

    // Use correct discriminator repository to access waitlist
    let event: any;
    if (baseEvent.type === EVENT_TYPES.TRIP) {
      event = await this.tripRepo.findById(eventId);
    } else if (baseEvent.type === EVENT_TYPES.WORKSHOP) {
      event = await this.workshopRepo.findById(eventId);
    } else {
      return; // Other event types don't have waitlists
    }

    if (!event) {
      return;
    }

    if (!event.waitlist || event.waitlist.length === 0) {
      return; // No one on waitlist
    }

    // Only process users with status 'waitlist' (not already in pending_payment)
    const waitingUsers = event.waitlist.filter(
      (entry: any) => entry.status === "waitlist"
    );

    if (waitingUsers.length === 0) {
      return; // No users waiting
    }

    // Check if registration deadline has passed - if so, don't promote anyone
    if (new Date() > new Date(event.registrationDeadline)) {
      return; // Registration closed, can't promote
    }

    // CRITICAL: Verify actual available slots to prevent over-booking
    const capacity = (event as any).capacity || 0;
    const currentAttendees = event.attendees?.length || 0;
    const actualAvailableSlots = Math.max(0, capacity - currentAttendees);

    // Use the minimum of: freed slots, waiting users, and ACTUAL available capacity
    const usersToPromote = Math.min(
      freedSlots,
      waitingUsers.length,
      actualAvailableSlots
    );

    if (usersToPromote === 0) {
      return; // No actual slots available
    }

    // Get the first X users from waitlist (FIFO)
    const promotedUsers = waitingUsers.slice(0, usersToPromote);

    // Check if event is free or paid
    const isFreeEvent = !event.price || event.price === 0;

    for (const waitlistEntry of promotedUsers) {
      if (isFreeEvent) {
        // Free event: auto-register immediately
        await this.autoRegisterFreeEvent(
          eventId,
          waitlistEntry.userId.toString()
        );
      } else {
        // Paid event: move to pending_payment with dynamic deadline
        // Payment deadline is the earlier of: configured deadline OR registration deadline
        const now = new Date();
        const registrationDeadline = new Date(event.registrationDeadline);
        const configuredDeadline = new Date(
          now.getTime() + WAITLIST_DEADLINE_SECONDS * 1000
        );

        // Use whichever deadline comes first
        const paymentDeadline =
          registrationDeadline < configuredDeadline
            ? registrationDeadline
            : configuredDeadline;

        // Update waitlist entry
        const entryIndex = event.waitlist!.findIndex(
          (e: any) => e.userId.toString() === waitlistEntry.userId.toString()
        );

        if (entryIndex !== -1) {
          event.waitlist![entryIndex].status = "pending_payment";
          event.waitlist![entryIndex].paymentDeadline = paymentDeadline;
          event.waitlist![entryIndex].notifiedAt = new Date();
        }

        // Send promotion email with payment deadline
        const user = (await this.userService.getUserById(
          waitlistEntry.userId.toString()
        )) as IStudent | IStaffMember;
        if (user) {
          try {
            await sendWaitlistPromotionEmail(
              user.email,
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email,
              event.eventName,
              paymentDeadline,
              event._id!.toString()
            );
          } catch (emailError) {
            console.error("Error sending promotion email:", emailError);
          }

          // Send notification for paid event promotion
          // Note: Free events handled by autoRegisterFreeEvent with different notification
          await NotificationService.sendNotification({
            userId: user._id!.toString(),
            type: "WAITLIST_PROMOTED",
            title: "Waitlist Promotion",
            message: `You've been promoted from the waitlist for ${
              event.eventName
            }. Please complete your payment by ${paymentDeadline.toLocaleString()}.`,
            read: false,
            delivered: false,
            createdAt: new Date(),
          } as Notification);
        }
      }
    }

    await event.save();
  }

  /**
   * Auto-register user for free events when promoted from waitlist
   * @param eventId - Event ID
   * @param userId - User ID to register
   */
  async autoRegisterFreeEvent(eventId: string, userId: string): Promise<void> {
    // First get base event to determine type
    const baseEvent = await this.eventRepo.findById(eventId);
    if (!baseEvent) {
      return;
    }

    // Use correct discriminator repository
    let event: any;
    if (baseEvent.type === EVENT_TYPES.TRIP) {
      event = await this.tripRepo.findById(eventId);
    } else if (baseEvent.type === EVENT_TYPES.WORKSHOP) {
      event = await this.workshopRepo.findById(eventId);
    } else {
      return;
    }

    if (!event) {
      return;
    }

    // Add user to attendees
    if (!event.attendees) {
      event.attendees = [];
    }
    event.attendees.push(new Types.ObjectId(userId) as any);

    // Remove from waitlist
    if (event.waitlist) {
      event.waitlist = event.waitlist.filter(
        (entry: any) => entry.userId.toString() !== userId.toString()
      ) as any;
    }

    // Add event to user's registered events
    const eventObjectId = event._id as mongoose.Types.ObjectId;
    await this.userService.addEventToUser(userId, eventObjectId);

    await event.save();

    // Send auto-registration confirmation email
    const user = (await this.userService.getUserById(userId)) as
      | IStudent
      | IStaffMember;
    if (user) {
      await sendWaitlistAutoRegisteredEmail(
        user.email,
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.email,
        event.eventName,
        event.eventStartDate,
        event.location
      );

      // Send notification for auto-registration
      await NotificationService.sendNotification({
        userId: user._id!.toString(),
        type: "WAITLIST_PROMOTED",
        title: "Auto-Registered from Waitlist",
        message: `Great news! You've been automatically registered for ${event.eventName} as a free event. See you there!`,
        read: false,
        delivered: false,
        createdAt: new Date(),
      } as Notification);
    }
    // Note: No need to call promoteFromWaitlist here - the caller (promoteFromWaitlist)
    // already handles promoting multiple users iteratively, avoiding recursion
  }

  /**
   * Remove expired pending payment users from waitlist
   * Called by scheduler service
   * @param eventId - Event ID
   * @returns Number of users removed
   */
  async removeExpiredWaitlistEntries(eventId: string): Promise<number> {
    const event = await this.eventRepo.findById(eventId);
    if (!event || !event.waitlist || event.waitlist.length === 0) {
      return 0;
    }

    const now = new Date();
    const expiredEntries: any[] = [];

    // Find all expired pending_payment entries
    event.waitlist.forEach((entry) => {
      if (
        entry.status === "pending_payment" &&
        entry.paymentDeadline &&
        new Date(entry.paymentDeadline) < now
      ) {
        expiredEntries.push(entry);
      }
    });

    if (expiredEntries.length === 0) {
      return 0;
    }

    // Remove expired entries and send notification emails
    for (const entry of expiredEntries) {
      const user = (await this.userService.getUserById(
        entry.userId.toString()
      )) as IStudent | IStaffMember;
      if (user) {
        await sendWaitlistDeadlineExpiredEmail(
          user.email,
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email,
          event.eventName
        );

        // Send notification for waitlist expiration
        await NotificationService.sendNotification({
          userId: user._id!.toString(),
          type: "WAITLIST_EXPIRED",
          title: "Waitlist Slot Expired",
          message: `Your waitlist slot for ${event.eventName} has expired due to missed payment deadline. You have been removed from the waitlist.`,
          createdAt: new Date(),
        } as Notification);
      }
    }

    // Remove expired entries from waitlist
    event.waitlist = event.waitlist.filter(
      (entry) =>
        !(
          entry.status === "pending_payment" &&
          entry.paymentDeadline &&
          new Date(entry.paymentDeadline) < now
        )
    ) as any;

    await event.save();

    // Trigger promotion for the freed slots
    await this.promoteFromWaitlist(eventId, expiredEntries.length);

    return expiredEntries.length;
  }
}
