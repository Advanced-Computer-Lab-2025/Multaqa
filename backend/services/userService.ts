import { IUser } from "../interfaces/models/user.interface";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";
import { UserStatus } from "../constants/user.constants";
import { Schema } from "mongoose";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import { IStudent } from "../interfaces/models/student.interface";

export class UserService {
  private userRepo: GenericRepository<IUser>;

  constructor() {
    this.userRepo = new GenericRepository(User);
  }

  async getAllUsers(): Promise<Omit<IUser, "password">[]> {
    const users = await this.userRepo.findAll(
      { isVerified: true },
      {
        select:
          "firstName lastName name email role gucId position roleType status companyName",
      }
    );

    const formattedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as Omit<IUser, "password">;
    });

    return formattedUsers;
  }

  async getUserById(id: string): Promise<Omit<IUser, "password">> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw createError(404, "User not found");
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<IUser, "password">;
  }

  async addEventToUser(
    id: string,
    eventId: Schema.Types.ObjectId
  ): Promise<IUser> {
    const user = (await this.userRepo.findById(id)) as IStaffMember | IStudent;
    if (!user) {
      throw createError(404, "User not found");
    }

    user.registeredEvents?.push(eventId);
    await user.save();
    return user;
  }
  async blockUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw createError(404, "User not found");
    }
    user.status = UserStatus.BLOCKED;
    await user.save();
  }
}
