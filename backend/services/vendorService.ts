import { Router } from "express";
import { IEvent } from "../interfaces/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";
import { get } from "http";

export class VendorService {
  private eventRepo: GenericRepository<IEvent>;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
  }

  async getVendorEvents(id: string): Promise<IEvent[]> {
    const options = {
      populate: [
        {
          path: "requestedEvents",
          select:
            "event_name event_start_date event_end_date location price allowedUsers",
        } as any,
      ],
    };
    const events = await this.eventRepo.findAll({ _id: id }, options);
    return events;
  }
}
