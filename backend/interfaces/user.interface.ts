import { Document } from "mongoose";

export interface INotification {
  title: string;
  message: string;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  notifications: INotification[];
}

export type UserRole =
  | "student"
  | "staffMember"
  | "vendor"
  | "administration"
  | "unknown";

export type UserStatus = "active" | "blocked";