import { Document, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { StaffPosition } from "../../constants/staffMember.constants";
import { ITransaction } from "./student.interface";

export interface IStaffMember extends IUser {
  firstName: string;
  lastName: string;
  gucId: string;
  walletBalance?: number;
  transactions?: ITransaction[];
  position?: StaffPosition;
  favorites?: Schema.Types.ObjectId[];
  registeredEvents?: Schema.Types.ObjectId[];
  // TODO: Filter registeredEvents by (date < today) to get attended ones
  myWorkshops?: Schema.Types.ObjectId[];
}
