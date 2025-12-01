import { INotification, IUser } from "../interfaces/models/user.interface";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";
import { UserStatus } from "../constants/user.constants";
import { populateMap } from "../utils/userPopulationMap";
import mongoose, { Types } from "mongoose";
import { IStaffMember } from "../interfaces/models/staffMember.interface";
import { IStudent } from "../interfaces/models/student.interface";
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { StaffPosition } from "../constants/staffMember.constants";
import {
  sendBlockUnblockEmail,
  sendStaffRoleAssignmentEmail,
} from "./emailService";
import { IAdministration } from "../interfaces/models/administration.interface";
import { Administration } from "../schemas/stakeholder-schemas/administrationSchema";
import { VerificationService } from "./verificationService";

export class UserService {
  private userRepo: GenericRepository<IUser>;
  private staffMemberRepo: GenericRepository<IStaffMember>;
  private administrationRepo: GenericRepository<IAdministration>;
  private verificationService: VerificationService;

  constructor() {
    this.userRepo = new GenericRepository(User);
    this.staffMemberRepo = new GenericRepository(StaffMember);
    this.administrationRepo = new GenericRepository(Administration);
    this.verificationService = new VerificationService();
  }

  /**
   * Filter out archived events from populated user fields
   * @param user - Plain user object with potentially populated event fields
   */
  private filterArchivedEvents(user: any): void {
    if (!user) return;

    // Filter favorites (students and staff members)
    if (user.favorites && Array.isArray(user.favorites)) {
      user.favorites = user.favorites.filter((event: any) => {
        // If it's just an ObjectId (not populated), keep it
        if (!event || typeof event === "string" || !event._id) {
          return true;
        }
        // If it's populated, filter out archived ones
        return !event.archived;
      });
    }

    // Filter registeredEvents (students and staff members)
    if (user.registeredEvents && Array.isArray(user.registeredEvents)) {
      user.registeredEvents = user.registeredEvents.filter((event: any) => {
        // If it's just an ObjectId (not populated), keep it
        if (!event || typeof event === "string" || !event._id) {
          return true;
        }
        // If it's populated, filter out archived ones
        return !event.archived;
      });
    }

    // Filter myWorkshops (staff members/professors)
    if (user.myWorkshops && Array.isArray(user.myWorkshops)) {
      user.myWorkshops = user.myWorkshops.filter((workshop: any) => {
        // If it's just an ObjectId (not populated), keep it
        if (!workshop || typeof workshop === "string" || !workshop._id) {
          return true;
        }
        // If it's populated, filter out archived ones
        return !workshop.archived;
      });
    }

    // Filter requestedEvents (vendors)
    if (user.requestedEvents && Array.isArray(user.requestedEvents)) {
      user.requestedEvents = user.requestedEvents.filter((reqEvent: any) => {
        // If event is not populated, keep it
        if (
          !reqEvent ||
          !reqEvent.event ||
          typeof reqEvent.event === "string" ||
          !reqEvent.event._id
        ) {
          return true;
        }
        // If event is populated, filter out archived ones
        return !reqEvent.event.archived;
      });
    }
  }

  async getAllUsers(): Promise<Omit<IUser, "password">[]> {
    const users = await this.userRepo.findAll(
      { isVerified: true },
      {
        select:
          "firstName lastName name email role gucId position roleType status companyName registeredAt verifiedAt updatedAt taxCard logo",
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

    // Remove archived events from populated fields
    this.filterArchivedEvents(plainUser);

    // Remove password
    const { password, ...userWithoutPassword } = plainUser!;
    return userWithoutPassword as Omit<IUser, "password">;
  }

  async getUserNotifications(id: string): Promise<INotification[]> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw createError(404, "User not found");
    }

    return user.notifications || [];
  }
  
  async addEventToUser(id: string, eventId: Types.ObjectId): Promise<IUser> {
    const user = (await this.userRepo.findById(id)) as IStaffMember | IStudent;
    if (!user) {
      throw createError(404, "User not found");
    }

    user.registeredEvents?.push(
      eventId as unknown as mongoose.Schema.Types.ObjectId
    );
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

    // Ensure favorites array exists
    const finalFavorites: any[] =
      user.favorites && Array.isArray(user.favorites) ? user.favorites : [];

    // debug logs removed

    // If already present, return a 400 error
    const exists = finalFavorites.some(
      (fav: any) => fav.toString() === objectId.toString()
    );
    if (exists) {
      throw createError(400, "This event is already in your favorites list");
    }

    // Add to favorites
    finalFavorites.push(objectId as any);
    user.favorites = finalFavorites as any;
    await user.save();

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

    // Ensure favorites array exists
    const finalFavorites: any[] =
      user.favorites && Array.isArray(user.favorites) ? user.favorites : [];

    // debug logs removed

    // If not present, return 404
    const exists = finalFavorites.some(
      (fav: any) => fav.toString() === objectId.toString()
    );
    if (!exists) {
      throw createError(404, "Event not found in favorites");
    }

    // Remove and persist
    const filtered = finalFavorites.filter(
      (fav: any) => fav.toString() !== objectId.toString()
    );
    user.favorites = filtered as any;
    await user.save();

    return user;
  }

  // Get user's favorites (populated when possible)
  async getFavorites(id: string): Promise<IUser> {
    const user = (await this.userRepo.findById(id)) as IStaffMember | IStudent;
    if (!user) {
      throw createError(404, "User not found");
    }

    // Try to fetch with populated favorites if repo supports populate
    const populated = await this.userRepo.findById(id, {
      populate: ["favorites"],
    });

    return (populated || user) as IUser;
  }

  async blockUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw createError(404, "User not found");
    }
    if (user.status === UserStatus.BLOCKED) {
      throw createError(400, "User is already blocked");
    }
    if ((user as IAdministration).name ==="Super Admin") {
      throw createError(400, "Cannot block Super Admin user");
    }
    user.status = UserStatus.BLOCKED;
    user.updatedAt = new Date();
    await sendBlockUnblockEmail(user.email, true, "admin decision");
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
    user.updatedAt = new Date();
    await sendBlockUnblockEmail(user.email, false, "admin decision");
    await user.save();
  }

  async getAllUnAssignedStaffMembers(): Promise<Omit<IStaffMember, "password">[]> {
    const staffMembers = await this.staffMemberRepo.findAll({
      position: StaffPosition.UNKNOWN,
    });

    // Convert Mongoose documents to plain objects
    return staffMembers.map((staff) => staff.toObject());
  }

  async getAllTAs(): Promise<IStaffMember[]> {
    const staffMembers = await this.staffMemberRepo.findAll(
      { position: StaffPosition.TA},
      {
        select:
          "firstName lastName name email role gucId position roleType status myWorkshops",
      }
    );

    // Convert Mongoose documents to plain objects
    return staffMembers.map((staff) => staff.toObject());
  }

  async getAllStaff(): Promise<IStaffMember[]> {
    const staffMembers = await this.staffMemberRepo.findAll(
      { position: StaffPosition.STAFF},
      {
        select:
          "firstName lastName name email role gucId position roleType status myWorkshops",
      }
    );

    // Convert Mongoose documents to plain objects
    return staffMembers.map((staff) => staff.toObject());
  }

  async getAllProfessors(): Promise<IStaffMember[]> {
    const professors = await this.staffMemberRepo.findAll(
      { position: StaffPosition.PROFESSOR},
      {
        select:
          "firstName lastName name email role gucId position roleType status myWorkshops",
      }
    );

    return professors.map((prof) => prof.toObject());
  }

  async getAllStudents(): Promise<IStudent[]> {
    const students = await this.userRepo.findAll(
      { role: "student", isVerified: true },
      {
        select:
          "firstName lastName name email role gucId status registeredEvents walletBalance",
      }
    );

    return students.map((student) => student.toObject());
  }

  async getAllAdmins(): Promise<IAdministration[]> {
    const admins = await this.administrationRepo.findAll(
      { role: "administration", isVerified: true },
      { select: "firstName lastName name email role gucId roleType status" }
    );

    return admins.map((admin) => admin.toObject());
  }

  async getAllEventsOffice(): Promise<IAdministration[]> {
    const eventsOffice = await this.administrationRepo.findAll(
      { roleType: "eventsOffice", isVerified: true },
      { select: "firstName lastName name email role gucId roleType status" }
    );

    return eventsOffice.map((admin) => admin.toObject());
  }

  async assignRoleAndSendVerification(
    userId: string,
    position: string
  ): Promise<Omit<IStaffMember, "password">> {
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
    const verificationToken =
      this.verificationService.generateVerificationToken(user);
    // Send verification email
    const link = `http://localhost:4000/auth/verify?token=${verificationToken}`;
    await sendStaffRoleAssignmentEmail(
      user.email,
      user.firstName,
      position,
      link
    );
    console.log("Verification email sent to:", user.email);

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject
      ? user.toObject()
      : user;

    return userWithoutPassword as Omit<IStaffMember, "password">;
  }

  /**
   * Deduct amount from user's wallet balance
   * @param userId - User ID
   * @param amount - Amount to deduct
   * @returns Updated user
   */
  async deductFromWallet(userId: string, amount: number): Promise<IUser> {
    const user = (await this.userRepo.findById(userId)) as
      | IStaffMember
      | IStudent;
    if (!user) {
      throw createError(404, "User not found");
    }

    const walletBalance = user.walletBalance || 0;
    if (walletBalance < amount) {
      throw createError(400, "Insufficient wallet balance");
    }

    user.walletBalance = walletBalance - amount;
    await user.save();
    return user;
  }

  /**
   * Add amount to user's wallet balance
   * @param userId - User ID
   * @param amount - Amount to add
   * @returns Updated user
   */
  async addToWallet(userId: string, amount: number): Promise<IUser> {
    const user = (await this.userRepo.findById(userId)) as
      | IStaffMember
      | IStudent;
    if (!user) {
      throw createError(404, "User not found");
    }

    const walletBalance = user.walletBalance || 0;
    user.walletBalance = walletBalance + amount;
    await user.save();
    return user;
  }

  /**
   * Add a transaction to user's transaction history
   * @param userId - User ID
   * @param transaction - Transaction details
   * @returns Updated user
   */
  async addTransaction(
    userId: string,
    transaction: {
      eventName: string;
      amount: number;
      walletAmount?: number;
      cardAmount?: number;
      type: "payment" | "refund";
      date: Date;
    }
  ): Promise<IUser> {
    const user = (await this.userRepo.findById(userId)) as
      | IStaffMember
      | IStudent;
    if (!user) {
      throw createError(404, "User not found");
    }

    if (!user.transactions) {
      user.transactions = [];
    }

    user.transactions.push(transaction as any);
    await user.save();
    return user;
  }

  /**
   * Remove an event from user's registered events
   * @param userId - User ID
   * @param eventId - Event ID to remove
   * @returns Updated user
   */
  async removeEventFromUserRegistrations(
    userId: string,
    eventId: string
  ): Promise<IUser> {
    const user = (await this.userRepo.findById(userId)) as
      | IStaffMember
      | IStudent;
    if (!user) {
      throw createError(404, "User not found");
    }

    // Normalize eventId to a mongoose ObjectId
    const objectId =
      typeof eventId === "string"
        ? new mongoose.Types.ObjectId(eventId)
        : eventId;

    // Ensure registeredEvents array exists
    const registeredEvents: any[] =
      user.registeredEvents && Array.isArray(user.registeredEvents)
        ? user.registeredEvents
        : [];

    // Check if event exists in registered events
    const exists = registeredEvents.some(
      (event: any) => event.toString() === objectId.toString()
    );

    if (!exists) {
      throw createError(404, "Event not found in user's registered events");
    }

    // Remove the event from registered events
    const filtered = registeredEvents.filter(
      (event: any) => event.toString() !== objectId.toString()
    );
    user.registeredEvents = filtered as any;
    await user.save();

    return user;
  }
}
