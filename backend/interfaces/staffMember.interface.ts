import { Document, Schema } from "mongoose";
import { IUser } from "./user.interface";

export interface IStaffMember extends IUser {
  firstName: string;
  lastName: string;
  gucId: string;
  walletBalance: number;
  position: StaffPosition;
  favorites: Schema.Types.ObjectId[];
  registeredEvents: Schema.Types.ObjectId[];
  // TODO: Filter registeredEvents by (date < today) to get attended ones
  myWorkshops: Schema.Types.ObjectId[];
  permissions?: string[]; // only filled if professor
}

export type StaffPosition = "staff" | "TA" | "professor";

export const PROFESSOR_PERMISSIONS = [
  "EDIT_WORKSHOP_DETAILS",
  "VIEW_MY_WORKSHOPS",
  "VIEW_PARTICIPANTS",
  "VIEW_REMAINING_SPOTS",
  "VIEW_STATUS_REQUESTS",
  "RECEIVE_WORKSHOP_NOTIFICATIONS",
];
