import { IEvent } from "../interfaces/models/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import "../schemas/event-schemas/workshopEventSchema";
import "../schemas/event-schemas/bazaarEventSchema";
import "../schemas/event-schemas/platformBoothEventSchema";
import "../schemas/stakeholder-schemas/staffMemberSchema";
import "../schemas/stakeholder-schemas/vendorSchema";
import { mapEventDataByType } from "../utils/mapEventDataByType"; // Import the utility function
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import mongoose from "mongoose";

export class ProfessorService {
  // Service methods would go here
  private eventRepo: GenericRepository<IEvent>;
  private staffRepo: GenericRepository<IStaffMember>;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.staffRepo = new GenericRepository(StaffMember);
  }

  async createWorkshop(data: any, professorid: any) {
    data.createdBy = professorid as mongoose.Schema.Types.ObjectId;

    const mappedData = mapEventDataByType(data.type, data);
    const createdEvent = await this.eventRepo.create(mappedData);
    const professor = await this.staffRepo.findById(professorid);

    if (professor && professor.myWorkshops) {
      const createdEventId = createdEvent._id;
      professor.myWorkshops.push(
        createdEventId as mongoose.Schema.Types.ObjectId
      );
      await professor.save();
      return createdEvent;
    }
  }
}
