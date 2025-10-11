import bcrypt from 'bcrypt';
import { IAdministration } from '../interfaces/administration.interface';
import { AdministrationSignupRequest } from '../interfaces/requests/authRequests.interface';
import { UserRole, UserStatus } from '../constants/user.constants';
import GenericRepository from '../repos/genericRepo';
import { Administration } from '../schemas/stakeholder-schemas/administrationSchema';
import createError from 'http-errors';
import { AdministrationRoleType } from '../constants/administration.constants';
import { VerificationService } from './verificationService';
import { sendVerification } from './emailService';
import { IStaffMember } from '../interfaces/staffMember.interface';
import { StaffMember } from '../schemas/stakeholder-schemas/staffMemberSchema';
import { StaffPosition } from '../constants/staffMember.constants';

export class AdministrationService {
  private administrationRepo: GenericRepository<IAdministration>;
  private verificationService: VerificationService;
  private staffMemberRepo: GenericRepository<IStaffMember>;

  constructor() {
    this.administrationRepo = new GenericRepository<IAdministration>(Administration);
    this.verificationService = new VerificationService();
    this.staffMemberRepo = new GenericRepository<IStaffMember>(StaffMember);
  }

  async createAdminAccount(adminData: AdministrationSignupRequest): Promise<{ user: Omit<IAdministration, 'password'> }> {
    // Check if user already exists
    const existingUser = await this.administrationRepo.findOne({ email: adminData.email });
    if (existingUser) {
      throw createError(400, 'User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin user
    const createdUser = await this.administrationRepo.create({
      ...adminData,
      password: hashedPassword,
      registeredAt: new Date(),
      updatedAt: new Date(),
      isVerified: true, // Admins are auto-verified
      role: UserRole.ADMINISTRATION,
      roleType: adminData.role == 'admin' ? AdministrationRoleType.ADMIN : AdministrationRoleType.EVENTS_OFFICE,
      status: UserStatus.ACTIVE,
    });

    if (!createdUser) {
      throw createError(500, 'Failed to create admin account');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = createdUser.toObject ? createdUser.toObject() : createdUser;

    return {
      user: userWithoutPassword as Omit<IAdministration, 'password'>,
    };
  }

  async deleteAdminAccount(adminId: string, creatorId: string): Promise<{ message: string }> {
    // Prevent self-deletion
    if (adminId === creatorId) {
      throw createError(400, 'Cannot delete your own account');
    }

    // Find the admin to delete
    const adminToDelete = await this.administrationRepo.findById(adminId);
    if (!adminToDelete) {
      throw createError(404, 'Admin account not found');
    }

    // Delete the admin account
    const deletedAdmin = await this.administrationRepo.delete(adminId);
    if (!deletedAdmin) {
      throw createError(500, 'Failed to delete admin account');
    }

    return {
      message: `Admin account for ${deletedAdmin.name} has been deleted successfully`,
    };
  }

  async getAllAdminAccounts(): Promise<Partial<IAdministration>[]> {
    return await this.administrationRepo.findAll(
      { role: UserRole.ADMINISTRATION },
      {
        select: 'name email roleType status registeredAt isVerified',
      }
    );
  }

  async assignRoleAndSendVerification(userId: string, position: string): Promise<{ user: Omit<IStaffMember, 'password'> }> {
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

    return {
      user: userWithoutPassword as Omit<IStaffMember, 'password'>
    };
  }
}