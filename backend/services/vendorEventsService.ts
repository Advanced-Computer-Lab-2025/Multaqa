import { IEvent } from "../interfaces/models/event.interface";
import {
  IVendor,
  IRequestedEvent,
  VendorRequest,
} from "../interfaces/models/vendor.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import { Vendor } from "../schemas/stakeholder-schemas/vendorSchema";
import { Event_Request_Status } from "../constants/user.constants";
import { EVENT_TYPES } from "../constants/events.constants";
import { IApplicationResult } from "../interfaces/applicationResult.interface";

export class VendorEventsService {
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
  async getVendorUpcomingEvents(id: string): Promise<IRequestedEvent[]> {
    // populate the nested 'event' field inside requestedEvents
    const vendor = await this.vendorRepo.findById(id, {
      populate: ["requestedEvents.event"],
    });

    if (!vendor) {
      throw createError(404, "Vendor not found");
    }

    return vendor.requestedEvents;
  }

  /**
   * This method allows a vendor to apply to a platform booth event
   * @param vendorId vendor's ID
   * @param data validated form data
   * @returns updated vendor & event document
   */
  async applyToPlatformBooth(
    vendorId: string,
    data: any
  ): Promise<IApplicationResult> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw createError(404, "Vendor not found");
    }

    // Default status
    const applicationStatus = Event_Request_Status.PENDING;

    // Create a new platform booth event for this vendor
    const event = await this.eventRepo.create({
      type: EVENT_TYPES.PLATFORM_BOOTH,
      eventName: `${vendor.companyName} Booth`,
      vendor: vendorId,
      RequestData: { ...data.value, status: applicationStatus },
      archived: false,
      attendees: [],
      allowedUsers: [],
      registrationDeadline: new Date(),
      // Set default dates based on booth setup duration
      eventStartDate: new Date(), // TODO: Calculate proper start date
      eventEndDate: new Date(
        Date.now() + data.value.boothSetupDuration * 7 * 24 * 60 * 60 * 1000
      ),
      eventStartTime: "09:00",
      eventEndTime: "18:00",
      location: data.value.boothLocation,
      description: `Platform booth for ${vendor.companyName}`,
    });

    // Add request to vendor's requestedEvents
    vendor.requestedEvents.push({
      event: event._id as string,
      RequestData: data.value,
      status: applicationStatus,
    });

    await vendor.save();

    return {
      vendor,
      event,
      applicationStatus,
    };
  }

  /**
   * This method allows a vendor to apply to a bazaar event
   * @param vendorId vendor's ID
   * @param eventId bazaar event's ID
   * @param data validated form data
   * @returns updated vendor & event document
   */
  async applyToBazaar(
    vendorId: string,
    eventId: string,
    data: any
  ): Promise<IApplicationResult> {
    const vendor = await this.vendorRepo.findById(vendorId);
    const event = await this.eventRepo.findById(eventId);

    if (!vendor || !event) {
      throw createError(404, "Vendor or Event not found");
    }

    if (event.type !== EVENT_TYPES.BAZAAR) {
      throw createError(400, "Event is not a bazaar");
    }

    // Default status
    const applicationStatus = Event_Request_Status.PENDING;

    // Add request to vendor's requestedEvents
    vendor.requestedEvents.push({
      event: eventId,
      RequestData: data.value,
      status: applicationStatus,
    });

    // Add vendor to bazaar's vendors list
    event.vendors?.push({
      vendor: vendorId,
      RequestData: { ...data.value, status: applicationStatus },
    });

    await event.save();
    await vendor.save();

    return {
      vendor,
      event,
      applicationStatus,
    };
  }

  async getVendorsRequest(eventId: string): Promise<VendorRequest[]> {
    const event = await this.eventRepo.findById(eventId, {
      populate: [
        { path: "vendor", select: "companyName logo" },
        { path: "vendors.vendor", select: "companyName logo" },
      ] as any[],
    });

    if (!event) {
      throw createError(404, "Event not found");
    }

    let vendors: any[] = [];
    if (event.type === EVENT_TYPES.BAZAAR) {
      for (const vendorEntry of event.vendors || []) {
        if (vendorEntry.RequestData.status === Event_Request_Status.PENDING) {
          vendors.push({
            vendor: vendorEntry.vendor,
            RequestData: vendorEntry.RequestData,
          });
        }
      }
    } else if (event.type === EVENT_TYPES.PLATFORM_BOOTH && event.vendor) {
      if (event.RequestData.status === Event_Request_Status.PENDING) {
        vendors.push({
          vendor: event.vendor,
          RequestData: event.RequestData,
        });
      }
    }

    if (!vendors || vendors.length === 0) {
      throw createError(404, "No pending vendor requests found for this event");
    }
    return vendors;
  }

  async getVendorsRequestsDetails(
    eventId: string,
    vendorId: string
  ): Promise<VendorRequest> {
    const event = await this.eventRepo.findById(eventId, {
      populate: [
        { path: "vendor", select: "companyName logo" },
        { path: "vendors.vendor", select: "companyName logo" },
      ] as any[],
    });

    if (!event) {
      throw createError(404, "Event not found");
    }

    let vendorRequest: any;

    // Check if it's a bazaar with multiple vendors and get the specific vendor's request
    if (event.type === EVENT_TYPES.BAZAAR && event.vendors) {
      let vendorreq = event.vendors.find(
        (v) =>
          typeof v.vendor !== "string" &&
          v.vendor._id?.toString() === vendorId.toString()
      );
      if (vendorreq) {
        vendorRequest = {
          vendor: vendorreq.vendor,
          RequestData: vendorreq.RequestData,
        };
      }
    }
    // Check if it's a platform booth
    else if (event.type === EVENT_TYPES.PLATFORM_BOOTH && event.vendor) {
      if (
        typeof event.vendor !== "string" &&
        event.vendor._id?.toString() === vendorId.toString()
      ) {
        vendorRequest = {
          vendor: event.vendor,
          RequestData: event.RequestData,
        };
      }
    }

    if (!vendorRequest) {
      throw createError(404, "Vendor has not applied to this event");
    }

    return vendorRequest;
  }

  async respondToVendorRequest(
    eventId: string,
    vendorId: string,
    reqBody: { status: "approved" | "rejected" }
  ): Promise<void> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw createError(404, "Event not found");
    }

    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw createError(404, "Vendor not found");
    }

    const { status } = reqBody;
    if (status !== "approved" && status !== "rejected") {
      throw createError(
        400,
        "Invalid status. Must be 'approved' or 'rejected'"
      );
    }

    // Update vendor's requestedEvents
    const requestIndex = vendor.requestedEvents.findIndex(
      (req) => req.event?.toString() === eventId.toString()
    );

    if (requestIndex === -1) {
      throw createError(404, "Vendor has not applied to this event");
    }

    vendor.requestedEvents[requestIndex].status =
      status as Event_Request_Status;
    vendor.markModified("requestedEvents");
    await vendor.save();

    // Update event based on type
    if (event.type === EVENT_TYPES.BAZAAR) {
      const vendorIndex = event.vendors?.findIndex(
        (ve) => ve.vendor?.toString() === vendorId.toString()
      );

      if (vendorIndex === -1 || vendorIndex === undefined || !event.vendors) {
        throw createError(404, "Vendor not found in event");
      }

      event.vendors[vendorIndex].RequestData.status = status;
      event.markModified("vendors");
    } else if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
      if (!event.vendor || event.vendor.toString() !== vendorId.toString()) {
        throw createError(404, "Vendor not found in event");
      }

      if (!event.RequestData) {
        throw createError(500, "Event RequestData is missing");
      }

      event.RequestData.status = status;
      event.markModified("RequestData");
    } else {
      throw createError(400, "Invalid event type");
    }

    await event.save();
  }
}
