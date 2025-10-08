import { Model } from "mongoose";
import { IEvent } from "../interfaces/event.interface";
import "../schemas/event-schemas/workshopEventSchema"; 
import "../schemas/stakeholder-schemas/staffMemberSchema"

export class EventRepository {
  private model: Model<IEvent>;

  constructor(model: Model<IEvent>) {
    this.model = model;
  }

 async findAll(filter: any = {}, sort?: boolean) {
  let query = this.model.find(filter);
  
  // Populate associatedProfs if event is a workshop
    query = query.populate({
      path: "associatedProfs",
      select: "firstName lastName email",
    });
  
  
  if (sort) {
    query = query.sort({ event_start_date: 1 });
  }

  return await query.lean();
}
}