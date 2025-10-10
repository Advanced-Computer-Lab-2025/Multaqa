import { IEvent } from "../interfaces/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import "../schemas/event-schemas/workshopEventSchema";
import "../schemas/event-schemas/bazaarEventSchema";
import "../schemas/event-schemas/platformBoothEventSchema";
import "../schemas/event-schemas/conferenceEventSchema";
import "../schemas/stakeholder-schemas/staffMemberSchema";
import "../schemas/stakeholder-schemas/vendorSchema";
import { EVENT_TYPES } from "../constants/events.constants";
import { mapEventDataByType } from "../utils/mapEventDataByType"; // Import the utility function
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { IStaffMember } from "../interfaces/staffMember.interface";
import mongoose from "mongoose";

export class EventsService {
  private eventRepo: GenericRepository<IEvent>;
  private staffRepo: GenericRepository<IStaffMember>;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.staffRepo = new GenericRepository(StaffMember);
  }

  async getEvents(
    search?: string,
    type?: string,
    location?: string,
    sort?: boolean
  ) {
    const filter: any = { type: { $ne: EVENT_TYPES.GYM_SESSION } };
    if (type) filter.type = type;
    if (location) filter.location = location;

    let events = await this.eventRepo.findAll(filter, {
      populate: [
        { path: "associatedProfs", select: "firstName lastName email" },
        { path: "vendors", select: "companyName email logo" },
        { path: "vendor", select: "companyName email logo" },
      ] as any,
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
    data.createdBy = user.id;

    const mappedData = mapEventDataByType(data.type, data);

    const createdEvent = await this.eventRepo.create(mappedData);
    return createdEvent;
  }

  async deleteEvent(id: string): Promise<IEvent | null> {
    const event = await this.eventRepo.findById(id);
    console.log("THE EVENT GETTING DELETEDDD", event);
    if (event && event.attendees && event.attendees.length > 0) {
      throw createError(409, "Cannot delete event with attendees");
    }
    return await this.eventRepo.delete(id);
  }
}
