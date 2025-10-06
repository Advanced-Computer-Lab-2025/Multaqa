import { IEvent } from "../interfaces/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";

export class EventsService {
  private eventRepo: GenericRepository<IEvent>;
  constructor() {
    this.eventRepo = new GenericRepository(Event);
  }

  async getAllEvents(): Promise<IEvent[]> {
    return await this.eventRepo.findAll();
  }

  async getEventById(id: string): Promise<IEvent | null> {
    const options = { populate: ["attendees"] };
    const event = await this.eventRepo.findById(id, options);
    return event;
  }

  async deleteEvent(id: string): Promise<IEvent | null> {
    const event = await this.eventRepo.findById(id);
    console.log("THE EVENT GETTING DELETEDDD", event);
    if (event && event.attendees.length > 0) {
      throw createError(409, "Cannot delete event with attendees");
    }
    return await this.eventRepo.delete(id);
  }
}
