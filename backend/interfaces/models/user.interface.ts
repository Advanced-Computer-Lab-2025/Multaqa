import { Document, Schema } from "mongoose";
import { UserRole } from "../../constants/user.constants";
import { UserStatus } from "../../constants/user.constants";
import { NotificationType } from "../../constants/user.constants";
import { IEvent } from "./event.interface";

export interface INotification extends Document {
  type: NotificationType;
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
  loyaltyProgram?: {
    discountRate: number;
    promoCode: string;
    termsAndConditions: string;
  };
  googleCalendar?: {
    access_token: string;
    refresh_token: string;
    scope?: string;
    token_type?: string;
    expiry_date?: number;
  };
  calendarEvents?: IEvent[] | Schema.Types.ObjectId[]; // Event IDs that have been added to Google Calendar
}
