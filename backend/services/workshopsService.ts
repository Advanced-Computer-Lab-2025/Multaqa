import { IEvent } from "../interfaces/models/event.interface";
import GenericRepository from "../repos/genericRepo";
import { Event } from "../schemas/event-schemas/eventSchema";
import createError from "http-errors";
import { mapEventDataByType } from "../utils/mapEventDataByType";
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import mongoose from "mongoose";
import { Event_Request_Status } from "../constants/user.constants";
import { IWorkshop } from "../interfaces/models/workshop.interface";
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
    if (!workshop) throw createError(404, "Workshop not found");

    if (workshop && professorId != workshop?.createdBy.toString()) {
      throw createError(403, "Not authorized to update this workshop status");
    }

    // Check if workshop is already approved or rejected - these are irreversible
    if (
      workshop.approvalStatus === Event_Request_Status.APPROVED ||
      workshop.approvalStatus === Event_Request_Status.REJECTED
    ) {
      throw createError(
        409,
        "Cannot update workshop status - already finalized (approved/rejected)"
      );
    }

    // Determine final status and comments based on the incoming approvalStatus:
    let finalStatus: Event_Request_Status;
    let finalComments: any[];

    if (
      approvalStatus === Event_Request_Status.APPROVED ||
      approvalStatus === Event_Request_Status.REJECTED
    ) {
      // APPROVED or REJECTED = final decision
      // Ignore any comments in payload and clear all previous comments
      finalStatus = approvalStatus;
      finalComments = [];
    } else {
      // For PENDING or AWAITING_REVIEW or no status:
      const hasComments = Array.isArray(comments) && comments.length > 0;

      if (hasComments) {
        // If comments are provided, status becomes AWAITING_REVIEW (requesting edits)
        finalStatus = Event_Request_Status.AWAITING_REVIEW;
        finalComments = comments;
      } else {
        // No comments = default to PENDING
        finalStatus = Event_Request_Status.PENDING;
        finalComments = [];
      }
    }

    const updatedWorkshop = await this.workshopRepo.update(workshopId, {
      approvalStatus: finalStatus,
      comments: finalComments,
    });

    if (!updatedWorkshop) throw createError(404, "Workshop not found");

    return updatedWorkshop;
  }
}
