import { Schema } from "mongoose";
import { IUser } from "./user.interface";

export interface IStudent extends IUser {
  firstName: string;
  lastName: string;
  gucId: string;
  walletBalance?: number;
  favorites?: Schema.Types.ObjectId[];
  registeredEvents?: Schema.Types.ObjectId[];
  // TODO: Filter registeredEvents by (date < today) to get attended ones
}