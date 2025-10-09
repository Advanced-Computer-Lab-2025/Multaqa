import { IEvent } from "../interfaces/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";
import "../schemas/event-schemas/workshopEventSchema";
import "../schemas/event-schemas/bazaarEventSchema";
import "../schemas/event-schemas/platformBoothEventSchema";
import "../schemas/stakeholder-schemas/staffMemberSchema";
import "../schemas/stakeholder-schemas/vendorSchema";
import { validateWorkshop } from "../validation/validateWorkshop";

export class EventsService {
  private eventRepo: GenericRepository<IEvent>;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
  }

  async getEvents(
    search?: string,
    type?: string,
    location?: string,
    sort?: boolean
  ) {
    const filter: any = {};
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
    // Use only validated/sanitized data from Joi
    console.log("DATA TO BE SERVED", data);
    const createdEvent = await this.eventRepo.create({
      eventName: data.name,
      type: data.type,
      location: data.location,
      eventStartDate: data.startDate,
      eventEndDate: data.endDate,
      description: data.shortDescription,
      fullAgenda: data.fullAgenda,
      facultyResponsible: data.facultyResponsible,
      associatedProfs: data.professors,
      budget: data.budget,
      fundingSource: data.fundingSource,
      extraResources: data.extraResources,
      capacity: data.capacity,
      price: data.price,
      eventStartTime: data.startTime,
      eventEndTime: data.endTime,
      registrationDeadline: data.registrationDeadline,
    });

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
