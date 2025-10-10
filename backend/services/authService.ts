import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User } from '../schemas/stakeholder-schemas/userSchema';
import { UserRole } from '../constants/user.constants';
import { IUser } from '../interfaces/user.interface';
import { StudentAndStaffSignupRequest, VendorSignupRequest, LoginRequest } from '../interfaces/authRequests.interface';
import GenericRepository from '../repos/genericRepo';
import { IStudent } from '../interfaces/student.interface';
import { Student } from '../schemas/stakeholder-schemas/studentSchema';
import { IStaffMember } from '../interfaces/staffMember.interface';
import { StaffMember } from '../schemas/stakeholder-schemas/staffMemberSchema';
import redisClient from '../config/redisClient';
import { IVendor } from '../interfaces/vendor.interface';
import { Vendor } from '../schemas/stakeholder-schemas/vendorSchema';

export class AuthService {
  private userRepo: GenericRepository<IUser>;
  private studentRepo: GenericRepository<IStudent>;
  private staffRepo: GenericRepository<IStaffMember>;
  private vendorRepo: GenericRepository<IVendor>;
  
  constructor() {
    this.userRepo = new GenericRepository<IUser>(User);
    this.studentRepo = new GenericRepository<IStudent>(Student);
    this.staffRepo = new GenericRepository<IStaffMember>(StaffMember);
    this.vendorRepo = new GenericRepository<IVendor>(Vendor);
  }

  // signup for Students, TAs, Staff, Professors, Vendors
  async signup(signupData: StudentAndStaffSignupRequest | VendorSignupRequest): Promise<{ user: Omit<IUser, 'password'> }> {
    // Check if user already exists
    const existingUser = await this.userRepo.findOne({ email: signupData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // If signing up as student or staff, check for GUC ID uniqueness
    if ('gucId' in signupData) {
      // Check if GUC ID is already taken
      const [existingStudent, existingStaff] = await Promise.all([
        this.studentRepo.findOne({ gucId: signupData.gucId }),
        this.staffRepo.findOne({ gucId: signupData.gucId }),
      ]);

      if (existingStudent || existingStaff) {
        throw new Error('User with this GUC ID already exists');
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
          // position: I don't know yet (Admin will insert correct roles later)
        }
      );
    }
    else{
      createdUser = await this.vendorRepo.create({
        ...signupData,
        password: hashedPassword,
        registeredAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        role: UserRole.VENDOR,
      });
    }

    if (!createdUser)
      throw new Error('Failed to create user');

    // Remove password from response and convert to plain object
    const { password, ...userWithoutPassword } = createdUser.toObject ? createdUser.toObject() : createdUser;

    return {
      user: userWithoutPassword as Omit<IUser, 'password'>,
    };
  }

  // for all users
  async login(loginRequest: LoginRequest): Promise<{ user: Omit<IUser, 'password'>, tokens: { accessToken: string, refreshToken: string } }> {
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
      throw new Error('No refresh token provided');
    
    const userId = await redisClient.get(`refresh:${token}`); // key is refresh:token, value is userId
    if (!userId) 
      throw new Error('Invalid or expired refresh token');

    if(!process.env.REFRESH_TOKEN_SECRET) 
      throw new Error('Missing Refresh Token Secret');

    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as Secret, (err, user: any) => {
        if (err) 
          return reject(new Error('Invalid or expired refresh token'));
        const newAccess = this.generateAccessToken(user);
        resolve(newAccess);
      });
    });
  }

  async logout(token: string): Promise<void> {
    if (!token) 
      throw new Error('No refresh token provided');
    await redisClient.del(`refresh:${token}`);
  }


  generateAccessToken(user: IUser): string {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET! as Secret, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    } as SignOptions);
  }

  generateRefreshToken(user: IUser): string {
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET! as Secret, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    } as SignOptions);
  }

}