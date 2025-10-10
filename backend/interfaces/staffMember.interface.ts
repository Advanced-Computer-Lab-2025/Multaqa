import { Document, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { StaffPosition } from "../constants/staffMember.constants";

export interface IStaffMember extends IUser {
  firstName: string;
  lastName: string;
  gucId: string;
  walletBalance?: number;
  position?: StaffPosition;
  favorites?: Schema.Types.ObjectId[];
  registeredEvents?: Schema.Types.ObjectId[];
  // TODO: Filter registeredEvents by (date < today) to get attended ones
  myWorkshops?: Schema.Types.ObjectId[];
  permissions?: string[]; // only filled if professor
}