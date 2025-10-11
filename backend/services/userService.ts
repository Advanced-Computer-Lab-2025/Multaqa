import { create } from "domain";
import { IStudent } from "../interfaces/student.interface";
import { IUser } from "../interfaces/user.interface";
import { IStaffMember } from "../interfaces/staffMember.interface";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";
import { Schema } from "mongoose";

export class UserService {
  private userRepo: GenericRepository<IUser>;
  constructor() {
    this.userRepo = new GenericRepository(User);
  }
  async getAllUsers(): Promise<Partial<IUser>[]> {
    return this.userRepo.findAll(
      { isVerified: true },
      {
        select:
          "firstName lastName name email role gucId position roleType status companyName",
      }
    );
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.userRepo.findById(id);
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
}
