import { IEvent } from "../interfaces/models/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import { EVENT_TYPES } from "../constants/events.constants";
import { mapEventDataByType } from "../utils/mapEventDataByType";
import { Trip } from "../schemas/event-schemas/tripSchema";
import { ITrip } from "../interfaces/models/trip.interface";
import { Conference } from "../schemas/event-schemas/conferenceEventSchema";
import { IConference } from "../interfaces/models/conference.interface";
import { Workshop } from "../schemas/event-schemas/workshopEventSchema";
import { IWorkshop } from "../interfaces/models/workshop.interface";
import Stripe from "stripe";
import {
  sendCommentDeletionWarningEmail,
  sendEventAccessRemovedEmail,
} from "./emailService";
import { UserService } from "./userService";
import mongoose from "mongoose";
import { IReview } from "../interfaces/models/review.interface";
import { IBoothAttendee } from "../interfaces/models/platformBooth.interface";
import ExcelJS from "exceljs";
import { StaffPosition } from "../constants/staffMember.constants";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";
import { NotificationService } from "./notificationService";
import { Notification } from "./notificationService";

const { Types } = require("mongoose");

const STRIPE_DEFAULT_CURRENCY = process.env.STRIPE_DEFAULT_CURRENCY || "usd";
const STRIPE_MIN_AMOUNT_CENTS = 50;

// Waitlist payment deadline configuration
// For testing: set WAITLIST_DEADLINE_SECONDS in .env (e.g., 30 for 30 seconds)
// For production: defaults to 3 days (259200 seconds)
const WAITLIST_DEADLINE_SECONDS = process.env.WAITLIST_DEADLINE_SECONDS
  ? parseInt(process.env.WAITLIST_DEADLINE_SECONDS)
  : 3 * 24 * 60 * 60; // 3 days in seconds

console.log("⚙️ [CONFIG] WAITLIST_DEADLINE_SECONDS from env:", process.env.WAITLIST_DEADLINE_SECONDS);
console.log("⚙️ [CONFIG] WAITLIST_DEADLINE_SECONDS parsed value:", WAITLIST_DEADLINE_SECONDS);

export class EventsService {
  private eventRepo: GenericRepository<IEvent>;
  private tripRepo: GenericRepository<ITrip>;
  private conferenceRepo: GenericRepository<IConference>;
  private workshopRepo: GenericRepository<IWorkshop>;
  private stripe?: Stripe;
  private userService: UserService;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.tripRepo = new GenericRepository(Trip) as unknown as GenericRepository<ITrip>;
    this.conferenceRepo = new GenericRepository(Conference);
    this.workshopRepo = new GenericRepository(Workshop) as unknown as GenericRepository<IWorkshop>;
    this.userService = new UserService();
    // Defer Stripe initialization until first priced event creation, to ensure env is loaded
  }

  private getStripe(): Stripe {
    if (!this.stripe) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw createError(500, "Stripe secret key missing in environment");
      }
      this.stripe = new Stripe(key);
    }
    return this.stripe;
  }

  private async ensureStripeProductForPricedEvent(
    eventDoc: IEvent
  ): Promise<void> {
    const price =
      typeof eventDoc.price === "number" && Number.isFinite(eventDoc.price)
        ? eventDoc.price
        : undefined;

    if (!price || price <= 0) {
      return;
    }

    if (eventDoc.stripeProductId || eventDoc.stripePriceId) {
      return;
    }

    const stripe = this.getStripe();

    if (price < STRIPE_MIN_AMOUNT_CENTS / 100) {
      throw createError(400, "Event price must be at least $0.50");
    }

    const unitAmount = Math.round(price * 100);
    if (!Number.isInteger(unitAmount) || unitAmount < STRIPE_MIN_AMOUNT_CENTS) {
      throw createError(400, "Event price must be at least $0.50");
    }

    const metadata: Record<string, string> = {
      eventId: eventDoc._id?.toString() || "",
      eventType: eventDoc.type,
    };

    const product = await stripe.products.create({
      name: eventDoc.eventName,
      metadata,
    });

    const priceRecord = await stripe.prices.create({
      currency: STRIPE_DEFAULT_CURRENCY,
      unit_amount: unitAmount,
      product: product.id,
    });

    eventDoc.set({
      stripeProductId: product.id,
      stripePriceId: priceRecord.id,
    });

    await eventDoc.save();
  }

  async getEvents(
    search?: string,
    type?: string,
    location?: string,
    sort?: boolean,
    startDate?: string,
    endDate?: string,
    userRole?: string,
    userPosition?: string
  ) {
    const filter: any = {
      type: { $ne: EVENT_TYPES.GYM_SESSION },
      $and: [
        {
          $or: [
            { type: { $ne: EVENT_TYPES.PLATFORM_BOOTH } },
            { "RequestData.status": "approved" },
          ],
        },
        {
          $or: [
            { type: { $ne: EVENT_TYPES.WORKSHOP } },
            { approvalStatus: "approved" },
          ],
        },
      ],
    };

    // Non-admin users should only see non-archived events
    if (userRole !== UserRole.ADMINISTRATION) {
      filter.archived = { $ne: true };
    }

    if (type) filter.type = { $regex: new RegExp(`^${type}$`, "i") };
    if (location) filter.location = { $regex: new RegExp(location, "i") };

    let events = await this.eventRepo.findAll(filter, {
      populate: [
        { path: "associatedProfs", select: "firstName lastName email" },
        { path: "createdBy", select: "firstName lastName email" },
        { path: "vendors.vendor", select: "companyName email logo" },
        { path: "vendor", select: "companyName email logo" },
        { path: "attendees", select: "firstName lastName email gucId " },
      ] as any,
    });

    // filter out unapproved bazaar vendors
    events = events.map((event: any) => {
      if (event.type === EVENT_TYPES.BAZAAR && event.vendors) {
        event.vendors = event.vendors.filter(
          (vendor: any) => vendor.RequestData?.status === "approved"
        );
      }
      return event;
    });

    // filter events based on user role/position and allowedUsers list
    // Skip filtering for admin users
    if (userRole && userRole !== UserRole.ADMINISTRATION) {
      events = events.filter((event: any) => {
        // If allowedUsers is not defined or empty, allow all users
        if (!event.allowedUsers || event.allowedUsers.length === 0) {
          return true;
        }
        // Check if user's role OR position is in the allowedUsers list
        const hasRoleAccess = event.allowedUsers.includes(userRole);
        const hasPositionAccess = userPosition
          ? event.allowedUsers.includes(userPosition)
          : false;
        return hasRoleAccess || hasPositionAccess;
      });
    }

    if (sort) {
      events = events.sort((a: any, b: any) => {
        return (
          new Date(a.eventStartDate).getTime() -
          new Date(b.eventStartDate).getTime()
        );
      });
    }

    if (startDate && endDate) {
      const startTime = new Date(startDate).getTime();
      const endTime = new Date(endDate).getTime();

      events = events.filter((event: any) => {
        const eventStart = new Date(event.eventStartDate).getTime();
        const eventEnd = new Date(event.eventEndDate).getTime();

        return eventEnd >= startTime && eventStart <= endTime;
      });
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      return events.filter(
        (event: any) =>
          searchRegex.test(event.eventName) ||
          searchRegex.test(event.type) ||
          searchRegex.test(event.createdBy?.firstName || "") ||
          searchRegex.test(event.createdBy?.lastName || "") ||
          event.associatedProfs?.some(
            (prof: any) =>
              searchRegex.test(prof?.firstName || "") ||
              searchRegex.test(prof?.lastName || "")
          )
      );
    }

    return events;
  }

  async getAllWorkshops(): Promise<IEvent[]> {
    const filter: any = {
      type: EVENT_TYPES.WORKSHOP,
    };
    return this.eventRepo.findAll(filter, {
      populate: [
        { path: "associatedProfs", select: "firstName lastName email" },
        { path: "attendees", select: "firstName lastName email gucId " },
      ] as any,
    });
  }

  async getEventById(id: string): Promise<IEvent | null> {
    const options = {
      populate: [
        { path: "associatedProfs", select: "firstName lastName email" },
        { path: "vendors.vendor", select: "companyName email logo" },
        { path: "vendor", select: "companyName email logo" },
        { path: "attendees", select: "firstName lastName email gucId " } as any,
        { path: "createdBy", select: "firstName lastName email gucId " } as any,
      ],
    };
    const event = await this.eventRepo.findById(id, options);
    return event;
  }

  async createEvent(user: any, data: any) {
    const mappedData = mapEventDataByType(data.type, data);

    let createdEvent: IEvent | null = null;

    try {
      if (data.type == EVENT_TYPES.TRIP) {
        createdEvent = await this.tripRepo.create(mappedData);
      } else if (data.type == EVENT_TYPES.CONFERENCE) {
        createdEvent = await this.conferenceRepo.create(mappedData);
      } else {
        createdEvent = await this.eventRepo.create(mappedData);
      }

      await this.ensureStripeProductForPricedEvent(createdEvent);

      await NotificationService.sendNotification({
        role: [
          UserRole.STUDENT,
          UserRole.STAFF_MEMBER,
          UserRole.ADMINISTRATION,
        ],
        staffPosition: [
          StaffPosition.PROFESSOR,
          StaffPosition.STAFF,
          StaffPosition.TA,
        ],
        adminRole: [
          AdministrationRoleType.EVENTS_OFFICE,
          AdministrationRoleType.ADMIN,
        ],
        type: "EVENT_NEW",
        title: "New Event Added",
        message: `A new event titled "${createdEvent.eventName}" has been added. Check it out!`,
        createdAt: new Date(),
      } as Notification);

      return createdEvent;
    } catch (err) {
      if (createdEvent && createdEvent._id) {
        await createdEvent.deleteOne().catch(() => undefined);
      }
      throw err;
    }
  }

  async updateEvent(eventId: string, updateData: any) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    // Check if trying to archive an event that hasn't passed
    if (
      updateData.archived &&
      updateData.archived === true &&
      !event.isPassed
    ) {
      throw createError(400, "Cannot archive an event that has not passed yet");
    }

    if (event.type === EVENT_TYPES.BAZAAR || event.type === EVENT_TYPES.TRIP) {
      const now = new Date();
      const eventStarted = new Date(event.eventStartDate) < now;
      const eventEnded = new Date(event.eventEndDate) < now;
      const isOngoing = eventStarted && !eventEnded;

      if (isOngoing) {
        // Block all updates including archival while event is ongoing
        throw createError(
          400,
          "Cannot update bazaars & trips while they are ongoing"
        );
      }

      if (eventStarted) {
        // After event starts (but has ended), only allow archival
        const updateKeys = Object.keys(updateData).filter(
          (key) => key !== "type"
        );
        const isOnlyArchiving =
          updateKeys.length === 1 &&
          updateKeys[0] === "archived" &&
          updateData.archived === true;

        if (!isOnlyArchiving) {
          throw createError(
            400,
            "Cannot update bazaars & trips that have already ended"
          );
        }
      }
    }
     if (event.type === EVENT_TYPES.CONFERENCE) {
      const now = new Date();
      const eventStarted = new Date(event.eventStartDate) < now;
      const eventEnded = new Date(event.eventEndDate) < now;
      const isOngoing = eventStarted && !eventEnded;

      if (isOngoing) {
        if (
          updateData.eventStartDate ||
          updateData.eventStartTime ||
          updateData.eventEndDate ||
          updateData.eventEndTime
        ) {
          throw createError(
            400,
            "Cannot update conference start or end date/time while it is ongoing"
          );
        }
      }
    }
    // If event has a price and its being changed, reflect that in Stripe before saving to DB
    if (
      Object.prototype.hasOwnProperty.call(updateData, "price") &&
      updateData.price !== event.price
    ) {
      const newPrice: number = updateData.price;
      if (newPrice > 0) {
        if (newPrice < STRIPE_MIN_AMOUNT_CENTS / 100) {
          throw createError(400, "Event price must be at least $0.50");
        }
        const unitAmount = Math.round(newPrice * 100);
        if (
          !Number.isInteger(unitAmount) ||
          unitAmount < STRIPE_MIN_AMOUNT_CENTS
        ) {
          throw createError(400, "Event price must be at least $0.50");
        }

        const stripe = this.getStripe();

        // Ensure we have a product; create one if missing
        let productId = event.stripeProductId;
        const desiredName = updateData.eventName
          ? updateData.eventName
          : event.eventName;

        if (!productId) {
          const product = await stripe.products.create({
            name: desiredName,
            metadata: {
              eventId: event._id?.toString() || "",
              eventType: event.type,
            },
          });
          productId = product.id;
          updateData.stripeProductId = productId;
        } else if (desiredName && desiredName !== event.eventName) {
          // Best-effort: keep Stripe product name in sync
          await stripe.products
            .update(productId, { name: desiredName })
            .catch(() => undefined);
        }

        // Create a fresh price for the new amount
        const newPriceRecord = await stripe.prices.create({
          currency: STRIPE_DEFAULT_CURRENCY,
          unit_amount: unitAmount,
          product: productId,
        });

        // Optionally deactivate previous price to prevent misuse
        if (event.stripePriceId) {
          await stripe.prices
            .update(event.stripePriceId, { active: false })
            .catch(() => undefined);
        }

        updateData.stripePriceId = newPriceRecord.id;
      } else {
        // If price is set to 0 or negative, we keep existing Stripe IDs as-is.
        // Optionally we could deactivate the existing price here if needed.
      }
    }

    // Check if allowedUsers is being restricted and remove ineligible attendees
    if (
      updateData.allowedUsers &&
      Array.isArray(updateData.allowedUsers) &&
      updateData.allowedUsers.length > 0
    ) {
      await this.removeIneligibleAttendees(event, updateData.allowedUsers);
    }

    // Store capacity increase info before update
    const capacityIncreased =
      updateData.capacity &&
      typeof updateData.capacity === "number" &&
      (event as any).capacity &&
      updateData.capacity > (event as any).capacity;
    const additionalSlots = capacityIncreased
      ? updateData.capacity - (event as any).capacity
      : 0;

    console.log("[CAPACITY UPDATE] Event ID:", eventId);
    console.log("[CAPACITY UPDATE] Old capacity:", (event as any).capacity);
    console.log("[CAPACITY UPDATE] New capacity:", updateData.capacity);
    console.log("[CAPACITY UPDATE] Capacity increased:", capacityIncreased);
    console.log("[CAPACITY UPDATE] Additional slots:", additionalSlots);

    let updatedEvent;

    if (event.type === EVENT_TYPES.TRIP) {
      updatedEvent = await this.tripRepo.update(eventId, updateData);
    } else if (event.type === EVENT_TYPES.CONFERENCE) {
      updatedEvent = await this.conferenceRepo.update(eventId, updateData);
    } else {
      updatedEvent = await this.eventRepo.update(eventId, updateData);
    }

    // Promote from waitlist AFTER capacity update is saved
    if (capacityIncreased && additionalSlots > 0) {
      console.log("[PROMOTION] Calling promoteFromWaitlist with", additionalSlots, "slots");
      await this.promoteFromWaitlist(eventId, additionalSlots);
      console.log("[PROMOTION] promoteFromWaitlist completed");
    } else {
      console.log("[PROMOTION] Skipping promotion - capacityIncreased:", capacityIncreased, "additionalSlots:", additionalSlots);
    }

    return updatedEvent!; //! to assert that updatedEvent is not null (we already checked for existence above)
  }

  async deleteEvent(id: string): Promise<IEvent> {
    const event = await this.eventRepo.findById(id);

    if (event && event.attendees && event.attendees.length > 0) {
      throw createError(409, "Cannot delete event with attendees");
    }
    const deleteResult = await this.eventRepo.delete(id);
    if (!deleteResult) {
      throw createError(404, "Event not found");
    }
    return deleteResult;
  }

  async registerUserForEvent(eventId: string, userId: any) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    if (
      event.type !== EVENT_TYPES.TRIP &&
      event.type !== EVENT_TYPES.WORKSHOP
    ) {
      throw createError(
        400,
        "Registrations are only allowed for trips and workshops"
      );
    }

    // Check if registration deadline has passed
    if (new Date() > new Date(event.registrationDeadline)) {
      throw createError(400, "Registration deadline has passed for this event");
    }

    // Check if user is already registered
    const isAlreadyRegistered = event.attendees?.some((attendee: any) => {
      // Handle both populated objects and ObjectIds
      const attendeeId = attendee._id || attendee;
      return attendeeId.toString() === userId.toString();
    });

    if (isAlreadyRegistered) {
      throw createError(409, "User already registered for this event");
    }

    // Check if user is on waitlist
    const waitlistEntry = event.waitlist?.find(
      (entry) => entry.userId.toString() === userId.toString()
    );

    // Only block if user is on waitlist with 'waitlist' status
    // Allow if status is 'pending_payment' (they were promoted and can now pay)
    if (waitlistEntry && waitlistEntry.status === "waitlist") {
      throw createError(
        409,
        "You are already on the waitlist for this event. Please wait to be promoted."
      );
    }

    // Check capacity before allowing registration
    const capacity = (event as any).capacity;
    const attendeesCount = event.attendees?.length || 0;

    if (
      capacity !== undefined &&
      typeof capacity === "number" &&
      attendeesCount >= capacity
    ) {
      throw createError(
        400,
        "Event is at full capacity. Please join the waitlist instead."
      );
    }

    // WAITLIST PRIORITY: Reserve slots proportionally for waitlist users
    // Count users with reserved slots (both waiting and pending payment)
    const reservedSlotsCount = event.waitlist?.filter(
      (entry: any) => entry.status === "waitlist" || entry.status === "pending_payment"
    ).length || 0;

    // Calculate available slots
    const availableSlots = capacity - attendeesCount;

    console.log("[REGISTRATION CHECK]");
    console.log("- Event ID:", event._id);
    console.log("- Capacity:", capacity);
    console.log("- Current attendees:", attendeesCount);
    console.log("- Available slots:", availableSlots);
    console.log("- Reserved slots (waitlist + pending_payment):", reservedSlotsCount);
    console.log("- User on waitlist?:", !!waitlistEntry);
    console.log("- User status:", waitlistEntry?.status);
    console.log("- Should block?:", reservedSlotsCount > 0 && !waitlistEntry && availableSlots <= reservedSlotsCount);

    // If user is NOT on waitlist (or not promoted), check if slots are reserved
    // Block only if available slots <= reserved slots count (proportional fairness)
    if (reservedSlotsCount > 0 && !waitlistEntry && availableSlots <= reservedSlotsCount) {
      console.log("[REGISTRATION CHECK] BLOCKING - slots reserved for waitlist");
      throw createError(
        409,
        `There are ${reservedSlotsCount} user(s) with reserved spots (on waitlist or pending payment) and only ${availableSlots} slot(s) available. These slots are reserved. Please join the waitlist to register.`
      );
    }
    
    console.log("[REGISTRATION CHECK] ALLOWING registration");

    // Add user to attendees
    event.attendees?.push(userId);
    
    // Remove from waitlist if they were promoted (pending_payment status)
    if (waitlistEntry && event.waitlist) {
      event.waitlist = event.waitlist.filter(
        (entry: any) => entry.userId.toString() !== userId.toString()
      ) as any;
      console.log(`✅ User ${userId} removed from waitlist after successful registration`);
    }
    
    await event.save();

    // Add event to user's registered events
    // TODO: Remove this after testing
    // const eventObjectId = event._id;
    const eventObjectId = event._id as mongoose.Types.ObjectId;
    await this.userService.addEventToUser(userId, eventObjectId);

    return event;
  }

  async removeAttendeeFromEvent(
    eventId: string,
    userId: string
  ): Promise<IEvent> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    if (
      event.type !== EVENT_TYPES.TRIP &&
      event.type !== EVENT_TYPES.WORKSHOP
    ) {
      throw createError(
        400,
        "Operation is only allowed for trips and workshops"
      );
    }

    // Check if user is registered
    const isRegistered = event.attendees?.some(
      (attendeeId: { toString: () => string }) =>
        attendeeId.toString() === userId.toString()
    );
    if (!isRegistered) {
      throw createError(404, "User is not registered for this event");
    }

    // Remove user from attendees
    const userOid = new Types.ObjectId(userId);

    event.attendees = (event.attendees ?? [])
      .map((attendee: any) => {
        const id = attendee && attendee._id ? attendee._id : attendee;
        return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
      })
      .filter((oid: any) => oid && oid.toString() !== userOid.toString());
    await event.save();
    return event;
  }

  /**
   * Removes attendees from an event who no longer have access based on allowedUsers restrictions
   * This method is called when the allowedUsers field is updated before the event starts
   * Also handles refunds for paid events and can send email notifications
   * @param event - The event document to check
   * @param allowedRolesAndPositions - Array of allowed roles and positions
   */
  async removeIneligibleAttendees(
    event: IEvent,
    allowedRolesAndPositions: string[]
  ): Promise<void> {
    // Early return if no attendees to check
    if (!event.attendees || event.attendees.length === 0) {
      return;
    }

    const now = new Date();
    const eventStartDate = new Date(event.eventStartDate);

    // Only remove attendees if event hasn't started yet
    if (eventStartDate <= now) {
      return;
    }

    const attendeesToRemove: string[] = [];

    // Populate attendees to check their roles/positions and get user details
    await event.populate({
      path: "attendees",
      select: "role position firstName lastName email",
    });

    for (const attendee of event.attendees as any[]) {
      if (!attendee || !attendee._id) continue;

      const userId = attendee._id.toString();
      const userRole = attendee.role;
      const userPosition = attendee.position;

      // Check if user's role or position is in the allowed list
      const hasAccess =
        allowedRolesAndPositions.includes(userRole) ||
        (userPosition && allowedRolesAndPositions.includes(userPosition));

      if (!hasAccess) {
        attendeesToRemove.push(userId);
      }
    }

    // Remove ineligible users from event attendees and their registeredEvents
    if (attendeesToRemove.length > 0) {
      const eventId = event._id?.toString();
      if (!eventId) {
        throw createError(500, "Event ID is missing");
      }

      const eventPrice = event.price || 0;
      const hasPrice = eventPrice > 0;

      for (const userId of attendeesToRemove) {
        try {
          // Get attendee details before removal for email
          const attendee = (event.attendees as any[]).find(
            (a: any) => a._id?.toString() === userId
          );

          // Remove user from event attendees and event from user's registeredEvents
          await this.userService.removeEventFromUserRegistrations(
            userId,
            eventId
          );
          await this.removeAttendeeFromEvent(eventId, userId);

          // Refund to wallet if event has a price
          if (hasPrice) {
            await this.userService.addToWallet(userId, eventPrice);

            // Log refund transaction
            await this.userService.addTransaction(userId, {
              eventName: event.eventName,
              amount: eventPrice,
              walletAmount: eventPrice,
              type: "refund",
              date: new Date(),
            });
          }

          // Send email notification about removal
          if (attendee) {
            await sendEventAccessRemovedEmail(
              attendee.email,
              `${attendee.firstName} ${attendee.lastName}`,
              event.eventName,
              allowedRolesAndPositions,
              hasPrice ? eventPrice : undefined
            );
          }
        } catch (error) {
          console.warn(`Could not remove user ${userId} from event:`, error);
        }
      }
    }
  }

  // one-time comment or rating
  async createReview(
    eventId: string,
    userId: string,
    comment?: string,
    rating?: number
  ): Promise<IReview> {
    if (!comment && !rating) {
      throw createError(400, "Either comment or rating must be provided");
    }

    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    let reviewIndex = event.reviews?.findIndex((review) => {
      return (review.reviewer._id as any).toString() === userId.toString();
    });

    if (reviewIndex === undefined || reviewIndex < 0) {
      const newReview: IReview = {
        reviewer: new mongoose.Types.ObjectId(userId),
        comment: comment,
        rating: rating,
        createdAt: new Date(),
      };
      event.reviews?.push(newReview);
      reviewIndex = (event.reviews?.length || 1) - 1;
      await event.save();
    } else {
      if (event.reviews[reviewIndex].comment && comment) {
        throw createError(
          409,
          "You have already submitted a comment for this event"
        );
      }
      if (event.reviews[reviewIndex].rating && rating) {
        throw createError(
          409,
          "You have already submitted a rating for this event"
        );
      }

      if (comment) event.reviews[reviewIndex].comment = comment;
      if (rating) event.reviews[reviewIndex].rating = rating;
      await event.save();
    }
    return event.reviews[reviewIndex];
  }

  // infinite changes in comments and ratings
  async updateReview(
    eventId: string,
    userId: string,
    comment?: string,
    rating?: number
  ): Promise<IReview> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    const event = await this.eventRepo.findById(eventId, {
      populate: [
        { path: "reviews.reviewer", select: "firstName lastName email role" },
      ] as any[],
    });
    if (!event) {
      throw createError(404, "Event not found");
    }

    const reviewIndex = event.reviews?.findIndex((review) => {
      return (review.reviewer._id as any).toString() === userId.toString();
    });
    if (reviewIndex === undefined || reviewIndex < 0) {
      throw createError(404, "Review by this user not found for the event");
    }

    if (comment !== undefined) {
      event.reviews[reviewIndex].comment = comment;
    }
    if (rating !== undefined) {
      event.reviews[reviewIndex].rating = rating;
    }

    await event.save();
    return event.reviews[reviewIndex];
  }

  async deleteComment(eventId: string, userId: string): Promise<void> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    const event = await this.eventRepo.findById(eventId, {
      populate: [
        { path: "reviews.reviewer", select: "firstName lastName email role" },
      ] as any[],
    });
    if (!event) {
      throw createError(404, "Event not found");
    }

    const reviewIndex = event.reviews?.findIndex((review) => {
      return (review.reviewer._id as any).toString() === userId.toString();
    });
    if (reviewIndex === undefined || reviewIndex < 0) {
      throw createError(404, "Review by this user not found for the event");
    }

    await sendCommentDeletionWarningEmail(
      user.email,
      (event.reviews[reviewIndex].reviewer as any).firstName +
        " " +
        (event.reviews[reviewIndex].reviewer as any).lastName,
      event.reviews[reviewIndex].comment || "No comment text",
      "Admin action",
      event.eventName,
      0
    );

    event.reviews.splice(reviewIndex, 1);
    await event.save();
  }

  async getAllReviewsByEvent(eventId: string): Promise<IReview[]> {
    const event = await this.eventRepo.findById(eventId, {
      populate: [
        { path: "reviews.reviewer", select: "firstName lastName email role" },
      ] as any[],
    });
    if (!event) {
      throw createError(404, "Event not found");
    }

    return event.reviews;
  }

  async exportEventUsersToXLXS(eventId: string): Promise<Buffer> {
    const event = await this.eventRepo.findById(eventId, {
      populate: [
        { path: "attendees", select: "firstName lastName " },
        { path: "vendors.vendor", select: "companyName" },
      ] as any[],
    });
    if (!event) {
      throw createError(404, "Event not found");
    }

    if (
      event.type === EVENT_TYPES.CONFERENCE ||
      event.type === EVENT_TYPES.GYM_SESSION
    ) {
      throw createError(
        400,
        "Exporting attendees is not supported for this event type"
      );
    }

    const workbook = new ExcelJS.Workbook();

    const applyHeaderStyle = (cell: ExcelJS.Cell) => {
      cell.font = { bold: true, size: 12, name: "Calibri" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { bottom: { style: "thin", color: { argb: "FF000000" } } };
    };

    const applyVendorHeaderStyle = (cell: ExcelJS.Cell) => {
      cell.font = {
        bold: true,
        size: 11,
        name: "Calibri",
        color: { argb: "FF0000FF" },
      }; // Blue text
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCCCFF" },
      }; // Light Blue fill
    };

    if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
      const boothAttendees = event.RequestData
        .boothAttendees as IBoothAttendee[];
      const attendees = boothAttendees.map((attendee) => ({
        Name: attendee.name,
      }));
      const worksheet = workbook.addWorksheet("Platform Booth Attendees");

      worksheet.columns = [
        { header: "Booth Attendee Name", key: "name", width: 30 },
      ];
      const headerRow = worksheet.getRow(1);
      applyHeaderStyle(headerRow.getCell(1));

      attendees.forEach((attendee) => {
        worksheet.addRow({ name: attendee.Name });
      });
    } else if (event.type === EVENT_TYPES.BAZAAR) {
      // Filter only approved vendors
      const approvedVendors = event.vendors?.filter(
        (vendorEntry: any) => vendorEntry.RequestData?.status === "approved"
      ) || [];

      if (approvedVendors.length === 0) {
        throw createError(404, "No approved vendors to export for this bazaar");
      }

      // Create worksheet for bazaar booth attendees
      const worksheet = workbook.addWorksheet("Bazaar Booth Attendees");
      worksheet.columns = [
        { header: "Vendor/Booth Attendee Name", key: "Name", width: 40 },
      ];
      // Apply header style
      const headerCell = worksheet.getRow(1).getCell(1);
      headerCell.value = "Vendor/Attendee Name";
      applyHeaderStyle(headerCell);

      // Populate rows with approved vendors and their attendees
      approvedVendors.forEach((vendorEntry: any) => {
        const vendorName = vendorEntry.vendor?.companyName || "Unknown Vendor";

        const vendorRow = worksheet.addRow({ Name: `VENDOR: ${vendorName}` });
        applyVendorHeaderStyle(vendorRow.getCell(1));

        const bazaarAttendees = vendorEntry.RequestData?.bazaarAttendees || [];
        const attendees = bazaarAttendees.map((attendee: IBoothAttendee) => ({
          name: attendee.name,
        }));
        attendees.forEach((attendee: IBoothAttendee) => {
          worksheet.addRow({ Name: `  - ${attendee.name}` });
        });

        // Add an empty row for visual separation after the vendor group
        worksheet.addRow([]);
      });
    } else {
      const attendees = event.attendees as any[];
      const plainAttendees = attendees.map((attendee) => attendee.toObject());
      const worksheet = workbook.addWorksheet("Attendees");
      worksheet.columns = [
        { header: "First Name", key: "firstName", width: 20 },
        { header: "Last Name", key: "lastName", width: 20 },
      ];
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => applyHeaderStyle(cell));

      plainAttendees.forEach((attendee) => {
        worksheet.addRow({
          firstName: attendee.firstName,
          lastName: attendee.lastName,
        });
      });
    }
    return (await workbook.xlsx.writeBuffer()) as any;
  }

  async checkUpcomingEvents() {
    const now = new Date();
    now.setSeconds(0, 0);

    // Get all upcoming events (events that haven't started yet)
    const allEvents = await this.eventRepo.findAll({
      eventStartDate: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    // Filter events for 1-day and 1-hour reminders by combining date and time
    const oneDayEvents: IEvent[] = [];
    const oneHourEvents: IEvent[] = [];

    for (const event of allEvents) {
      // Combine eventStartDate with eventStartTime to get the full datetime
      const eventDate = new Date(event.eventStartDate);
      
      if (event.eventStartTime) {
        const [hours, minutes] = event.eventStartTime.split(':').map(Number);
        eventDate.setHours(hours || 0, minutes || 0, 0, 0);
      }

      // Check for 1-day reminder
      if (eventDate.getTime() - now.getTime() == 24 * 60 * 60 * 1000) {
        oneDayEvents.push(event);
      }
      
      // Check for 1-hour reminder
      if (eventDate.getTime() - now.getTime() == 60 * 60 * 1000) {
        oneHourEvents.push(event);
      }
    }

    // Send 1-day reminders
    for (const event of oneDayEvents) {
      await this.sendReminderToAttendees(event, "1 day");
      console.log(`Sent 1-day reminder for event: ${event.eventName}`);
    }

    // Send 1-hour reminders
    for (const event of oneHourEvents) {
      await this.sendReminderToAttendees(event, "1 hour");
      console.log(`Sent 1-hour reminder for event: ${event.eventName}`);
    }

    // Clear waitlists for events that have started
    const startedEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.eventStartDate);
      
      if (event.eventStartTime) {
        const [hours, minutes] = event.eventStartTime.split(':').map(Number);
        eventDate.setHours(hours || 0, minutes || 0, 0, 0);
      }

      // Event has started if current time is past event start time
      return eventDate.getTime() <= now.getTime();
    });

    // Clear waitlists for started events
    for (const event of startedEvents) {
      if (
        (event as any).waitlist &&
        Array.isArray((event as any).waitlist) &&
        (event as any).waitlist.length > 0
      ) {
        (event as any).waitlist = [];
        await event.save();
        console.log(`Cleared waitlist for event: ${event.eventName}`);
      }
    }
  }

  private async sendReminderToAttendees(event: any, timeframe: string) {
    const attendees = event.attendees || [];

    for (const userId of attendees) {
      await NotificationService.sendNotification({
        userId,
        type: "EVENT_REMINDER",
        title: `Event Reminder: ${event.eventName}`,
        message: `The event "${event.eventName}" starts in ${timeframe}`,
        createdAt: new Date(),
      } as Notification);
    }
  }

  /**
   * Add user to event waitlist
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

    // Remove user from waitlist
    event.waitlist.splice(waitlistIndex, 1);
    await event.save();
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
      status: waitlistEntry.status,
      paymentDeadline: waitlistEntry.paymentDeadline,
      joinedAt: waitlistEntry.joinedAt,
    };
  }

  /**
   * Promote users from waitlist to pending payment or direct registration
   * Handles Cases 1-3 based on available slots
   * @param eventId - Event ID
   * @param freedSlots - Number of spots that became available
   */
  async promoteFromWaitlist(
    eventId: string,
    freedSlots: number
  ): Promise<void> {
    console.log("[PROMOTE] Starting promoteFromWaitlist for event:", eventId, "slots:", freedSlots);
    
    // First get base event to determine type
    const baseEvent = await this.eventRepo.findById(eventId);
    if (!baseEvent) {
      console.log("[PROMOTE] Base event not found, exiting");
      return; // Event not found, skip silently
    }

    console.log("[PROMOTE] Event type:", baseEvent.type);

    // Use correct discriminator repository to access waitlist
    let event: any;
    if (baseEvent.type === EVENT_TYPES.TRIP) {
      event = await this.tripRepo.findById(eventId);
    } else if (baseEvent.type === EVENT_TYPES.WORKSHOP) {
      event = await this.workshopRepo.findById(eventId);
    } else {
      console.log("[PROMOTE] Event type doesn't support waitlist, exiting");
      return; // Other event types don't have waitlists
    }

    if (!event) {
      console.log("[PROMOTE] Event not found in discriminator repo, exiting");
      return;
    }

    console.log("[PROMOTE] Waitlist exists:", !!event.waitlist);
    console.log("[PROMOTE] Waitlist length:", event.waitlist?.length || 0);
    console.log("[PROMOTE] Waitlist entries:", JSON.stringify(event.waitlist, null, 2));

    if (!event.waitlist || event.waitlist.length === 0) {
      console.log("[PROMOTE] No waitlist or empty, exiting");
      return; // No one on waitlist
    }

    // Only process users with status 'waitlist' (not already in pending_payment)
    const waitingUsers = event.waitlist.filter(
      (entry: any) => entry.status === "waitlist"
    );

    console.log("[PROMOTE] Waiting users count:", waitingUsers.length);

    if (waitingUsers.length === 0) {
      console.log("[PROMOTE] No users with 'waitlist' status, exiting");
      return; // No users waiting
    }

    // Calculate how many users to promote (min of freed slots and waiting users)
    const usersToPromote = Math.min(freedSlots, waitingUsers.length);

    console.log("[PROMOTE] Users to promote:", usersToPromote);

    // Get the first X users from waitlist (FIFO)
    const promotedUsers = waitingUsers.slice(0, usersToPromote);

    // Check if event is free or paid
    const isFreeEvent = !event.price || event.price === 0;

    console.log("[PROMOTE] Event price:", event.price);
    console.log("[PROMOTE] Is free event:", isFreeEvent);

    for (const waitlistEntry of promotedUsers) {
      console.log("[PROMOTE] Processing user:", waitlistEntry.userId);
      if (isFreeEvent) {
        // Free event: auto-register immediately
        await this.autoRegisterFreeEvent(eventId, waitlistEntry.userId.toString());
      } else {
        // Paid event: move to pending_payment with configurable deadline
        console.log("[PROMOTE] Paid event - setting up payment deadline");
        const paymentDeadline = new Date();
        paymentDeadline.setTime(paymentDeadline.getTime() + (WAITLIST_DEADLINE_SECONDS * 1000));
        
        console.log("[PROMOTE] Payment deadline set to:", paymentDeadline);
        console.log("[PROMOTE] Deadline in seconds:", WAITLIST_DEADLINE_SECONDS);

        // Update waitlist entry
        const entryIndex = event.waitlist!.findIndex(
          (e: any) => e.userId.toString() === waitlistEntry.userId.toString()
        );

        console.log("[PROMOTE] Entry index found:", entryIndex);

        if (entryIndex !== -1) {
          event.waitlist![entryIndex].status = "pending_payment";
          event.waitlist![entryIndex].paymentDeadline = paymentDeadline;
          event.waitlist![entryIndex].notifiedAt = new Date();
          console.log("[PROMOTE] Updated entry to pending_payment");
        } else {
          console.log("[PROMOTE] WARNING: Entry not found in waitlist");
        }

        // Send promotion email with payment deadline
        // This will be handled by email service (to be implemented)
        const user = await this.userService.getUserById(
          waitlistEntry.userId.toString()
        );
        console.log("[PROMOTE] User found:", !!user, user?.email);
        if (user) {
          // Import will be added when email service is implemented
          try {
            const { sendWaitlistPromotionEmail } = await import(
              "./emailService"
            );
            console.log("[PROMOTE] Sending promotion email to:", user.email);
            await sendWaitlistPromotionEmail(
              user.email,
              (user as any).firstName && (user as any).lastName
                ? `${(user as any).firstName} ${(user as any).lastName}`
                : user.email,
              event.eventName,
              paymentDeadline,
              event._id!.toString()
            );
            console.log("[PROMOTE] Email sent successfully");
          } catch (emailError) {
            console.error("[PROMOTE] Error sending email:", emailError);
          }
        }
      }
    }

    console.log("[PROMOTE] Saving event with updated waitlist");
    await event.save();
    console.log("[PROMOTE] Event saved successfully");
  }

  /**
   * Auto-register user for free events when promoted from waitlist
   * @param eventId - Event ID
   * @param userId - User ID to register
   */
  async autoRegisterFreeEvent(
    eventId: string,
    userId: string
  ): Promise<void> {
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
      return; // Other event types don't have waitlists
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
    const user = await this.userService.getUserById(userId);
    if (user) {
      const { sendWaitlistAutoRegisteredEmail } = await import(
        "./emailService"
      );
      await sendWaitlistAutoRegisteredEmail(
        user.email,
        (user as any).firstName && (user as any).lastName
          ? `${(user as any).firstName} ${(user as any).lastName}`
          : user.email,
        event.eventName,
        event.eventStartDate,
        event.location
      );
    }
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
      const user = await this.userService.getUserById(
        entry.userId.toString()
      );
      if (user) {
        const { sendWaitlistDeadlineExpiredEmail } = await import(
          "./emailService"
        );
        await sendWaitlistDeadlineExpiredEmail(
          user.email,
          (user as any).firstName && (user as any).lastName
            ? `${(user as any).firstName} ${(user as any).lastName}`
            : user.email,
          event.eventName
        );
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
