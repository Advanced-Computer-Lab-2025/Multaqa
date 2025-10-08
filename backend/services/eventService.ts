import { IEvent } from "../interfaces/event.interface";
import { EventRepository } from "../repos/eventsRepo";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";

export class EventsService {
  private eventgeneralRepo: GenericRepository<IEvent>;
  private eventRepo: EventRepository;
  constructor() {
    this.eventgeneralRepo = new GenericRepository(Event);
    this.eventRepo = new EventRepository(Event);
  }


 async getEvents(search?: string, type?: string, location?: string, sort?: boolean) {
  const filter: any = {};
  if (type) filter.type = type;
  if (location) filter.location = location;

  // Fetch events from the repository and apply filters and sorting if present
  const events = await this.eventRepo.findAll(filter, sort);

  //apply search of events if present
  if (search) {
    const searchRegex = new RegExp(search, "i");
    return events.filter(
      (event: any) =>
        searchRegex.test(event.event_name) || 
        searchRegex.test(event.type) ||
        event.associatedProfs?.some((prof: any) => 
          searchRegex.test(prof?.firstName) || 
          searchRegex.test(prof?.lastName)
        )
    );
  }

  return events;
}





  async getEventById(id: string): Promise<IEvent | null> {
    const options = { populate: ["attendees"] };
    const event = await this.eventgeneralRepo.findById(id, options);
    return event;
  }

  async deleteEvent(id: string): Promise<IEvent | null> {
    const event = await this.eventgeneralRepo.findById(id);
    console.log("THE EVENT GETTING DELETEDDD", event);
    if (event && event.attendees && event.attendees.length > 0) {
      throw createError(409, "Cannot delete event with attendees");
    }
    return await this.eventgeneralRepo.delete(id);
  }
}
