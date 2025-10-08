import { Model } from "mongoose";
import { IEvent } from "../interfaces/event.interface";
import "../schemas/event-schemas/workshopEventSchema"; 
import "../schemas/event-schemas/bazaarEventSchema";
import "../schemas/event-schemas/platformBoothEventSchema";
import "../schemas/stakeholder-schemas/staffMemberSchema"
import "../schemas/stakeholder-schemas/vendorSchema"

export class EventRepository {
  private model: Model<IEvent>;

  constructor(model: Model<IEvent>) {
    this.model = model;
  }

 async findAll(filter: any = {}, sort?: boolean) {
  let query = this.model.find(filter);
  
 query = query.populate([
  {
    path: "associatedProfs",
    select: "firstName lastName email",
  },
  {
    path: "vendors",
    select: "companyName email logo",
  },{
    path: "vendor",
    select: "companyName email logo",
  }
]);
  
  
  if (sort) {
    query = query.sort({ event_start_date: 1 });
  }

  return await query.lean();
}
}