import { Document } from "mongoose";
import { UserRole } from "../../constants/user.constants";
import { UserStatus } from "../../constants/user.constants";

export interface INotification extends Document {
  type: string;
  title: string;
  message: string;
  read: boolean;
  delivered: boolean;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  status?: UserStatus;
  role: UserRole;
  notifications: INotification[];
  registeredAt?: Date;
  verifiedAt?: Date;
  updatedAt?: Date;
  isVerified: boolean;
}
