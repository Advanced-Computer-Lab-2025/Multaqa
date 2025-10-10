import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import createError from "http-errors";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import { IUser } from "../interfaces/user.interface";
import GenericRepository from "../repos/genericRepo";

export class VerificationService {
  private userRepo: GenericRepository<IUser>;

  constructor() {
    this.userRepo = new GenericRepository<IUser>(User);
  }
  
  generateVerificationToken(user: IUser): string {
    return jwt.sign({ id: user.id }, process.env.VERIFICATION_TOKEN_SECRET! as Secret, {
      expiresIn: process.env.VERIFICATION_TOKEN_EXPIRES
    } as SignOptions);
  }

  async verifyUser(token: string) {
    try {
      if (!process.env.VERIFICATION_TOKEN_SECRET) {
        throw createError(500, "Verification token secret not configured");
      }

      const payload = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET) as JwtPayload;
      const user = await this.userRepo.findById(payload.id);
      if (!user) 
        throw createError(404, "User not found");

      user.isVerified = true;
      user.verifiedAt = new Date();
      await user.save();

      return user;
    } catch (err) {
      throw createError(400, "Invalid or expired verification link");
    }
  }
}
