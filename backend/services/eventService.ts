import { IEvent } from "../interfaces/event.interface";
import { EventRepo } from "../repos/eventsRepo";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";

export class EventsService {
  private eventgeneralRepo: GenericRepository<IEvent>;
  private eventRepo: EventRepo;
  constructor() {
    this.eventgeneralRepo = new GenericRepository(Event);
    this.eventRepo = new EventRepo(Event);
  }


  async getAllEvents(query?: {
    search?: string;
    type?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    sort?: boolean;
  }): Promise<IEvent[]> {
    return this.eventRepo.getFilteredEvents(query);
  }





  async getEventById(id: string): Promise<IEvent | null> {
    const options = { populate: ["attendees"] };
    const event = await this.eventRepo.findById(id, options);
    return event;
  }

  async deleteEvent(id: string): Promise<IEvent | null> {
    const event = await this.eventRepo.findById(id);
    console.log("THE EVENT GETTING DELETEDDD", event);
    if (event && event.attendees && event.attendees.length > 0) {
      throw createError(409, "Cannot delete event with attendees");
    }
    return await this.eventgeneralRepo.delete(id);
  }
}
