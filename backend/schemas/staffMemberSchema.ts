import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IStaffMember, PROFESSOR_PERMISSIONS } from "../interfaces/staffMember.interface";

const staffMemberSchema = new Schema<IStaffMember>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  staffId: { type: String, required: true },
  position: { type: String, enum: ["staff", "TA", "professor"], required: true },
  walletBalance: { type: Number, default: 0 },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  myWorkshops: [{ type: Schema.Types.ObjectId, ref: "Workshop" }],
  permissions: {
    type: [String],
    default: function (this: IStaffMember) {
      return this.position === "professor" ? PROFESSOR_PERMISSIONS : [];
    },
  },
});

export const Staff = User.discriminator<IStaffMember>("staffMember", staffMemberSchema)