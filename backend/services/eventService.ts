import { IEvent } from "../interfaces/event.interface";
import { EventRepo } from "../repos/eventsRepo";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema"; 
import { forbidden } from "joi";
import { ConflictException } from "node-http-exceptions";

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
    return await this.eventgeneralRepo.findById(id);
  }

  async deleteEvent(id: string): Promise<IEvent | null> {
    const event = await this.eventgeneralRepo.findById(id);
    if (!event || (event.attendees.length > 0)) {
      //will replace with a throw later
      return null;
    }
    return await this.eventgeneralRepo.delete(id);
  }
}
