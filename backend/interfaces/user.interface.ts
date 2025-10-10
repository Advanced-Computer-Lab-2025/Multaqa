import { Document } from "mongoose";
import { UserRole } from "../constants/user.constants.js";
import { UserStatus } from "../constants/user.constants.js";

export interface INotification {
  title: string;
  message: string;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  status?: UserStatus;
  role: UserRole;
  registeredAt?: Date;
  verifiedAt?: Date;
  updatedAt?: Date;
  isVerified: boolean;
  notifications?: INotification[];
}
