import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface';
import { StudentAndStaffSignupRequest, VendorSignupRequest, LoginRequest } from '../interfaces/authRequests.interface';
import GenericRepository from '../repos/genericRepo';
import { User } from '../schemas/stakeholder-schemas/userSchema';
import { UserRole } from '../constants/user.constants';
import { IStudent } from '../interfaces/student.interface';
import { Student } from '../schemas/stakeholder-schemas/studentSchema';
import { IStaffMember } from '../interfaces/staffMember.interface';
import { StaffMember } from '../schemas/stakeholder-schemas/staffMemberSchema';

export class AuthService {
  private userRepo: GenericRepository<IUser>;
  private studentRepo: GenericRepository<IStudent>;
  private staffRepo: GenericRepository<IStaffMember>;

  constructor() {
    this.userRepo = new GenericRepository<IUser>(User);
    this.studentRepo = new GenericRepository<IStudent>(Student);
    this.staffRepo = new GenericRepository<IStaffMember>(StaffMember);
  }

  // signup for Students, TAs, staff, professors
  async signup(signupData: StudentAndStaffSignupRequest): Promise<{ user: Omit<IUser, 'password'>, token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({ email: signupData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Check if GUC ID is already taken
    const existingGucId = await this.userRepo.findOne({ gucId: signupData.gucId });
    if (existingGucId) {
      throw new Error('User with this GUC ID already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(signupData.password, saltRounds);

    let createdUser = null;

    // Determine role based on email domain and create user accordingly
    if (signupData.email.includes("@student.guc.edu.eg")) {
      createdUser = await this.studentRepo.create(
        {
          ...signupData,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
          role: UserRole.STUDENT,
        }
      );
    } 
    else { // staff member (staff/TA/Professor)
      createdUser = await this.staffRepo.create(
        {
          ...signupData,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
          role: UserRole.STAFF_MEMBER,
          // position: I don't know yet (Admin will insert correct roles later)
        }
      );
    }

    // Generate JWT token
    const token = this.generateToken(createdUser!);

    // Remove password from response and convert to plain object
    const { password, ...userWithoutPassword } = createdUser?.toObject()!;

    return {
      user: userWithoutPassword as Omit<IUser, 'password'>,
      token
    };
  }

  // signup for vendors
  async signupVendor(signupData: VendorSignupRequest): Promise<{ user: Omit<IUser, 'password'>, token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({ email: signupData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(signupData.password, saltRounds);

    // Create vendor user
    const createdUser = await this.userRepo.create({
      ...signupData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
      role: UserRole.VENDOR,
    });

    // Generate JWT token
    const token = this.generateToken(createdUser);

    // Remove password from response and convert to plain object
    const { password, ...userWithoutPassword } = createdUser.toObject ? createdUser.toObject() : createdUser;

    return {
      user: userWithoutPassword as Omit<IUser, 'password'>,
      token
    };
  }

  // for all users
  async login(loginRequest: LoginRequest): Promise<{ user: Omit<IUser, 'password'>, token: string }> {
    const { email, password } = loginRequest;

    // Find user by email
    const user = await this.userRepo.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is blocked
    if (user.status == "blocked") {
      throw new Error('Account is blocked');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Remove password from response and convert to plain object
    const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;

    return {
      user: userWithoutPassword as Omit<IUser, 'password'>,
      token
    };
  }

  private generateToken(user: IUser): string {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET! as Secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    } as SignOptions);
  }
}