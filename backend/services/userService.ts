import { IUser } from "../interfaces/models/user.interface";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";
import { UserStatus } from "../constants/user.constants";
import { populateMap } from "../utils/userPopulationMap";
import { Schema } from "mongoose";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import { IStudent } from "../interfaces/models/student.interface";
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { StaffPosition } from "../constants/staffMember.constants";
import { VerificationService } from "./verificationService";
import { sendVerification } from "./emailService";

export class UserService {
  private userRepo: GenericRepository<IUser>;
  private staffMemberRepo: GenericRepository<IStaffMember>;
  private verificationService: VerificationService;

  constructor() {
    this.userRepo = new GenericRepository(User);
    this.staffMemberRepo = new GenericRepository(StaffMember);
    this.verificationService = new VerificationService();
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

  getPopulateOptionsByRole(role: string): string[] {
    const basePopulate = ["companyName"];
    if (role === "admin") {
      return [...basePopulate, "adminField1", "adminField2"];
    }
    return basePopulate;
  }

  async getUserById(id: string): Promise<Omit<IUser, "password">> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw createError(404, "User not found");
    }

    const populateFields = populateMap[user.role] || [];

    // Fetch again with populate
    const populatedUser = await this.userRepo.findById(id, {
      populate: populateFields,
    });

    const plainUser = populatedUser?.toObject();

    // Remove password
    const { password, ...userWithoutPassword } = plainUser!;
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
    if(user.status === UserStatus.BLOCKED) {
      throw createError(400, "User is already blocked");
    }
    user.status = UserStatus.BLOCKED;
    await user.save();
  }
}
