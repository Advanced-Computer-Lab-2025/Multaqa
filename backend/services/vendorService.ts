import { IEvent } from "../interfaces/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import { IVendor } from "../interfaces/vendor.interface";
import { Vendor } from "../schemas/stakeholder-schemas/vendorSchema";
import { Event_Request_Status } from "../constants/user.constants";
import { EVENT_TYPES } from "../constants/events.constants";

export class VendorService {
  private eventRepo: GenericRepository<IEvent>;
  private vendorRepo: GenericRepository<IVendor>;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.vendorRepo = new GenericRepository(Vendor);
  }

  async getVendorEvents(id: string): Promise<IEvent[]> {
    const options = {
      populate: [
        {
          path: "requestedEvents",
          select:
            "event_name event_start_date event_end_date location price allowedUsers",
        } as any,
      ],
    };
    const events = await this.eventRepo.findAll({ _id: id }, options);
    return events;
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
      event.RequestData = data;
    } else if (event.type === EVENT_TYPES.BAZAAR) {
      event.vendors?.push({ vendor: vendorId, RequestData: data });
    } else {
      throw createError(
        400,
        "Invalid Event Type, must be 'bazaar' or 'platformBooth'"
      );
    }

    await event.save();
    await vendor.save();
    // console.log(event);

    // // Save changes to vendor and event
    // const updatedVendor = await this.vendorRepo.update(vendorId, vendor);
    // const updatedEvent = await this.eventRepo.update(eventId, event);

    return { vendor: vendor, event: event };
  }
}
