import GenericRepository from "../repos/genericRepo";
import { GymSession } from "../schemas/event-schemas/gymSessionEventSchema";
import {
  IGymSessionCreationRequest,
  IGymSessionEvent,
} from "../interfaces/gymSessionsEvent.interface";
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
        " sessionType eventName trainer eventStartDate eventStartTime duration eventEndTime location description capacity"
    });
  }
}
