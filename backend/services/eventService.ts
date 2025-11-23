import { IEvent } from "../interfaces/models/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import { EVENT_TYPES } from "../constants/events.constants";
import { mapEventDataByType } from "../utils/mapEventDataByType";
import { Trip } from "../schemas/event-schemas/tripSchema";
import { ITrip } from "../interfaces/models/trip.interface";
import { Workshop } from "../schemas/event-schemas/workshopEventSchema";
import { Conference } from "../schemas/event-schemas/conferenceEventSchema";
import { IConference } from "../interfaces/models/conference.interface";
import { IWorkshop } from "../interfaces/models/workshop.interface";
import Stripe from "stripe";
import { sendCommentDeletionWarningEmail } from "./emailService";
import { UserService } from "./userService";
import mongoose from "mongoose";
import { IReview } from "../interfaces/models/review.interface";
import { IBoothAttendee } from "../interfaces/models/platformBooth.interface";
import ExcelJS from "exceljs";
import { VendorEventsService } from "./vendorEventsService";
import { UserRole } from "../constants/user.constants";
const { Types } = require("mongoose");

const STRIPE_DEFAULT_CURRENCY = process.env.STRIPE_DEFAULT_CURRENCY || "usd";
const STRIPE_MIN_AMOUNT_CENTS = 50;

export class EventsService {
  private eventRepo: GenericRepository<IEvent>;
  private tripRepo: GenericRepository<ITrip>;
  private workshopRepo: GenericRepository<IWorkshop>;
  private conferenceRepo: GenericRepository<IConference>;
  private stripe?: Stripe;
  private userService: UserService;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.tripRepo = new GenericRepository(Trip);
    this.workshopRepo = new GenericRepository(Workshop);
    this.conferenceRepo = new GenericRepository(Conference);
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
    if (userRole !== "ADMINISTRATION") {
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

    if (event.type === EVENT_TYPES.BAZAAR || event.type === EVENT_TYPES.TRIP) {
      if (new Date(event.eventStartDate) < new Date()) {
        // If the event has already started, prevent updates
        throw createError(
          400,
          "Cannot update bazaars & trips that have already started"
        );
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

    let updatedEvent;

    if (event.type === EVENT_TYPES.TRIP) {
      updatedEvent = await this.tripRepo.update(eventId, updateData);
    } else if (event.type === EVENT_TYPES.CONFERENCE) {
      updatedEvent = await this.conferenceRepo.update(eventId, updateData);
    } else {
      updatedEvent = await this.eventRepo.update(eventId, updateData);
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

    // Add user to attendees
    console.log(userId);
    event.attendees?.push(userId);
    await event.save();

    // Add event to user's registered events
    const eventObjectId = event._id as mongoose.Schema.Types.ObjectId;
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
      if (!event.vendors || event.vendors.length === 0) {
        throw createError(404, "No vendors to export for this bazaar");
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

      // Populate rows with vendors and their attendees
      event.vendors.forEach((vendorEntry: any) => {
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
}
