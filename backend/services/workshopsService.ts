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
import { EVENT_OFFICE_PERMISSIONS } from "../constants/administration.constants";
import { Event_Request_Status } from "../constants/user.constants";
import { IWorkshop } from "../interfaces/workshop.interface";
import { Workshop } from "../schemas/event-schemas/workshopEventSchema";

export class WorkshopService {
  private eventRepo: GenericRepository<IEvent>;
  private staffRepo: GenericRepository<IStaffMember>;
  private workshopRepo: GenericRepository<IWorkshop>;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.staffRepo = new GenericRepository(StaffMember);
    this.workshopRepo = new GenericRepository(Workshop);
  }

  async createWorkshop(data: any, professorid: any): Promise<IEvent> {
    data.createdBy = professorid as mongoose.Schema.Types.ObjectId;
    data.approvalStatus = Event_Request_Status.PENDING;
    const mappedData = mapEventDataByType(data.type, data);
    const createdEvent = await this.eventRepo.create(mappedData);
    const professor = await this.staffRepo.findById(professorid);
    if (professor && professor.myWorkshops) {
      const createdEventId = createdEvent._id;
      professor.myWorkshops.push(
        createdEventId as mongoose.Schema.Types.ObjectId
      );
      await professor.save();
      console.log(createdEvent);

      return createdEvent;
    }
    throw createError(404, "Professor not found");
  }

  async updateWorkshop(workshopId: string, updateData: any) {
    const updatedWorkshop = await this.eventRepo.update(workshopId, updateData);

    if (!updatedWorkshop) {
      throw createError(404, "Workshop not found");
    }

    return updatedWorkshop;
  }

  async updateWorkshopStatus(
    workshopId: string,
    updateData: Partial<IWorkshop>
  ) {
    const { approvalStatus, comments } = updateData;

    const hasComments = comments && comments.trim() !== "";

    const finalStatus = hasComments
      ? Event_Request_Status.PENDING
      : approvalStatus;

    const newData: Partial<IWorkshop> = {
      approvalStatus: finalStatus,
      comments: comments || "",
    };

    const updatedWorkshop = await this.workshopRepo.update(workshopId, newData);

    if (!updatedWorkshop) throw createError(404, "Workshop not found");

    return updatedWorkshop;
  }
}
