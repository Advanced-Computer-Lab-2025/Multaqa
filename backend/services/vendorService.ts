import { IEvent } from "../interfaces/models/event.interface";
import { IVendor } from "../interfaces/models/vendor.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import { Vendor } from "../schemas/stakeholder-schemas/vendorSchema";
import { Event_Request_Status } from "../constants/user.constants";
import { EVENT_TYPES } from "../constants/events.constants";
import { applicationResult } from "../interfaces/applicationResult.interface";

export class VendorService {
  private vendorRepo: GenericRepository<IVendor>;
  private eventRepo: GenericRepository<IEvent>;

  constructor() {
    // Vendor is a discriminator of User, so use User model to query vendors
    this.vendorRepo = new GenericRepository(Vendor);
    this.eventRepo = new GenericRepository(Event);
  }

  /**
   * Returns the list of events requested by the vendor (populated with selected fields)
   * Steps:
   * - Find the vendor by id and populate requestedEvents.event
   * - If vendor not found -> throw 404
   * - Map populated requestedEvents to an array of events, filtering out any nulls
   */
  async getVendorEvents(id: string): Promise<Partial<any>> {
    // populate the nested 'event' field inside requestedEvents
    const vendor = await this.vendorRepo.findById(id, {
      populate: ["requestedEvents.event"],
    });

    if (!vendor) {
      throw createError(404, "Vendor not found");
    }

    return (vendor as any).requestedEvents;
  }

  /**
   * This method allows a vendor to apply to either a bazaar or a platform booth event
   * adds to the vendor and event documents accordingly with a default status of PENDING.
   * @param vendorId  vendor's ID
   * @param eventId event's ID
   * @param data validated form data
   * @param eventType type of event ("bazaar" or "platformBooth")
   * @returns updated vendor & event document, or null if operation fails
   */
  async applyToBazaarOrBooth(
    vendorId: string,
    eventId: string,
    data: any
  ): Promise<applicationResult> {
    const vendor = await this.vendorRepo.findById(vendorId);
    const event = await this.eventRepo.findById(eventId);

    if (!vendor || !event) {
      throw createError(404, "Vendor or Event not found");
    }

    // Default status
    const applicationStatus = Event_Request_Status.PENDING;

    // Add request to vendor
    vendor.requestedEvents.push({
      event: eventId,
      RequestData: data,
      status: applicationStatus,
    });

    // Add request to event depending on its type
    if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
      if (data.value.eventType === EVENT_TYPES.BAZAAR) {
        throw createError(
          400,
          "Mismatched event type in RequestData for platform booth application"
        );
      }

      event.vendor = vendorId;
      event.RequestData = { ...data.value, status: applicationStatus };

    } else if (event.type === EVENT_TYPES.BAZAAR) {
      if (data.value.eventType === EVENT_TYPES.PLATFORM_BOOTH) {
        throw createError(
          400,
          "Mismatched event type in RequestData for bazaar application"
        );
      }

      event.vendors?.push({
        vendor: vendorId,
        RequestData: { ...data.value, status: applicationStatus },
      });
    } else {
      throw createError(
        400,
        "Invalid Event Type, must be 'bazaar' or 'platform_booth'"
      );
    }

    await event.save();
    await vendor.save();

    return {
      vendor,
      event,
      applicationStatus,
    };
  }

}
