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
import { EVENT_TYPES } from "../constants/events.constants";
import cron from "node-cron";
import { sendCertificateOfAttendanceEmail } from "./emailService";
import { IUser } from "../interfaces/models/user.interface";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import { CertificateService } from "./certificateService";

export class WorkshopService {
  private eventRepo: GenericRepository<IEvent>;
  private staffRepo: GenericRepository<IStaffMember>;
  private workshopRepo: GenericRepository<IWorkshop>;
  private userRepo: GenericRepository<IUser>;

  constructor() {
    this.eventRepo = new GenericRepository(Event);
    this.staffRepo = new GenericRepository(StaffMember);
    this.workshopRepo = new GenericRepository(Workshop);
    this.userRepo = new GenericRepository(User);
  }

  async createWorkshop(data: any, professorid: any): Promise<IEvent> {
    data.createdBy = professorid as unknown as mongoose.Schema.Types.ObjectId;
    data.approvalStatus = Event_Request_Status.PENDING;
    const mappedData = mapEventDataByType(data.type, data);
    const createdEvent = await this.workshopRepo.create(mappedData);
    const professor = await this.staffRepo.findById(professorid);
    if (professor && professor.myWorkshops) {
      const createdEventId = createdEvent._id;
      professor.myWorkshops.push(
        createdEventId as unknown as mongoose.Schema.Types.ObjectId
      );
      await professor.save();
      console.log(createdEvent);

      return createdEvent;
    }
    throw createError(404, "Profe ssor not found");
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

    const workshop = await this.workshopRepo.findById(workshopId);
    if (!workshop) {
      throw createError(404, "Workshop not found");
    }

    // If workshop is AWAITING_REVIEW, reset to PENDING and clear comments when professor makes edits
    if (workshop.approvalStatus === Event_Request_Status.AWAITING_REVIEW) {
      updateData.approvalStatus = Event_Request_Status.PENDING;
      updateData.comments = [];
    }

    const updatedWorkshop = await this.workshopRepo.update(
      workshopId,
      updateData
    );

    if (!updatedWorkshop) {
      throw createError(404, "Workshop not found");
    }

    return updatedWorkshop;
  }

  async updateWorkshopStatus(
    eventsOfficeId: string,
    workshopId: string,
    updateData: Partial<IWorkshop>
  ): Promise<IWorkshop> {
    const { approvalStatus, comments } = updateData;

    const workshop = await this.workshopRepo.findById(workshopId);
    if (!workshop) throw createError(404, "Workshop not found");

    // Get the events office user to retrieve their name
    const eventsOffice = await this.userRepo.findById(eventsOfficeId);
    if (!eventsOffice) throw createError(404, "Events Office user not found");

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
      // Clear all previous comments on final decision
      finalStatus = approvalStatus;
      finalComments = [];
    } else {
      // Events Office is requesting edits by adding comments
      const hasComments = Array.isArray(comments) && comments.length > 0;

      if (!hasComments) {
        throw createError(
          400,
          "Comments are required when requesting edits. Use APPROVED or REJECTED for final decisions."
        );
      }

      // Transform comments to replace commenter ID with events office name
      const eventsOfficeName = (eventsOffice as any).name || "Events Office";
      finalComments = comments.map((comment: any) => ({
        ...comment,
        commenter: eventsOfficeName, // Replace ID with name
      }));

      // Comments provided = status becomes AWAITING_REVIEW (requesting edits)
      finalStatus = Event_Request_Status.AWAITING_REVIEW;
    }

    const updatedWorkshop = await this.workshopRepo.update(workshopId, {
      approvalStatus: finalStatus,
      comments: finalComments,
    });

    if (!updatedWorkshop) throw createError(404, "Workshop not found");

    return updatedWorkshop;
  }

  // Calculate workshop end time based on eventEndDate and eventEndTime
  private calculateWorkshopEndTime(workshop: IWorkshop): Date {
    const endDate = new Date(workshop.eventEndDate);
    const [hours, minutes] = workshop.eventEndTime.split(":").map(Number);
    endDate.setHours(hours, minutes, 0, 0);
    return endDate;
  }

  // Check and process completed workshops, This runs periodically to check if any workshops have ended
  async processCompletedWorkshops(): Promise<void> {
    const now = new Date();

    // Find all workshops that have ended but certificates haven't been sent
    const workshops = await this.workshopRepo.findAll({
      certificatesSent: false,
      eventStartDate: { $lte: now },
    });

    for (const workshop of workshops) {
      const endTime = this.calculateWorkshopEndTime(workshop);

      // Check if workshop has ended
      if (now >= endTime) {
        try {
          console.log(
            `Processing certificates for workshop: ${workshop.eventName}`
          );

          // Send certificates to all attendees
          await this.sendCertificatesToAllAttendees(workshop.id.toString());

          // Mark certificates as sent
          await this.workshopRepo.update(workshop.id.toString(), {
            certificatesSent: true,
            certificatesSentAt: new Date(),
          });

          console.log(
            `Certificates sent successfully for: ${workshop.eventName}`
          );
        } catch (error) {
          console.error(
            `Failed to send certificates for workshop ${workshop.id}:`,
            error
          );
        }
      }
    }
  }

  // Manually trigger certificate sending for a specific workshop for testing
  async sendCertificatesForWorkshop(workshopId: string): Promise<void> {
    const workshop = await this.workshopRepo.findById(workshopId);
    if (!workshop) {
      throw new Error("Workshop not found");
    }

    if (workshop.certificatesSent) {
      throw new Error("Certificates have already been sent for this workshop");
    }

    const now = new Date();
    const endTime = this.calculateWorkshopEndTime(workshop);
    if (now < endTime) {
      throw new Error("Workshop has not ended yet");
    }

    await this.sendCertificatesToAllAttendees(workshopId);

    await this.workshopRepo.update(workshopId, {
      certificatesSent: true,
      certificatesSentAt: new Date(),
    });
  }

  // Send certificates to all attendees of a completed workshop
  async sendCertificatesToAllAttendees(workshopId: string): Promise<void> {
    const workshop = await this.workshopRepo.findById(workshopId, {
      populate: ["attendees"],
    });
    if (!workshop) {
      throw createError(404, "Workshop not found");
    }
    if (!workshop.attendees || workshop.attendees.length === 0) {
      throw createError(400, "No attendees found for this workshop");
    }

    // Send certificates to all attendees
    const promises = workshop.attendees.map(async (attendee: any) => {
      if (attendee) {
        const certificateBuffer =
          await CertificateService.generateCertificatePDF({
            firstName: attendee.firstName,
            lastName: attendee.lastName,
            workshopName: workshop.eventName,
            startDate: workshop.eventStartDate,
            endDate: workshop.eventEndDate,
          });

        await sendCertificateOfAttendanceEmail(
          attendee.email,
          `${attendee.firstName} ${attendee.lastName}`,
          workshop.eventName,
          certificateBuffer
        );
      }
    });

    await Promise.all(promises);
  }
}