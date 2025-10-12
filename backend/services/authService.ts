import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User } from '../schemas/stakeholder-schemas/userSchema';
import { UserRole } from '../constants/user.constants';
import { IUser } from '../interfaces/models/user.interface';
import GenericRepository from '../repos/genericRepo';
import { IStudent } from '../interfaces/models/student.interface';
import { Student } from '../schemas/stakeholder-schemas/studentSchema';
import { IStaffMember } from '../interfaces/models/staffMember.interface';
import { StaffMember } from '../schemas/stakeholder-schemas/staffMemberSchema';
import redisClient from '../config/redisClient';
import { IVendor } from '../interfaces/models/vendor.interface';
import { Vendor } from '../schemas/stakeholder-schemas/vendorSchema';
import { StaffPosition } from '../constants/staffMember.constants';
import createError from 'http-errors';
import { sendVerification } from './emailService';
import { VerificationService } from './verificationService';
import { AdministrationService } from './administrationService';
import { StudentAndStaffSignupRequest, VendorSignupRequest, LoginRequest } from '../interfaces/authRequests.interface';

export class AuthService {
  private userRepo: GenericRepository<IUser>;
  private studentRepo: GenericRepository<IStudent>;
  private staffRepo: GenericRepository<IStaffMember>;
  private vendorRepo: GenericRepository<IVendor>;
  private verificationService: VerificationService;
  private administrationService: AdministrationService;

  constructor() {
    this.userRepo = new GenericRepository<IUser>(User);
    this.studentRepo = new GenericRepository<IStudent>(Student);
    this.staffRepo = new GenericRepository<IStaffMember>(StaffMember);
    this.vendorRepo = new GenericRepository<IVendor>(Vendor);
    this.verificationService = new VerificationService();
    this.administrationService = new AdministrationService();
  }

  // signup for Students, TAs, Staff, Professors, Vendors
  async signup(signupData: StudentAndStaffSignupRequest | VendorSignupRequest): Promise< Omit<IUser, 'password'> > {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({ email: signupData.email });
    if (existingUser) {
      throw createError(400, 'User with this email already exists');
    }

    // Check if GUC ID is already taken
    if ('gucId' in signupData) {
      const [existingStudent, existingStaff] = await Promise.all([
        this.studentRepo.findOne({ gucId: signupData.gucId }),
        this.staffRepo.findOne({ gucId: signupData.gucId }),
      ]);

      if (existingStudent || existingStaff) {
        throw createError(400, 'User with this GUC ID already exists');
      }
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
          registeredAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
          role: UserRole.STUDENT,
        }
      );

      const token = this.verificationService.generateVerificationToken(createdUser);
      const link = `http://localhost:${process.env.BACKEND_PORT}/auth/verify?token=${token}`;
      await sendVerification(createdUser.email, link);
    }
    else if (signupData.email.includes("@guc.edu.eg")) { // staff member (staff/TA/Professor)
      createdUser = await this.staffRepo.create(
        {
          ...signupData,
          password: hashedPassword,
          registeredAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
          role: UserRole.STAFF_MEMBER,
          position: StaffPosition.UNKNOWN, // position will be updated later by admin
        }
      );
    }
    else {
      createdUser = await this.vendorRepo.create({
        ...signupData,
        password: hashedPassword,
        registeredAt: new Date(),
        updatedAt: new Date(),
        isVerified: true, // Verification of vendors is done in person, nothing is done on the system
        role: UserRole.VENDOR,
      });
    }

    if (!createdUser)
      throw createError(500, 'Failed to create user account');

    // Remove password from response and convert to plain object
    const { password, ...userWithoutPassword } = createdUser.toObject ? createdUser.toObject() : createdUser;

    return userWithoutPassword as Omit<IUser, 'password'>;
  }

  // for all users
  async login(loginRequest: LoginRequest): Promise<{ user: Omit<IUser, 'password'>, tokens: { accessToken: string, refreshToken: string } }> {
    const { email, password } = loginRequest;

    // Find user by email
    const user = await this.userRepo.findOne({ email });
    if (!user) {
      throw createError(400, 'Invalid email or password');
    }

    // Check if user is blocked
    if (user.status == "blocked") {
      throw createError(403, 'Your account has been blocked. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError(400, 'Invalid email or password');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw createError(403, 'Please verify your email before logging in');
    }

    // Generate JWT tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store refresh token in Redis with expiration (7 days)
    await redisClient.setEx(
      `refresh:${refreshToken}`,
      60 * 60 * 24 * 7, // 7 days
      user.id.toString()
    );
    const tokens = { accessToken, refreshToken };

    // Remove password from response and convert to plain object
    const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user;

    return {
      user: userWithoutPassword as Omit<IUser, 'password'>,
      tokens
    };
  }

  async refreshToken(token: string): Promise<string> {
    if (!token)
      throw createError(400, 'No refresh token provided');

    const userId = await redisClient.get(`refresh:${token}`); // key is refresh:token, value is userId
    if (!userId)
      throw createError(403, 'Invalid or expired refresh token');

    if (!process.env.REFRESH_TOKEN_SECRET)
      throw createError(500, 'Missing Refresh Token Secret');

    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as Secret, (err, user: any) => {
        if (err)
          return reject(createError(403, 'Invalid or expired refresh token'));
        const newAccess = this.generateAccessToken(user);
        resolve(newAccess);
      });
    });
  }

  async logout(token: string): Promise<void> {
    if (!token)
      throw createError(400, 'No refresh token provided');
    await redisClient.del(`refresh:${token}`);
  }

  generateAccessToken(user: IUser): string {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET! as Secret, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    } as SignOptions);
  }

  generateRefreshToken(user: IUser): string {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.REFRESH_TOKEN_SECRET! as Secret, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    } as SignOptions);
  }
}