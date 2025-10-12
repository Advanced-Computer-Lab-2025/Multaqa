import { IEvent } from "../interfaces/models/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import "../schemas/event-schemas/workshopEventSchema";
import "../schemas/event-schemas/bazaarEventSchema";
import "../schemas/event-schemas/platformBoothEventSchema";
import "../schemas/event-schemas/conferenceEventSchema";
import "../schemas/stakeholder-schemas/staffMemberSchema";
import "../schemas/stakeholder-schemas/vendorSchema";
import "../schemas/event-schemas/tripSchema";
import { EVENT_TYPES } from "../constants/events.constants";
import { mapEventDataByType } from "../utils/mapEventDataByType"; // Import the utility function
import { IVendor } from "../interfaces/vendor.interface";
import { Event_Request_Status } from "../constants/user.constants";
import { Vendor } from "../schemas/stakeholder-schemas/vendorSchema";
import { request } from "http";

export class EventsService {
  private eventRepo: GenericRepository<IEvent>;
  private vendorRepo: GenericRepository<IVendor>;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.vendorRepo = new GenericRepository(Vendor);
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
  { $or: [ { type: { $ne: EVENT_TYPES.PLATFORM_BOOTH } },{ "RequestData.status": "approved" }]},
  { $or: [  { type: { $ne: EVENT_TYPES.WORKSHOP } }, { "approvalStatus": "approved" }]}
]
    };
    if (type) filter.type = type;
    if (location) filter.location = location;

    

    let events = await this.eventRepo.findAll(filter, {
      populate: [
        { path: "associatedProfs", select: "firstName lastName email" },
        { path: "vendors", select: "companyName email logo" },
        { path: "vendor", select: "companyName email logo" },
      ] as any,
    });

    // filter out unapproved platform vendors
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
          new Date(a.event_start_date).getTime() -
          new Date(b.event_start_date).getTime()
        );
      });
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      return events.filter(
        (event: any) =>
          searchRegex.test(event.event_name) ||
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

  async getEventById(id: string): Promise<IEvent | null> {
    const options = {
      populate: [
        { path: "associatedProfs", select: "firstName lastName email" },
        { path: "vendors", select: "companyName email logo" },
        { path: "vendor", select: "companyName email logo" },
        { path: "attendees", select: "firstName lastName email gucId " } as any,
      ],
    };
    const event = await this.eventRepo.findById(id, options);
    return event;
  }

  async createEvent(user: any, data: any) {
    const mappedData = mapEventDataByType(data.type, data);

    const createdEvent = await this.eventRepo.create(mappedData);
    return createdEvent;
  }

  async updateEvent(eventId: string, updateData: any) {
    const updatedEvent = await this.eventRepo.update(eventId, updateData);

    if (!updatedEvent) {
      throw createError(404, "Event not found");
    }

    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<IEvent> {
    const event = await this.eventRepo.findById(id);
    console.log("THE EVENT GETTING DELETEDDD", event);
    if (event && event.attendees && event.attendees.length > 0) {
      throw createError(409, "Cannot delete event with attendees");
    }
    const deleteResult = await this.eventRepo.delete(id);
    if(!deleteResult){
      throw createError(404, "Event not found");
    }
    return deleteResult;
  }

  async getVendorsRequest(eventId: string): Promise<Partial<IVendor>[] | null> {
  const event = await this.eventRepo.findById(eventId, {
    populate: [
      { path: 'vendor', select: 'companyName logo' },
      { path: 'vendors.vendor', select: 'companyName logo' }
    ] as any[]
  });
  
  if (!event) {
    throw createError(404, "Event not found");
  }
  
  let vendors: any[] = [];
  
  if (event.type === EVENT_TYPES.BAZAAR) {
    for (const vendorEntry of event.vendors || []) {
      if (vendorEntry.RequestData.status === Event_Request_Status.PENDING) {
        vendors.push(vendorEntry);
      }
    }
  } else if (event.type === EVENT_TYPES.PLATFORM_BOOTH && event.vendor) {
    if (event.RequestData.status === Event_Request_Status.PENDING) {
      let vendorEntry = {
        vendor: event.vendor,
        RequestData: event.RequestData,
      };
      vendors.push(vendorEntry);
    }
  }

  return vendors;
}

async getVendorsRequestsDetails(eventId: string, vendorId: string): Promise<any> {
  const event = await this.eventRepo.findById(eventId, {
    populate: [
      { path: 'vendor', select: 'companyName logo' },
      { path: 'vendors.vendor', select: 'companyName logo' }
    ] as any[]
  });

  if (!event) {
    throw createError(404, "Event not found");
  }

  let vendorRequest;

  // Check if it's a bazaar with multiple vendors and get the specific vendor's request
  if (event.type === EVENT_TYPES.BAZAAR && event.vendors) {
    vendorRequest = event.vendors.find(
      v => typeof v.vendor !== "string" && v.vendor._id?.toString() === vendorId.toString()
    );
  } 
  // Check if it's a platform booth 
  else if (event.type === EVENT_TYPES.PLATFORM_BOOTH && event.vendor) {
    if (typeof event.vendor !== "string" && event.vendor._id?.toString() === vendorId.toString()) {
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
  reqBody: { status: 'approved' | 'rejected' }
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
  if (status !== 'approved' && status !== 'rejected') {
    throw createError(400, "Invalid status. Must be 'approved' or 'rejected'");
  }

  // Update vendor's requestedEvents
  const requestIndex = vendor.requestedEvents.findIndex(
    req => req.event?.toString() === eventId.toString()
  );
  
  if (requestIndex === -1) {
    throw createError(404, "Vendor has not applied to this event");
  }
  
  vendor.requestedEvents[requestIndex].status = status;
  vendor.markModified('requestedEvents'); 
  await vendor.save();

  // Update event based on type
  if (event.type === EVENT_TYPES.BAZAAR) {
    const vendorIndex = event.vendors?.findIndex(
      ve => ve.vendor?.toString() === vendorId.toString()
    );
    
    if (vendorIndex === -1 || vendorIndex === undefined || !event.vendors) {
      throw createError(404, "Vendor not found in event");
    }
    
    event.vendors[vendorIndex].RequestData.status = status;
    event.markModified('vendors');
  } else if (event.type === EVENT_TYPES.PLATFORM_BOOTH) {
    if (!event.vendor || event.vendor.toString() !== vendorId.toString()) {
      throw createError(404, "Vendor not found in event");
    }
    
    if (!event.RequestData) {
      throw createError(500, "Event RequestData is missing");
    }
    
    event.RequestData.status = status;
    event.markModified('RequestData');
  } else {
    throw createError(400, "Invalid event type");
  }
  
  await event.save();
}
}
