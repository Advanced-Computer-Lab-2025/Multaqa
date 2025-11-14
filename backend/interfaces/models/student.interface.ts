import { Schema } from "mongoose";
import { IUser } from "./user.interface";

export interface ITransaction {
  eventName: string;
  amount: number;
  walletAmount?: number;
  cardAmount?: number;
  type: "payment" | "refund";
  date: Date;
}

export interface IStudent extends IUser {
  firstName: string;
  lastName: string;
  gucId: string;
  walletBalance?: number;
  transactions?: ITransaction[];
  favorites?: Schema.Types.ObjectId[];
  registeredEvents?: Schema.Types.ObjectId[];
  // TODO: Filter registeredEvents by (date < today) to get attended ones
}
