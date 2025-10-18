import { IEvent } from "../interfaces/models/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import { mapEventDataByType } from "../utils/mapEventDataByType";
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import mongoose from "mongoose";
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

  async updateWorkshop(
    professorId: string,
    workshopId: string,
    updateData: any
  ) {
    const professor = await this.staffRepo.findById(professorId);
    if (!professor) throw createError(404, "Professor not found");
    if (!professor.myWorkshops || professor.myWorkshops.length === 0)
      throw createError(403, "You have no workshops to update");
    if (!professor.myWorkshops.some((id) => id.toString() === workshopId))
      throw createError(403, "You are not authorized to update this workshop");

    const updatedWorkshop = await this.eventRepo.update(workshopId, updateData);

    if (!updatedWorkshop) {
      throw createError(404, "Workshop not found");
    }

    return updatedWorkshop;
  }

  async updateWorkshopStatus(
    professorId: string,
    workshopId: string,
    updateData: Partial<IWorkshop>
  ): Promise<IWorkshop> {
    const { approvalStatus, comments } = updateData;

    const workshop = await this.workshopRepo.findById(workshopId);
    if (workshop && professorId != workshop?.createdBy.toString()) {
      throw createError(403, "Not authorized to update this workshop status");
    }

    // normalize timestamps
    const commentsWithTimestamps = comments?.map((c) => ({
      ...c,
      timestamp: c.timestamp ? new Date(c.timestamp) : new Date(),
    }));

    const hasComments =
      Array.isArray(commentsWithTimestamps) &&
      commentsWithTimestamps.length > 0;
    const finalStatus = hasComments
      ? Event_Request_Status.PENDING
      : approvalStatus;

    const updatedWorkshop = await this.workshopRepo.update(workshopId, {
      approvalStatus: finalStatus,
      comments: commentsWithTimestamps,
    });

    if (!updatedWorkshop) throw createError(404, "Workshop not found");

    return updatedWorkshop;
  }
}
