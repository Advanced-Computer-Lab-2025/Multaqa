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
import mongoose from "mongoose";
import { IReview } from "../interfaces/models/review.interface";
import { IUser } from "../interfaces/models/user.interface";
import { User } from "../schemas/stakeholder-schemas/userSchema";
const { Types } = require("mongoose");

const STRIPE_DEFAULT_CURRENCY = process.env.STRIPE_DEFAULT_CURRENCY || "usd";
const STRIPE_MIN_AMOUNT_CENTS = 50;

export class EventsService {
  private eventRepo: GenericRepository<IEvent>;
  private tripRepo: GenericRepository<ITrip>;
  private workshopRepo: GenericRepository<IWorkshop>;
  private conferenceRepo: GenericRepository<IConference>;
  private userRepo: GenericRepository<IUser>;
  private stripe?: Stripe;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.tripRepo = new GenericRepository(Trip);
    this.workshopRepo = new GenericRepository(Workshop);
    this.conferenceRepo = new GenericRepository(Conference);
    this.userRepo = new GenericRepository(User);
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
    sort?: boolean
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
    if (type) filter.type = { $regex: new RegExp(`^${type}$`, "i") };
    if (location) filter.location = { $regex: new RegExp(location, "i") };

    let events = await this.eventRepo.findAll(filter, {
      populate: [
        { path: "associatedProfs", select: "firstName lastName email" },
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

    if (sort) {
      events = events.sort((a: any, b: any) => {
        return (
          new Date(a.eventStartDate).getTime() -
          new Date(b.eventEndDate).getTime()
        );
      });
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      return events.filter(
        (event: any) =>
          searchRegex.test(event.eventName) ||
          searchRegex.test(event.type) ||
          event.associatedProfs?.some(
            (prof: any) =>
              searchRegex.test(prof?.firstName) ||
              searchRegex.test(prof?.lastName)
          )
      );
    }

    return events;
  }

  async getAllWorkshops(): Promise<IEvent[]> {
    const filter: any = { type: EVENT_TYPES.WORKSHOP };
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
    // Check if user is already registered
    const isAlreadyRegistered = event.attendees?.some(
      (attendeeId: { toString: () => string }) =>
        attendeeId.toString() === userId.toString()
    );
    if (isAlreadyRegistered) {
      throw createError(409, "User already registered for this event");
    }

    // Add user to attendees
    console.log(userId);
    event.attendees?.push(userId);
    await event.save();
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

  async createReview(eventId: string, userId: string, comment?: string, rating?: number): Promise<IReview> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError(404, 'User not found');
    }

    if (event.reviews?.some((review) => review.reviewer.toString() === userId.toString())) {
      throw createError(409, "User has already submitted a review for this event");
    }

    const newReview: IReview = {
      reviewer: new mongoose.Types.ObjectId(userId),
      comment: comment,
      rating: rating,
      createdAt: new Date(),
    };

    event.reviews?.push(newReview);
    await event.save();

    // Get the last added review
    const populatedEvent = await this.eventRepo.findById(eventId, {
      populate: [{ path: "reviews.reviewer", select: "firstName lastName email role" }] as any[]
    });
    if (!populatedEvent) {
      throw createError(404, "Event not found after saving review");
    }
    const createdReview = populatedEvent.reviews?.slice(-1)[0];
    return createdReview;
  }

  async updateReview(eventId: string, userId: string, comment?: string, rating?: number): Promise<IReview> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw createError(404, 'User not found');
    }

    const event = await this.eventRepo.findById(eventId, {
      populate: [{ path: "reviews.reviewer", select: "firstName lastName email role" }] as any[]
    });
    if (!event) {
      throw createError(404, "Event not found");
    }

    const reviewIndex = event.reviews?.findIndex(
      (review) => {
        return (review.reviewer._id as any).toString() === userId.toString();
      }
    );
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
}
