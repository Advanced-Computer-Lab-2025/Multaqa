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
import { Notification } from "./notificationService";
import { NotificationService } from "./notificationService";
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";
import { IBoothAttendee } from "../interfaces/models/platformBooth.interface";
import { sendApplicationStatusEmail, sendQRCodeEmail } from "./emailService";
import { generateQrCodeBuffer } from "../utils/qrcodeGenerator";
import { IUser } from "../interfaces/models/user.interface";
import { pdfGenerator } from "../utils/pdfGenerator";
import { IPoll } from "../interfaces/models/poll.interface"
import { Poll } from "../schemas/misc/pollSchema"

export class VendorEventsService {
  private vendorRepo: GenericRepository<IVendor>;
  private eventRepo: GenericRepository<IEvent>;
  private pollRepo: GenericRepository<IPoll>;

  constructor() {
    // Vendor is a discriminator of User, so use User model to query vendors
    this.vendorRepo = new GenericRepository(Vendor);
    this.eventRepo = new GenericRepository(Event);
    this.pollRepo = new GenericRepository(Poll);
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

    // Filter out archived events
    const filteredRequestedEvents = plainVendor.requestedEvents.filter(
      (reqEvent: any) => {
        // If event is not populated or is just an ObjectId, keep it
        if (
          !reqEvent ||
          !reqEvent.event ||
          typeof reqEvent.event === "string" ||
          !reqEvent.event._id
        ) {
          return true;
        }
        // If event is populated, filter out archived ones
        return !reqEvent.event.archived;
      }
    );

    return filteredRequestedEvents;
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

    const participationFee = data.value.participationFee;

    // Create a new platform booth event for this vendor
    const event = await this.eventRepo.create({
      type: EVENT_TYPES.PLATFORM_BOOTH,
      eventName: `${vendor.companyName} Booth`,
      vendor: vendorId,
      RequestData: {
        ...data.value,
        status: applicationStatus,
        participationFee,
      },
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
      event: event._id as unknown as string,
      RequestData: data.value,
      status: applicationStatus,
      QRCodeGenerated: false,
      hasPaid: false,
      participationFee,
    });

    await vendor.save();

    await NotificationService.sendNotification({
      role: [UserRole.ADMINISTRATION], // Notify EventsOffice/Admin
      adminRole: [
        AdministrationRoleType.EVENTS_OFFICE,
        AdministrationRoleType.ADMIN,
      ],
      type: "VENDOR_PENDING_REQUEST",
      title: "New Vendor Application",
      message: `Vendor "${vendor.companyName}" has applied for a platform booth event.`,
      createdAt: new Date(),
    } as Notification);

    return {
      vendor,
      event,
      applicationStatus,
      QRCodeGenerated: false,
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

    if (new Date() > event.eventStartDate) {
      throw createError(400, "Cannot apply to an event that has already started");
    }

    const applied =
      Array.isArray(event.vendors) &&
      event.vendors.some((v: any) => v.vendor.toString() === vendorId);

    if (applied) {
      throw createError(400, "Vendor has already applied for this bazaar");
    }

    // Default status
    const applicationStatus = Event_Request_Status.PENDING;

    // Use provided participation fee
    const participationFee = data.value.participationFee;

    // Add request to vendor's requestedEvents
    vendor.requestedEvents.push({
      event: eventId,
      RequestData: data.value,
      status: applicationStatus,
      QRCodeGenerated: false,
      hasPaid: false,
      participationFee,
    });

    // Add vendor to bazaar's vendors list
    event.vendors?.push({
      vendor: vendorId,
      RequestData: {
        ...data.value,
        status: applicationStatus,
        QRCodeGenerated: false,
        hasPaid: false,
        participationFee,
      },
    });

    await event.save();
    await vendor.save();

    await NotificationService.sendNotification({
      role: [UserRole.ADMINISTRATION], // Notify EventsOffice/Admin
      adminRole: [
        AdministrationRoleType.EVENTS_OFFICE,
        AdministrationRoleType.ADMIN,
      ],
      type: "VENDOR_PENDING_REQUEST",
      title: "New Vendor Application",
      message: `Vendor "${vendor.companyName}" has applied for the bazaar event "${event.eventName}".`,
      createdAt: new Date(),
    } as Notification);

    return {
      vendor,
      event,
      applicationStatus,
      QRCodeGenerated: false,
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
        { path: "vendor", select: "companyName logo taxCard" },
        { path: "vendors.vendor", select: "companyName logo taxCard" },
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

    // Map status to Event_Request_Status enum
    const mappedStatus =
      status === "approved"
        ? Event_Request_Status.APPROVED
        : Event_Request_Status.REJECTED;

    vendor.requestedEvents[requestIndex].status = mappedStatus;

    // Set payment deadline if status is approved (3 days from now)
    if (status === "approved") {
      const paymentDeadline = new Date();
      paymentDeadline.setDate(paymentDeadline.getDate() + 3);
      (vendor.requestedEvents[requestIndex] as any).paymentDeadline =
        paymentDeadline;
      (vendor.requestedEvents[requestIndex] as any).hasPaid = false;
    }

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

      // Set payment deadline if status is approved (3 days from now)
      if (status === "approved") {
        const paymentDeadline = new Date();
        paymentDeadline.setDate(paymentDeadline.getDate() + 3);
        event.vendors[vendorIndex].RequestData.paymentDeadline =
          paymentDeadline;
        event.vendors[vendorIndex].RequestData.hasPaid = false;
      }

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

      // Only update dates if status is approved
      if (status === "approved") {
        // Set payment deadline (3 days from now)
        const paymentDeadline = new Date();
        paymentDeadline.setDate(paymentDeadline.getDate() + 3);
        event.RequestData.paymentDeadline = paymentDeadline;
        event.RequestData.hasPaid = false;

        const { boothSetupDuration } = event.RequestData;
        // Calculate start date: now + boothSetupDuration (in weeks)
        const now = new Date();
        event.eventStartDate = now;
        event.eventEndDate = new Date(
          now.getTime() + boothSetupDuration * 7 * 24 * 60 * 60 * 1000
        );
      }
    } else {
      throw createError(400, "Invalid event type");
    }

    // Send application status email to vendor
    const paymentDeadline =
      status === "approved"
        ? (() => {
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 3);
            return deadline;
          })()
        : undefined;

    await sendApplicationStatusEmail(
      vendor.email,
      vendor.companyName,
      event.type === EVENT_TYPES.BAZAAR ? "bazaar" : "booth",
      event.eventName,
      status === "approved" ? "accepted" : "rejected",
      status === "rejected" ? event.RequestData?.rejectionReason : undefined,
      status === "approved" ? event.RequestData?.nextSteps : undefined,
      paymentDeadline
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
   * Vendors can cancel when hasPaid is false
   * Once hasPaid is true (payment completed), cancellation is not allowed
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

    // Check if the vendor has already paid by checking event's RequestData
    let hasPaid = false;
    if (event.type === EVENT_TYPES.BAZAAR && event.vendors) {
      const vendorInEvent = event.vendors.find(
        (ve) => ve.vendor?.toString() === vendorId.toString()
      );
      if (vendorInEvent?.RequestData?.hasPaid === true) {
        hasPaid = true;
      }
    } else if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
      if (event.RequestData?.hasPaid === true) {
        hasPaid = true;
      }
    }

    // Check if the vendor has already paid
    if (hasPaid) {
      throw createError(
        400,
        "Cannot cancel - payment has already been completed for this event"
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

  /**
   * Get all vendors participating in GUC loyalty program
   * @returns List of vendors with their loyalty program details
   */
  async getAllLoyaltyPartners(): Promise<
    Array<{
      vendorId: string;
      companyName: string;
      logo: any;
      loyaltyProgram: {
        discountRate: number;
        promoCode: string;
        termsAndConditions: string;
      };
    }>
  > {
    // Find all vendors that have a loyalty program (promoCode exists)
    const vendors = await this.vendorRepo.findAll({
      "loyaltyProgram.promoCode": { $exists: true, $ne: null },
    });

    // Map to return only necessary fields
    return vendors.map((vendor) => ({
      vendorId: (vendor as any)._id.toString(),
      companyName: vendor.companyName,
      logo: vendor.logo,
      loyaltyProgram: {
        discountRate: vendor.loyaltyProgram!.discountRate,
        promoCode: vendor.loyaltyProgram!.promoCode,
        termsAndConditions: vendor.loyaltyProgram!.termsAndConditions,
      },
    }));
  }

  /**
   * Apply to GUC loyalty program
   * @param vendorId - Vendor ID
   * @param loyaltyData - Discount rate, promo code, terms and conditions
   * @returns Updated vendor
   */
  async applyToLoyaltyProgram(
    vendorId: string,
    loyaltyData: {
      discountRate: number;
      promoCode: string;
      termsAndConditions: string;
    }
  ): Promise<IVendor> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw createError(404, "Vendor not found");
    }

    // Check if vendor already has a loyalty program
    if (vendor.loyaltyProgram && vendor.loyaltyProgram.promoCode) {
      throw createError(400, "Vendor already has a loyalty program");
    }

    // Update only the loyaltyProgram field via the repository to keep data access constrained
    const updatedVendor = await this.vendorRepo.update(vendorId, {
      loyaltyProgram: {
        discountRate: loyaltyData.discountRate,
        promoCode: loyaltyData.promoCode.toUpperCase(),
        termsAndConditions: loyaltyData.termsAndConditions,
      },
    });

    if (!updatedVendor) {
      throw createError(500, "Failed to update vendor loyalty program");
    }

    await NotificationService.sendNotification({
      role: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
      staffPosition: [StaffPosition.TA, StaffPosition.PROFESSOR, StaffPosition.STAFF],
      type: "LOYALTY_NEW_PARTNER",
      title: "New Loyalty Program Partner",
      message: `Vendor "${
        vendor.companyName
      }" has joined the GUC loyalty program. Enjoy exclusive discounts with promo code "${loyaltyData.promoCode.toUpperCase()}".`,
      createdAt: new Date(),
    } as Notification);

    return updatedVendor;
  }

  /**
   * Cancel vendor's loyalty program participation
   * @param vendorId - Vendor ID
   * @returns Updated vendor
   */
  async cancelLoyaltyProgram(vendorId: string): Promise<IVendor> {
    const vendor = await this.vendorRepo.findById(vendorId);
    if (!vendor) {
      throw createError(404, "Vendor not found");
    }

    if (!vendor.loyaltyProgram || !vendor.loyaltyProgram.promoCode) {
      throw createError(404, "No active loyalty program found to cancel");
    }

    // Remove loyalty program using findByIdAndUpdate to avoid validation issues
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $unset: { loyaltyProgram: "" } },
      { new: true, runValidators: false }
    );

    if (!updatedVendor) {
      throw createError(500, "Failed to cancel loyalty program");
    }

    return updatedVendor;
  }
  async getEventsForQRCodeGeneration(): Promise<IEvent[]> {
    const filter: any = {
      type: { $in: [EVENT_TYPES.BAZAAR, EVENT_TYPES.PLATFORM_BOOTH] },
    };
    const events = await this.eventRepo.findAll(filter, {
      populate: [
        { path: "vendors.vendor", select: "companyName logo" },
        { path: "vendor", select: "companyName logo" },
      ] as any[],
    });

    const filteredEvents: IEvent[] = [];

    for (const event of events) {
      const eventData = event.toObject();

      // Platform Booth Filtering
      if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
        if (
          eventData.RequestData &&
          eventData.RequestData.status === "approved" &&
          eventData.RequestData.hasPaid === true &&
          eventData.RequestData.QRCodeGenerated === false
        ) {
          filteredEvents.push(eventData as IEvent);
        }
      }
      // Bazaar Filtering
      else if (event.type === EVENT_TYPES.BAZAAR) {
        const vendorsNeedingQR = (eventData.vendors || []).filter(
          (vendor: VendorRequest) => {
            return (
              vendor.RequestData &&
              vendor.RequestData.status === "approved" &&
              vendor.RequestData.hasPaid === true &&
              vendor.RequestData.QRCodeGenerated === false
            );
          }
        );

        if (vendorsNeedingQR.length > 0) {
          eventData.vendors = vendorsNeedingQR;

          filteredEvents.push(eventData as IEvent);
        }
      }
    }
    if (filteredEvents.length === 0) {
      throw createError(404, "No events found needing QR code generation");
    }
    return filteredEvents;
  }

  async generateVendorEventQRCodes(eventId: string): Promise<void> {
    const event = await this.eventRepo.findById(eventId, {
      populate: [
        { path: "vendors.vendor", select: "companyName logo email" },
        { path: "vendor", select: "companyName logo email" },
      ] as any[],
    });
    if (!event) {
      throw createError(404, "Event not found");
    }

    if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
      if (
        event.RequestData.status === "approved" &&
        event.RequestData.hasPaid &&
        event.RequestData.hasPaid === true &&
        event.RequestData.QRCodeGenerated === false
      ) {
        await this.generateAndSendQRCodes(
          (event.vendor as IVendor).companyName,
          (event.vendor as IUser).email,
          event.eventName,
          event.location || "Unknown Location",
          event.RequestData.boothAttendees as IBoothAttendee[],
          event.eventStartDate,
          event.eventEndDate
        );

        event.RequestData.QRCodeGenerated = true;
        event.markModified("RequestData");
      } else {
        throw createError(
          400,
          "QR Code has already been generated for this platform booth event"
        );
      }
    } else if (event.type === EVENT_TYPES.BAZAAR) {
      let isNotEmpty: boolean = false;
      for (const vendorEntry of event.vendors || []) {
        console.log(vendorEntry);
        if (
          vendorEntry.RequestData.status === "approved" &&
          vendorEntry.RequestData.hasPaid &&
          vendorEntry.RequestData.hasPaid === true &&
          vendorEntry.RequestData.QRCodeGenerated === false
        ) {
          isNotEmpty = true;
          await this.generateAndSendQRCodes(
            (vendorEntry.vendor as IVendor).companyName,
            (vendorEntry.vendor as IVendor).email,
            event.eventName,
            event.location || "Unknown Location",
            vendorEntry.RequestData.bazaarAttendees as IBoothAttendee[],
            event.eventStartDate,
            event.eventEndDate
          );
          vendorEntry.RequestData.QRCodeGenerated = true;
          event.markModified("vendors");
        }
      }
      if (!isNotEmpty) {
        throw createError(
          400,
          "QR Codes have already been generated for all vendors in this bazaar event"
        );
      }
    }
    await event.save();
  }

  private async generateAndSendQRCodes(
    companyName: string,
    email: string,
    eventName: string,
    location: string,
    attendees: IBoothAttendee[],
    eventStartDate: Date,
    eventEndDate: Date
  ): Promise<void> {
    // Ensure attendees is always an array

    const qrCodeData: any[] = [];
    for (const attendee of attendees) {
      const qrCodeBuffer = await generateQrCodeBuffer(
        eventName,
        location,
        new Date().toISOString(),
        attendee.name,
      );
      qrCodeData.push({
        buffer: qrCodeBuffer,
        name: `${attendee.name}`,
      });
    }
    const pdfBuffer = await pdfGenerator.buildQrCodePdfBuffer(qrCodeData, eventName);
    console.log("Sending QR Code Email to:", email);
    await sendQRCodeEmail(email, companyName, eventName, pdfBuffer);
  }

  async getVendorsWithOverlappingBooths(): Promise<any[]> {
    // Get all pending platform booth events
    const platformBoothEvents = await this.eventRepo.findAll(
      {
        type: EVENT_TYPES.PLATFORM_BOOTH,
        "RequestData.status": Event_Request_Status.PENDING,
      },
      {
        populate: [{ path: "vendor", select: "companyName logo email" }] as any[],
      }
    );

    // Group vendors by booth location
    const locationGroups = new Map<string, any[]>();

    for (const event of platformBoothEvents) {
      const boothLocation = event.RequestData?.boothLocation;

      if (!locationGroups.has(boothLocation)) {
        locationGroups.set(boothLocation, []);
      }

      locationGroups.get(boothLocation)!.push({
        eventId: event._id,
        eventName: event.eventName,
        vendor: event.vendor,
        boothSize: event.RequestData?.boothSize,
        boothSetupDuration: event.RequestData?.boothSetupDuration,
      });
    }

    // Convert to array format - show all vendors per location (conflicts based on location only)
    const result: any[] = [];
    for (const [location, vendors] of locationGroups.entries()) {
      if (vendors.length > 1) {
        result.push({
          location,
          vendorCount: vendors.length,
          vendors: vendors.map((v) => ({
            eventId: v.eventId,
            eventName: v.eventName,
            vendor: v.vendor,
            boothSize: v.boothSize,
            boothSetupDuration: v.boothSetupDuration,
          })),
        });
      }
    }

    if (result.length === 0) {
      throw createError(404, "No conflicting booth requests found");
    }

    return result;
  }

  async getAllPolls() {
    return this.pollRepo.findAll({});
  }

  async createPoll(pollData: {
    title: string;
    description: string;
    deadlineDate: Date;
    vendorIds: string[];
  }): Promise<IPoll> {
    // Validate dates
    const deadlineDate = new Date(pollData.deadlineDate);
    
    if (deadlineDate <= new Date()) {
      throw createError(400, "End date must be in the future");
    }

    // Validate vendors exist
    if (!pollData.vendorIds || pollData.vendorIds.length < 2) {
      throw createError(400, "At least 2 vendors are required for a poll");
    }

    // Fetch vendor details
    const vendors = await this.vendorRepo.findAll({
      _id: { $in: pollData.vendorIds },
    });

    if (vendors.length !== pollData.vendorIds.length) {
      throw createError(404, "One or more vendors not found");
    }

    // Create poll options from vendors
    const options = vendors.map((vendor) => ({
      vendorId: (vendor as any)._id.toString(),
      vendorName: vendor.companyName,
      vendorLogo: vendor.logo?.url,
      voteCount: 0,
    }));

    // Create the poll
    const poll = await this.pollRepo.create({
      title: pollData.title,
      description: pollData.description,
      deadlineDate: deadlineDate,
      options,
    });

    return poll;
  }

  async voteInPoll(pollId: string, vendorId: string, userId: string): Promise<IPoll> {
    // Find the poll
    const poll = await this.pollRepo.findById(pollId);
    if (!poll) {
      throw createError(404, "Poll not found");
    }

    // Check if poll is active
    if (!poll.isActive) {
      throw createError(400, "Poll has ended");
    }

    // Verify vendor is in the poll options
    const optionIndex = poll.options.findIndex(
      (option) => option.vendorId === vendorId
    );
    if (optionIndex === -1) {
      throw createError(400, "Vendor is not an option in this poll");
    }

    // Check if user has already voted (if userId provided)
    if (userId) {
      const existingVote = poll.votes.find(
        (vote) => vote.userId.toString() === userId
      );

      if (existingVote) {
        throw createError(400, "You have already voted in this poll");
      }
    }

    // Record the vote
    poll.votes.push({
      userId: userId as any,
      vendorId,
      votedAt: new Date(),
    });

    // Increment vote count
    poll.options[optionIndex].voteCount += 1;
    poll.markModified("options");
    poll.markModified("votes");
    await poll.save();

    return poll;
  }
}
