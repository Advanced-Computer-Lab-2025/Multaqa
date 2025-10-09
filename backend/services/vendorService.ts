import { IEvent } from "../interfaces/event.interface";
import { IUser } from "../interfaces/user.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";

export class VendorService {
  private userRepo: GenericRepository<IUser>;
  private eventRepo: GenericRepository<IEvent>;

  constructor() {
    // Vendor is a discriminator of User, so use User model to query vendors
    this.userRepo = new GenericRepository(User);
    this.eventRepo = new GenericRepository(Event);
  }

  /**
   * Returns the list of events requested by the vendor (populated with selected fields)
   * Steps:
   * - Find the vendor by id and populate requestedEvents.event
   * - If vendor not found -> throw 404
   * - Map populated requestedEvents to an array of events, filtering out any nulls
   */
  async getVendorEvents(id: string): Promise<Partial<IEvent>[]> {
    // populate the nested 'event' field inside requestedEvents
    const vendor = await this.userRepo.findById(id, {
      populate: [
        "requestedEvents.event",
        // If you want to select specific fields from event, use the dot notation with select in the schema or handle after population
      ],
    });

    if (!vendor) {
      throw createError(404, "Vendor not found");
    }

    // vendor.requestedEvents is an array of { event: Event | ObjectId, status }
    // Use any casts because IUser doesn't strictly type requestedEvents here
    const anyVendor: any = vendor;

    const events: Partial<IEvent>[] = (anyVendor.requestedEvents || [])
      .map((re: any) => re && re.event)
      .filter(Boolean);

    return events;
  }
}
