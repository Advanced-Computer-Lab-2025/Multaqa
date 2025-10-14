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
import { BOOTH_LOCATIONS } from "../constants/boothLocations.constants";
import { PlatformBooth } from "../schemas/event-schemas/platformBoothEventSchema";
import { IPlatformBooth } from "../interfaces/platformBooth.interface";

export class VendorEventsService {
  private vendorRepo: GenericRepository<IVendor>;
  private eventRepo: GenericRepository<IEvent>;
  private platformBoothRepo: GenericRepository<IPlatformBooth>;

  constructor() {
    // Vendor is a discriminator of User, so use User model to query vendors
    this.vendorRepo = new GenericRepository(Vendor);
    this.eventRepo = new GenericRepository(Event);
    this.platformBoothRepo = new GenericRepository(PlatformBooth);
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
  ): Promise<IApplicationResult> {
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

      //create a new PlatformBooth event for this vendor with status pending
      await this.platformBoothRepo.create({
        eventName: vendor.companyName + " Booth",
        type: EVENT_TYPES.PLATFORM_BOOTH,
        archived: false,
        attendees: [],
        allowedUsers: [],
        reviews: [],
        //TODO FIGURE OUT THE DATES
        eventStartDate: new Date(), // You may want to set this dynamically
        eventEndDate: new Date(), // Placeholder far future date
        eventStartTime: "09:00", // Set as needed
        eventEndTime: "18:00", // Set as needed
        registrationDeadline: new Date(), // Set as needed
        location: "GUC", // Set as needed
        description: "Platform booth event for vendor",
        vendor: vendorId,
        RequestData: {
          boothSetupDuration: data.value.boothSetupDuration,
          boothLocation: data.value.boothLocation,
          boothAttendees: data.value.boothAttendees,
          boothSize: data.value.boothSize,
          status: applicationStatus,
        },
      });
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
  async getAvailableBooths(startDate: any, endDate: any): Promise<string[]> {
    if (!startDate || !endDate) {
      throw createError(
        400,
        "Missing required query parameters: startDate and endDate"
      );
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw createError(400, "Invalid date format for startDate or endDate");
    }

    if (start >= end) {
      throw createError(400, "startDate must be before endDate");
    }

    // Find all platform booth events that overlap with the given date range
    const overlappingEvents = await this.eventRepo.findAll({
      type: EVENT_TYPES.PLATFORM_BOOTH,
      $or: [
        {
          eventStartDate: { $lt: end },
          eventEndDate: { $gt: start },
        },
      ],
    });

    // Extract booked booth locations from overlapping events
    const bookedBooths = new Set<string>();
    for (const event of overlappingEvents) {
      if (
        event.RequestData &&
        event.RequestData.boothLocation &&
        event.RequestData.status === Event_Request_Status.APPROVED
      ) {
        bookedBooths.add(event.RequestData.boothLocation);
      }
    }

    // All possible booth locations
    const allBooths = Object.values(BOOTH_LOCATIONS);
    const availableBooths = allBooths.filter(
      (booth) => !bookedBooths.has(booth)
    );
    return availableBooths;
  }
}
