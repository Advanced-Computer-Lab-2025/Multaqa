import { Document } from "mongoose";
import { IUser } from "./user.interface.js";
import { IReview } from "./review.interface.js";
import { EVENT_TYPES } from "../constants/events.constants.js";
import { IVendor } from "./vendor.interface.js";
import { UserRole } from "../constants/user.constants.js";

export interface IEvent extends Document {
  id: string;
  type: EVENT_TYPES;
  archived: boolean;
  attendees: IUser[];
  allowedUsers: UserRole[];
  reviews: IReview[];
  eventName: string;
  eventStartDate: Date;
  eventEndDate: Date;
  eventStartTime: string;
  eventEndTime: string;
  registrationDeadline: Date;
  location: string;
  description: string;
  isPassed: boolean;
  price: number;
  vendors?: { vendor: IVendor | string; RequestData: any }[];
  bazaarAttendees?: { name: string; email: string }[];
  RequestData?: any;
  vendor?: IVendor | string;
  fullAgenda?: string;
  facultyResponsible?: string;
  associatedProfs?: string[];
  budget?: number;
  fundingSource?: string;
  extraResources?: string;
  capacity?: number;
  createdBy: IUser | string;
  createdAt: Date;
  updatedAt: Date;
}
