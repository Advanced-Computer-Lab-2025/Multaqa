import { IEvent } from "../interfaces/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema"; // Adjust the path as needed

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
}
