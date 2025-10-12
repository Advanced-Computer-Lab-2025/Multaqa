import { IUser } from "../interfaces/models/user.interface";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";
import { UserStatus } from "../constants/user.constants";
import { StaffMember } from "../schemas/stakeholder-schemas/staffMemberSchema";
import { StaffPosition } from "../constants/staffMember.constants";
import { VerificationService } from "./verificationService";
import { sendVerification } from "./emailService";
import { IStaffMember } from "../interfaces/models/staffMember.interface";

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

    const formattedUsers = users.map(user => {
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

  async assignRoleAndSendVerification(userId: string, position: string): Promise< Omit<IStaffMember, 'password'> > {
    // Find user by ID
    const user = await this.staffMemberRepo.findById(userId);
    if (!user) {
      throw createError(404, 'User not found or not a staff member');
    }

    // Check if user is already verified
    if (user.isVerified) {
      throw createError(400, 'User is already verified');
    }

    // Check if position is valid
    if (position !== "professor" && position !== "TA" && position !== "staff") {
      throw createError(400, 'Invalid position');
    }

    // Update user position
    user.position = position as StaffPosition;
    user.updatedAt = new Date();
    await user.save();
    
    // Generate verification token and send email
    const token = this.verificationService.generateVerificationToken(user);
    const link = `http://localhost:${process.env.BACKEND_PORT}/auth/verify?token=${token}`; // should be frontend URL
    await sendVerification(user.email, link);

    // Remove password from response
    const { password, ...userWithoutPassword } = user.toObject ? user.toObject() : user;

    return userWithoutPassword as Omit<IStaffMember, 'password'>;
  }
}