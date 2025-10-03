import { Document } from "mongoose";

export type UserRole =
  | "student"
  | "staffMember"
  | "vendor"
  | "administration"
  | "unknown";

export type UserStatus = "active" | "blocked";

export type StaffPosition = "staff" | "TA" | "professor";

export type AdministrationRoleType = "admin" | "eventOffice";

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
  isVerified: boolean;
  notifications: INotification[];
}
