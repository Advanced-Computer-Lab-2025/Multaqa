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
import { Event_Request_Status, UserRole } from "../constants/user.constants";
import { EVENT_TYPES } from "../constants/events.constants";
import { IApplicationResult } from "../interfaces/applicationResult.interface";
import { BOOTH_LOCATIONS } from "../constants/booth.constants";
import { sendApplicationStatusEmail } from "./emailService";
import { INotification } from "../interfaces/models/notification.interface";
import { NotificationService } from "./notificationService";

export class VendorEventsService {
  private vendorRepo: GenericRepository<IVendor>;
  private eventRepo: GenericRepository<IEvent>;
  private notificationService: NotificationService;

  constructor() {
    // Vendor is a discriminator of User, so use User model to query vendors
    this.vendorRepo = new GenericRepository(Vendor);
    this.eventRepo = new GenericRepository(Event);
    this.notificationService = new NotificationService();
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

    // Convert to plain object to avoid Mongoose document metadata
    const plainVendor = vendor.toObject();
    return plainVendor.requestedEvents;
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

    await this.notificationService.sendNotification({
      role: [UserRole.ADMINISTRATION], // Notify EventsOffice/Admin
      type: "VENDOR_PENDING_REQUEST",
      title: "New Vendor Application",
      message: `Vendor "${vendor.companyName}" has applied for a platform booth event.`,
      createdAt: new Date(),
    } as INotification);

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

    const applied =
      Array.isArray(event.vendors) &&
      event.vendors.some((v: any) => v.vendor.toString() === vendorId);

    if (applied) {
      throw createError(400, "Vendor has already applied for this bazaar");
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

    await this.notificationService.sendNotification({
      role: [UserRole.ADMINISTRATION], // Notify EventsOffice/Admin
      type: "VENDOR_PENDING_REQUEST",
      title: "New Vendor Application",
      message: `Vendor "${vendor.companyName}" has applied for the bazaar event "${event.eventName}".`,
      createdAt: new Date()
    } as INotification);

    return {
      vendor,
      event,
      applicationStatus,
    };
  }

  async getVendorsRequest(): Promise<VendorRequest[]> {
    const events = await this.eventRepo.findAll(
      {},
      {
        populate: [
          { path: "vendor", select: "companyName logo taxCard" },
          { path: "vendors.vendor", select: "companyName logo taxCard" },
        ] as any[],
      }
    );

    let vendors: any[] = [];

    for (const event of events) {
      const eventDetails = {
        _id: event._id,
        name: event.eventName,
        type: event.type,
        startDate: event.eventStartDate,
        endDate: event.eventEndDate,
        location: event.location,
      };
      if (event.type === EVENT_TYPES.BAZAAR) {
        for (const vendorEntry of event.vendors || []) {
          vendors.push({
            vendor: vendorEntry.vendor,
            RequestData: vendorEntry.RequestData,
            event: eventDetails,
          });
        }
      } else if (event.type === EVENT_TYPES.PLATFORM_BOOTH && event.vendor) {
        vendors.push({
          vendor: event.vendor,
          RequestData: event.RequestData,
          event: eventDetails,
        });
      }
    }

    if (!vendors || vendors.length === 0) {
      throw createError(404, "No pending vendor requests found");
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

      const { boothSetupDuration } = event.RequestData;
      // Calculate start date: now + boothSetupDuration (in weeks)
      const now = new Date();
      event.eventStartDate = now;
      event.eventEndDate = new Date(
        now.getTime() + boothSetupDuration * 7 * 24 * 60 * 60 * 1000
      );
    } else {
      throw createError(400, "Invalid event type");
    }

    // Send application status email to vendor
    await sendApplicationStatusEmail(
      vendor.email,
      vendor.companyName,
      event.type === EVENT_TYPES.BAZAAR ? "bazaar" : "booth",
      event.eventName,
      status === "approved" ? "accepted" : "rejected",
      status === "rejected" ? event.RequestData?.rejectionReason : undefined,
      status === "approved" ? event.RequestData?.nextSteps : undefined
    );
    await event.save();
  }

  async getAvailableBooths(startDate: any, endDate: any): Promise<string[]> {
    // Input validation
    if (!startDate || !endDate) {
      throw createError(
        400,
        "Missing required query parameters: startDate and endDate"
      );
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    console.log({
      start,
      end,
      typeofStart: typeof start,
      typeofEnd: typeof end,
    });

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw createError(400, "Invalid date format for startDate or endDate");
    }

    if (start >= end) {
      throw createError(400, "startDate must be before endDate");
    }

    // First get all platform booth events
    const allPlatformBoothEvents = await this.eventRepo.findAll({
      type: "platform_booth",
      "RequestData.status": Event_Request_Status.APPROVED,
    });

    // Manually filter for overlapping events
    const overlappingEvents = allPlatformBoothEvents.filter((event) => {
      const eventStart = new Date(event.eventStartDate);
      const eventEnd = new Date(event.eventEndDate);

      // Events overlap if:
      // 1. Event starts before query period ends AND
      // 2. Event ends after query period starts
      return eventStart <= end && eventEnd >= start;
    });

    console.log("Overlapping Events:", overlappingEvents);

    // Get reserved booth locations from overlapping events
    const reservedBooths = new Set(
      overlappingEvents
        .map((event) => event.RequestData?.boothLocation)
        .filter(Boolean) // Remove undefined/null values
    );
    // Return all booth locations except reserved ones
    return Object.values(BOOTH_LOCATIONS).filter(
      (booth) => !reservedBooths.has(booth)
    );
  }

  /**
   * Allows a vendor to cancel their participation in an event if they haven't paid yet
   * Vendors can cancel when status is PENDING or PENDING_PAYMENT
   * Once status is APPROVED (payment completed), cancellation is not allowed
   * @param vendorId vendor's ID
   * @param eventId event's ID
   * @returns void
   */
  async cancelEventParticipation(
    vendorId: string,
    eventId: string
  ): Promise<void> {
    const vendor = await this.vendorRepo.findById(vendorId);
    const event = await this.eventRepo.findById(eventId);

    if (!vendor || !event) {
      throw createError(404, "Vendor or Event not found");
    }

    // Find the vendor's request for this event
    const requestIndex = vendor.requestedEvents.findIndex(
      (req) => req.event?.toString() === eventId.toString()
    );

    if (requestIndex === -1) {
      throw createError(404, "Vendor has not applied to this event");
    }

    const vendorRequest = vendor.requestedEvents[requestIndex];


    // For bazaar, log the vendor entry in the event
    if (event.type === EVENT_TYPES.BAZAAR && event.vendors) {
      const vendorInEvent = event.vendors.find(
        (ve) => ve.vendor?.toString() === vendorId.toString()
      );
      if (vendorInEvent) {
        console.log(
          "Bazaar Vendor Entry Status:",
          vendorInEvent.RequestData?.status
        );
      }
    }
    console.log("===================================");

    // Check if the vendor has already paid (status is APPROVED)
    if (vendorRequest.status === Event_Request_Status.APPROVED) {
      throw createError(
        400,
        "Cannot cancel - payment has already been completed for this event"
      );
    }

    // Allow cancellation if status is PENDING or PENDING_PAYMENT
    if (
      vendorRequest.status !== Event_Request_Status.PENDING &&
      vendorRequest.status !== Event_Request_Status.PENDING_PAYMENT
    ) {
      throw createError(
        400,
        `Cannot cancel event with status: ${vendorRequest.status}. Only PENDING or PENDING_PAYMENT requests can be cancelled.`
      );
    }

    // Remove the request from vendor's requestedEvents
    vendor.requestedEvents.splice(requestIndex, 1);
    vendor.markModified("requestedEvents");
    await vendor.save({ validateBeforeSave: false });

    // Update the event based on type
    if (event.type === EVENT_TYPES.BAZAAR) {
      // Remove vendor from bazaar's vendors list
      const vendorIndex = event.vendors?.findIndex(
        (ve) => ve.vendor?.toString() === vendorId.toString()
      );

      if (vendorIndex !== -1 && vendorIndex !== undefined && event.vendors) {
        event.vendors.splice(vendorIndex, 1);
        event.markModified("vendors");
        await event.save();
      }
    } else if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
      // For platform booth, delete the event entirely since it was created for this vendor
      if (event.vendor?.toString() === vendorId.toString()) {
        await this.eventRepo.delete(eventId);
      } else {
        throw createError(404, "Vendor not found in this platform booth event");
      }
    }
  }
}
