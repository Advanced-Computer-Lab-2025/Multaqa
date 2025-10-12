import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IStudent } from "../../interfaces/models/student.interface";

const studentSchema = new Schema<IStudent>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gucId: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }],
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }],
});

export const Student = User.discriminator<IStudent>("student", studentSchema);
