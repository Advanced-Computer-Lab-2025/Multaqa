import { IEvent } from "../interfaces/event.interface";
import { Event } from "../schemas/event-schemas/eventSchema";
import { IStaffMember } from "../interfaces/staffMember.interface";
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
  private staffRepo: GenericRepository<IStaffMember>;

  constructor() {
    // 👇 cast Workshop to Model<IWorkshop> to satisfy the GenericRepository type
    this.workshopRepo = new GenericRepository<IWorkshop>(
      Workshop as unknown as Model<IWorkshop>
    );
    this.staffRepo = new GenericRepository(StaffMember);
  }

  async updateWorkshopStatus(
    workshopId: string,
    updateData: Partial<IWorkshop>
  ) {
    const { approvalStatus, comments } = updateData;

    // ✅ Check if comments exist and are not just spaces
    const hasComments = comments && comments.trim() !== "";

    // ✅ Decide the final status:
    // - If there are comments → keep status pending
    // - Otherwise → use the provided approvalStatus if valid
    let finalStatus: Event_Request_Status | undefined;

    if (hasComments) {
      finalStatus = Event_Request_Status.PENDING;
    } else if (
      approvalStatus &&
      Object.values(Event_Request_Status).includes(approvalStatus)
    ) {
      finalStatus = approvalStatus;
    }

    // ✅ Prepare final update object
    const newData: Partial<IWorkshop> = {};

    if (comments !== undefined) newData.comments = comments;
    if (finalStatus !== undefined) newData.approvalStatus = finalStatus;

    // ✅ Perform update via generic repo
    const updatedWorkshop = await this.workshopRepo.update(workshopId, newData);

    console.log("Updated doc:", updatedWorkshop);

    if (!updatedWorkshop) throw createError(404, "Workshop not found");

    return updatedWorkshop;
  }
}
