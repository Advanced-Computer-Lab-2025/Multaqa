import bcrypt from 'bcrypt';
import { IAdministration } from '../interfaces/administration.interface';
import { AdministrationSignupRequest } from '../interfaces/authRequests.interface';
import { UserRole, UserStatus } from '../constants/user.constants';
import GenericRepository from '../repos/genericRepo';
import { Administration } from '../schemas/stakeholder-schemas/administrationSchema';
import createError from 'http-errors';
import { AdministrationRoleType } from '../constants/administration.constants';

export class AdminService {
  private administrationRepo: GenericRepository<IAdministration>;

  constructor() {
    this.administrationRepo = new GenericRepository<IAdministration>(Administration);
  }

  async createAdminAccount( adminData: AdministrationSignupRequest ): Promise<{ user: Omit<IAdministration, 'password'> }> {
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

  async deleteAdminAccount( adminId: string, creatorId: string ): Promise<{ message: string }> {
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
}