import { IEvent } from "../interfaces/event.interface";
import { IUser } from "../interfaces/user.interface";
import { IVendor } from "../interfaces/vendor.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import { Vendor } from "../schemas/stakeholder-schemas/vendorSchema";
import { Event_Request_Status } from "../constants/user.constants";
import { EVENT_TYPES } from "../constants/events.constants";

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
  ): Promise<{ vendor: IVendor | null; event: IEvent | null }> {
    const vendor = await this.vendorRepo.findById(vendorId);
    const event = await this.eventRepo.findById(eventId);

    if (!vendor || !event) {
      throw createError(404, "Vendor or Event not found");
    }

    //add request to the vendor
    vendor?.requestedEvents.push({
      event: eventId,
      RequestData: data,
      status: Event_Request_Status.PENDING,
    });

    //add request to the event
    if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
      event.vendor = vendorId;
      event.RequestData = { data, status: Event_Request_Status.PENDING };
    } else if (event.type === EVENT_TYPES.BAZAAR) {
      event.vendors?.push({
        vendor: vendorId,
        RequestData: { data, status: Event_Request_Status.PENDING },
      });
    } else {
      throw createError(
        400,
        "Invalid Event Type, must be 'bazaar' or 'platformBooth'"
      );
    }

    await event.save();
    await vendor.save();

    return { vendor: vendor, event: event };
  }
}
