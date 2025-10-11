import { Document } from "mongoose";
import { UserRole } from "../constants/user.constants";
import { UserStatus } from "../constants/user.constants";

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
