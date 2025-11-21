import { IEvent } from "../interfaces/models/event.interface";
import GenericRepository from "../repos/genericRepo";
import createError from "http-errors";
import { mapEventDataByType } from "../utils/mapEventDataByType";
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import mongoose from "mongoose";
import { Event_Request_Status, UserRole } from "../constants/user.constants";
import { IWorkshop } from "../interfaces/models/workshop.interface";
import { Workshop } from "../schemas/event-schemas/workshopEventSchema";
import { sendCertificateOfAttendanceEmail } from "./emailService";
import { CertificateService } from "./certificateService";
import { AdministrationRoleType } from "../constants/administration.constants";
import { NotificationService } from "./notificationService";
import { INotification } from "../interfaces/models/notification.interface";

export class WorkshopService {
  private staffRepo: GenericRepository<IStaffMember>;
  private workshopRepo: GenericRepository<IWorkshop>;
  private notificationService: NotificationService;

  constructor() {
    this.staffRepo = new GenericRepository(StaffMember);
    this.workshopRepo = new GenericRepository(Workshop);
    this.notificationService = new NotificationService();
  }

  async createWorkshop(data: any, professorid: any): Promise<IEvent> {
    data.createdBy = professorid as mongoose.Schema.Types.ObjectId;
    data.approvalStatus = Event_Request_Status.PENDING;
    const mappedData = mapEventDataByType(data.type, data);
    const createdEvent = await this.workshopRepo.create(mappedData);
    const professor = await this.staffRepo.findById(professorid);

    if (!professor || !professor.myWorkshops) {
      throw createError(404, "Professor not found");
    }

    const createdEventId = createdEvent._id;
    professor.myWorkshops.push(
      createdEventId as mongoose.Schema.Types.ObjectId
    );
    await professor.save();
    console.log(createdEvent);

    await this.notificationService.sendNotification({
      role: [ UserRole.ADMINISTRATION ],
      adminRole: [ AdministrationRoleType.EVENTS_OFFICE ],
      type: "WORKSHOP_REQUEST_SUBMITTED",
      title: "New Workshop Request Submitted",
      message: `Professor ${professor.firstName} ${professor.lastName} has submitted a new workshop request titled "${createdEvent.eventName}".`,
      createdAt: new Date(),
    } as INotification);

    return createdEvent;
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

    await this.notificationService.sendNotification({
      userId: professorId, // Notify the professor
      type: "WORKSHOP_STATUS_CHANGED",
      title: "Workshop Request Status Updated",
      message: `Your workshop request titled "${workshop.eventName}" has been updated to status: ${finalStatus}.`,
      createdAt: new Date(),
    } as INotification);

    return updatedWorkshop;
  }

  // Calculate workshop end time based on eventEndDate and eventEndTime
  private calculateWorkshopEndTime(workshop: IWorkshop): Date {
    const endDate = new Date(workshop.eventEndDate);
    const [hours, minutes] = workshop.eventEndTime.split(':').map(Number);
    endDate.setHours(hours, minutes, 0, 0);
    return endDate;
  }

  // Check and process completed workshops, This runs periodically to check if any workshops have ended
  async processCompletedWorkshops(): Promise<void> {
    const now = new Date();

    // Find all workshops that have ended but certificates haven't been sent
    const workshops = await this.workshopRepo.findAll({
      certificatesSent: false,
      eventStartDate: { $lte: now }
    });

    for (const workshop of workshops) {
      const endTime = this.calculateWorkshopEndTime(workshop);

      // Check if workshop has ended
      if (now >= endTime) {
        try {
          console.log(`Processing certificates for workshop: ${workshop.eventName}`);

          // Send certificates to all attendees
          await this.sendCertificatesToAllAttendees(
            workshop.id.toString()
          );

          // Mark certificates as sent
          await this.workshopRepo.update(workshop.id.toString(), {
            certificatesSent: true,
            certificatesSentAt: new Date()
          });

          console.log(`Certificates sent successfully for: ${workshop.eventName}`);
        } catch (error) {
          console.error(`Failed to send certificates for workshop ${workshop.id}:`, error);
        }
      }
    }
  }

  // Manually trigger certificate sending for a specific workshop for testing
  async sendCertificatesForWorkshop(workshopId: string): Promise<void> {
    const workshop = await this.workshopRepo.findById(workshopId);
    if (!workshop) {
      throw new Error('Workshop not found');
    }

    if (workshop.certificatesSent) {
      throw new Error('Certificates have already been sent for this workshop');
    }

    const now = new Date();
    const endTime = this.calculateWorkshopEndTime(workshop);
    if (now < endTime) {
      throw new Error('Workshop has not ended yet');
    }

    await this.sendCertificatesToAllAttendees(workshopId);

    await this.workshopRepo.update(workshopId, {
      certificatesSent: true,
      certificatesSentAt: new Date()
    });
  }

  // Send certificates to all attendees of a completed workshop
  async sendCertificatesToAllAttendees(workshopId: string): Promise<void> {
    const workshop = await this.workshopRepo.findById(workshopId, {
      populate: ['attendees']
    });
    if (!workshop) {
      throw createError(404, 'Workshop not found');
    }
    if (!workshop.attendees || workshop.attendees.length === 0) {
      throw createError(400, 'No attendees found for this workshop');
    }

    // Send certificates to all attendees
    const promises = workshop.attendees.map(async (attendee: any) => {
      if (attendee) {
        const certificateBuffer = await CertificateService.generateCertificatePDF({
          firstName: attendee.firstName,
          lastName: attendee.lastName,
          workshopName: workshop.eventName,
          startDate: workshop.eventStartDate,
          endDate: workshop.eventEndDate
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