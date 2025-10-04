import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IStudent } from "../../interfaces/student.interface";

const studentSchema = new Schema<IStudent>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentId: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

export const Student = User.discriminator<IStudent>("student", studentSchema);
