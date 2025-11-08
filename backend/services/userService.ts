import { IUser } from "../interfaces/models/user.interface";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";
import { UserStatus } from "../constants/user.constants";
import { populateMap } from "../utils/userPopulationMap";
import mongoose, { Schema } from "mongoose";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import { IStudent } from "../interfaces/models/student.interface";
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { StaffPosition } from "../constants/staffMember.constants";
import { VerificationService } from "./verificationService";

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
      // Convert Mongoose document to plain object
      const plainUser = user.toObject();
      const { password, ...userWithoutPassword } = plainUser;
      return userWithoutPassword as Omit<IUser, "password">;
    });

    return formattedUsers;
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

  // Add an event to user's favorites (idempotent)
  async addToFavorites(
    id: string,
    eventId: string | mongoose.Types.ObjectId
  ): Promise<IUser> {
    const user = (await this.userRepo.findById(id)) as IStaffMember | IStudent;
    if (!user) {
      throw createError(404, "User not found");
    }
    // Normalize eventId to a mongoose ObjectId if needed
    const objectId =
      typeof eventId === "string"
        ? new mongoose.Types.ObjectId(eventId)
        : eventId;

    // Ensure favorites array exists locally
    const finalFavorites: any[] =
      user.favorites && Array.isArray(user.favorites) ? user.favorites : [];

    // Add only if not already present
    const exists = finalFavorites.some(
      (fav: any) => fav.toString() === objectId.toString()
    );
    if (!exists) {
      finalFavorites.push(objectId as any);
      user.favorites = finalFavorites as any;
      await user.save();
    }

    return user;
  }

  // Remove an event from user's favorites (idempotent)
  async removeFromFavorites(
    id: string,
    eventId: string | mongoose.Types.ObjectId
  ): Promise<IUser> {
    const user = (await this.userRepo.findById(id)) as IStaffMember | IStudent;
    if (!user) {
      throw createError(404, "User not found");
    }

    // Normalize eventId to a mongoose ObjectId if needed
    const objectId =
      typeof eventId === "string"
        ? new mongoose.Types.ObjectId(eventId)
        : eventId;

    // If favorites is not an array, ensure it's an empty array
    const finalFavorites: any[] =
      user.favorites && Array.isArray(user.favorites) ? user.favorites : [];

    // Remove any matching entries
    const filtered = finalFavorites.filter(
      (fav: any) => fav.toString() !== objectId.toString()
    );

    // Only save if something changed
    if (filtered.length !== finalFavorites.length) {
      user.favorites = filtered as any;
      await user.save();
    }

    return user;
  }

  async blockUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw createError(404, "User not found");
    }
    if (user.status === UserStatus.BLOCKED) {
      throw createError(400, "User is already blocked");
    }
    user.status = UserStatus.BLOCKED;
    await user.save();
  }

  async unBlockUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw createError(404, "User not found");
    }
    if (user.status === UserStatus.ACTIVE) {
      throw createError(400, "User is already Active");
    }
    user.status = UserStatus.ACTIVE;
    await user.save();
  }

  async getAllUnAssignedStaffMembers(): Promise<IStaffMember[]> {
    const staffMembers = await this.staffMemberRepo.findAll({
      position: StaffPosition.UNKNOWN,
    });

    // Convert Mongoose documents to plain objects
    return staffMembers.map((staff) => staff.toObject());
  }

  async getAllTAs(): Promise<IStaffMember[]> {
    const staffMembers = await this.staffMemberRepo.findAll({
      position: StaffPosition.TA,
    });

    // Convert Mongoose documents to plain objects
    return staffMembers.map((staff) => staff.toObject());
  }

  async getAllStaff(): Promise<IStaffMember[]> {
    const staffMembers = await this.staffMemberRepo.findAll({
      position: StaffPosition.STAFF,
    });

    // Convert Mongoose documents to plain objects
    return staffMembers.map((staff) => staff.toObject());
  }

  async assignRoleAndSendVerification(
    userId: string,
    position: string
  ): Promise<{
    user: Omit<IStaffMember, "password">;
    verificationtoken: string;
  }> {
    // Find user by ID
    const user = await this.staffMemberRepo.findById(userId);
    if (!user) {
      throw createError(404, "User not found or not a staff member");
    }

    // Check if user is already verified
    if (user.isVerified) {
      throw createError(400, "User is already verified");
    }

    // Check if position is valid
    if (position !== "professor" && position !== "TA" && position !== "staff") {
      throw createError(400, "Invalid position");
    }

    // Update user position
    user.position = position as StaffPosition;
    user.updatedAt = new Date();
    await user.save();

    // Generate verification token
    const verificationtoken =
      this.verificationService.generateVerificationToken(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject
      ? user.toObject()
      : user;

    return {
      user: userWithoutPassword as Omit<IStaffMember, "password">,
      verificationtoken,
    };
  }

  async getAllProfessors(): Promise<Omit<IStaffMember, "password">[]> {
    const professors = await this.staffMemberRepo.findAll(
      { position: StaffPosition.PROFESSOR, isVerified: true },
      {
        select:
          "firstName lastName name email role gucId position roleType status myWorkshops",
      }
    );
    return professors.map((prof) => prof.toObject());
  }
}
