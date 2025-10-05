import { IEvent } from "../interfaces/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import { forbidden } from "joi";
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
    const event = await this.eventRepo.findById(id);

    // Log the raw mongoose document
    console.log("Raw document:", event);
    console.log("Has attendees property?", event && "attendees" in event);
    console.log("Attendees value:", event?.attendees);
    console.log("Attendees length:", event?.attendees?.length);

    // Check what toJSON produces
    console.log("toJSON output:", event?.toJSON());
    console.log("toObject output:", event?.toObject());

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
