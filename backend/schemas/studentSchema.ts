import { Schema } from "mongoose";
import { User, IUser } from "./userSchema";

export interface IStudent extends IUser {
	firstName: string;
  lastName: string;
  studentId: string;
  walletBalance: number;
  favorites: Schema.Types.ObjectId[];
  registeredEvents: Schema.Types.ObjectId[];
  // TODO: Filter registeredEvents by (date < today) to get attended ones
}

const studentSchema = new Schema<IStudent>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentId: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

export const Student = User.discriminator<IStudent>("student", studentSchema);