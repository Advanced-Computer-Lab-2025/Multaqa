import GenericRepository from "../repos/genericRepo";
import { GymSession } from "../schemas/event-schemas/gymSessionEventSchema";
import {
  IGymSessionCreationRequest,
  IGymSessionEvent,
} from "../interfaces/models/gymSessionsEvent.interface";
import { EVENT_TYPES } from "../constants/events.constants";
import { UserRole } from "../constants/user.constants";

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
      eventEndDate: sessionDate,
      eventStartTime: data.time,
      eventEndTime: new Date(0, 0, 0, h, m + data.duration)
        .toTimeString()
        .slice(0, 5),
      registrationDeadline: new Date(
        sessionDate.getTime() - 24 * 60 * 60 * 1000
      ), // 1 day before
      location: "Gym",
      description: data.trainer
        ? `${data.sessionType} class instructed by ${data.trainer}`
        : `${data.sessionType} class`,
      price: 0,
      allowedUsers: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
    });
  }

  async getAllGymSessions(): Promise<IGymSessionEvent[]> {
    const filter: any = { type: EVENT_TYPES.GYM_SESSION };

    const date = new Date();

    filter.eventStartDate = {
      $gte: new Date(date.getFullYear(), date.getMonth(), 1),
      $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
    };

    return this.gymSessionRepo.findAll(filter, {
      select:
        " sessionType eventName trainer eventStartDate eventStartTime duration eventEndTime location description capacity",
    });
  }

  async editGymSession(
    sessionId: string,
    updateData: { date?: string; time?: string; duration?: number }
  ): Promise<IGymSessionEvent> {
    const session = await this.gymSessionRepo.findById(sessionId);
    if (!session) {
      throw new Error("Gym session not found");
    }

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
      const [h, m] = startTime.split(":").map(Number);
      session.eventEndTime = new Date(0, 0, 0, h, m + duration)
        .toTimeString()
        .slice(0, 5);
    }

    await session.save();
    return session;
  }
}
