import { forbidden } from "joi";
import { IEvent } from "../interfaces/ievent.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/eventSchema"; // Adjust the path as needed
import { ConflictException } from "node-http-exceptions";

export class EventsService {
  private eventRepo: GenericRepository<IEvent>;
  constructor() {
    this.eventRepo = new GenericRepository(Event);
  }

  async getAllEvents(): Promise<IEvent[]> {
    return await this.eventRepo.findAll();
  }

  async getEventById(id: string): Promise<IEvent | null> {
    return await this.eventRepo.findById(id);
  }

  async deleteEvent(id: string): Promise<IEvent | null> {
    const event = await this.eventRepo.findById(id);
    if (!event || (event.attendees.length > 0)) {
      //will replace with a throw later
      return null;
    }
    return await this.eventRepo.delete(id);
  }
}
