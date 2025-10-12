import { IEvent } from "../interfaces/models/event.interface";
import { Event } from "../schemas/event-schemas/eventSchema";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import GenericRepository from "../repos/genericRepo";
import createError from "http-errors";
import "../schemas/event-schemas/workshopEventSchema";
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { validateUpdateWorkshop } from "../validation/validateUpdateWorkshop";
import { IWorkshop } from "../interfaces/workshop.interface";
import { Event_Request_Status } from "../constants/user.constants";
import { Workshop } from "../schemas/event-schemas/workshopEventSchema";
import { Model } from "mongoose";

export class EventsOfficeService {
  private workshopRepo: GenericRepository<IWorkshop>;

  constructor() {
    this.workshopRepo = new GenericRepository(Workshop);
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
