import { Schema, Document } from "mongoose";
import { COURT_TYPES, TIME_SLOTS } from "../../constants/court.constants";

export interface IReservation {
  userId: Schema.Types.ObjectId;
  date: Date;
  slot: TIME_SLOTS;
}

export interface IAvailableSlots {
  availableSlots: TIME_SLOTS[];
  reservedSlots: TIME_SLOTS[];
  totalAvailable: number;
  totalReserved: number;
}

export interface ICourt extends Document {
  type: COURT_TYPES;
  reservations: IReservation[];
}