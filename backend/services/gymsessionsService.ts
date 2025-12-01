import GenericRepository from "../repos/genericRepo";
import { GymSession } from "../schemas/event-schemas/gymSessionEventSchema";
import {
  IGymSessionCreationRequest,
  IGymSessionEvent,
} from "../interfaces/models/gymSessionsEvent.interface";
import { EVENT_TYPES } from "../constants/events.constants";
import { UserRole } from "../constants/user.constants";
import { sendGymSessionNotificationEmail } from "./emailService";
import createError from "http-errors";
import { IUser } from "../interfaces/models/user.interface";

export class GymSessionsService {
  private gymSessionRepo: GenericRepository<IGymSessionEvent>;
  constructor() {
    this.gymSessionRepo = new GenericRepository<IGymSessionEvent>(GymSession);
  }

  async createGymSession(
    data: IGymSessionCreationRequest
  ): Promise<IGymSessionEvent> {
    const [h, m] = data.time.split(":").map(Number);
    const durationMinutes = Number(data.duration);

    // Ensure date is a Date object
    const sessionDate = new Date(data.date);

    return await this.gymSessionRepo.create({
      ...data,
      type: EVENT_TYPES.GYM_SESSION,
      eventName: `Gym Session - ${data.sessionType} Class`,
      eventStartDate: sessionDate,
      eventEndDate: new Date(sessionDate.getTime() + durationMinutes * 60 * 1000),
      eventStartTime: data.time,
      location: "GUC Gym",
      eventEndTime: new Date(0, 0, 0, h, m + data.duration)
        .toTimeString()
        .slice(0, 5),
      registrationDeadline: sessionDate,
      description: data.trainer
        ? `${data.sessionType} class instructed by ${data.trainer}`
        : `${data.sessionType} class`,
      price: 0,
      allowedUsers: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    });
  }

  async getAllGymSessions(dateParam?: string): Promise<IGymSessionEvent[]> {
    const filter: any = { type: EVENT_TYPES.GYM_SESSION };

    if (dateParam) {
      // If date provided, get all sessions for that specific month
      const date = new Date(dateParam);
      filter.eventStartDate = {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
      };
    } else {
      // If no date provided, get all sessions in the furture
      filter.eventEndDate = {
        $gte: new Date(),
      };
    }

    const sessions = await this.gymSessionRepo.findAll(filter, {
      select:
        " sessionType eventName trainer eventStartDate eventStartTime duration eventEndTime location description capacity attendees",
    });
    if (!sessions || sessions.length === 0) {
      throw createError(404, "No gym sessions found for the selected period");
    }
    return sessions;
  }

  async cancelGymSession(sessionId: string): Promise<void> {
    const session = await this.gymSessionRepo.findById(sessionId, {
      populate: {
        path: "attendees",
        select: "email firstName lastName",
      } as any,
      select:
        "sessionType eventName trainer eventStartDate eventStartTime duration eventEndTime location description capacity attendees",
    });
    console.log(session);
    if (!session) {
      throw createError(404, "Gym session not found");
    }
    const sessionObj = session.toObject();
    const oldDetails = {
      date: new Date(sessionObj.eventStartDate),
      time: sessionObj.eventStartTime,
      location: sessionObj.location,
      instructor: sessionObj.trainer ?? undefined,
      duration: sessionObj.duration,
    };
    for (const attendee of sessionObj.attendees as any[]) {
      console.log("Notifying attendee", attendee.email);
      await sendGymSessionNotificationEmail({
        userEmail: attendee.email,
        username: `${attendee.firstName} ${attendee.lastName}`,
        sessionName: sessionObj.eventName,
        actionType: "cancelled",
        oldDetails: oldDetails,
      });
    }
    const deleted = await this.gymSessionRepo.delete(sessionId);
    if (!deleted) {
      throw createError(404, "Gym session not found");
    }
    
    return;
  }

  async editGymSession(
    sessionId: string,
    updateData: { date?: string; time?: string; duration?: number }
  ): Promise<IGymSessionEvent> {
    const session = await this.gymSessionRepo.findById(sessionId, {
      populate: {
        path: "attendees",
        select: "email firstName lastName",
      } as any,
      select:
        "sessionType eventName trainer eventStartDate eventStartTime duration eventEndTime location description capacity attendees",
    });
    if (!session) {
      throw createError(404, "Gym session not found");
    }
    console.log(session);
    const oldDetails = {
      date: new Date(session.eventStartDate),
      time: session.eventStartTime,
      location: session.location || "TBD",
      instructor: session.trainer ?? undefined,
      duration: session.duration,
    };

    // Update date if provided
    if (updateData.date) {
      const sessionDate = new Date(updateData.date);
      session.eventStartDate = sessionDate;
      session.eventEndDate = sessionDate;
      session.registrationDeadline = new Date(
        sessionDate.getTime() - 24 * 60 * 60 * 1000
      );
    }

    // Update time and duration if provided
    if (updateData.time) {
      session.eventStartTime = updateData.time;
    }

    if (updateData.duration !== undefined) {
      session.duration = updateData.duration;
    }

    // Recalculate end time if time or duration changed
    if (updateData.time || updateData.duration !== undefined) {
      const startTime = updateData.time || session.eventStartTime;
      const duration =
        updateData.duration !== undefined
          ? updateData.duration
          : session.duration;
      if (startTime && duration !== undefined) {
        const [h, m] = startTime.split(":").map(Number);
        session.eventEndTime = new Date(0, 0, 0, h, m + duration)
          .toTimeString()
          .slice(0, 5);
      }
    }

    await session.save();

    const sessionObj = session.toObject();
    for (const attendee of sessionObj.attendees as any[]) {
      await sendGymSessionNotificationEmail({
        userEmail: attendee.email,
        username: `${attendee.firstName} ${attendee.lastName}`,
        sessionName: sessionObj.eventName,
        actionType: "edited",
        oldDetails: oldDetails,
        newDetails: {
          date: new Date(sessionObj.eventStartDate),
          time: sessionObj.eventStartTime,
          location: sessionObj.location || "TBD",
          instructor: sessionObj.trainer ?? undefined,
          duration: sessionObj.duration,
        },
      });
    }

    return session;
  }

  async registerUserToSession(
    sessionId: string,
    userId: string
  ): Promise<IGymSessionEvent> {
    const session = await this.gymSessionRepo.findById(sessionId);
    if (!session) {
      throw createError(404, "Gym session not found");
    }
    if(new Date(session.eventStartDate) < new Date()) {
      throw createError(400, "Session has already started or passed");
    }
    if (session.attendees.length >= session.capacity) {
      throw createError(400, "Session is at full capacity");
    }
    const isAlreadyRegistered = session.attendees?.some((attendee: any) => {
      const attendeeId = attendee._id || attendee;
      return attendeeId.toString() === userId;
    });

    if (isAlreadyRegistered) {
      throw createError(400, "User is already registered for this session");
    }

    // Check for overlapping sessions
    const userSessions = await this.getUserRegisteredSessions(userId);
    const newSessionStart = new Date(session.eventStartDate);
    const newSessionEnd = new Date(session.eventEndDate);

    for (const existingSession of userSessions) {
      const existingStart = new Date(existingSession.eventStartDate);
      const existingEnd = new Date(existingSession.eventEndDate);

      // Check if time ranges overlap
      const hasOverlap = newSessionStart < existingEnd && newSessionEnd > existingStart;
      
      if (hasOverlap) {
        throw createError(
          400,
          `This session Overlaps with one of your registered sessions: "${existingSession.eventName}"`
        );
      }
    }

    console.log("Registering user", userId, "to session", sessionId);
    session.attendees?.push(userId as any);
     
    await session.save();
    return session;
  }

  async getUserRegisteredSessions(userId: string): Promise<IGymSessionEvent[]> {
    return this.gymSessionRepo.findAll(
      {
        type: EVENT_TYPES.GYM_SESSION,
        attendees: userId,
      },
      {
        select:
          " sessionType eventName trainer eventStartDate eventEndDate eventStartTime duration eventEndTime location description capacity",
      }
    );
  }
}
  
