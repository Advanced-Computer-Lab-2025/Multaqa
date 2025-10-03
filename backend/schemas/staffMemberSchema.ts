import { Schema } from "mongoose";
import { User, IUser } from "./userSchema";

export interface IStaffMember extends IUser {
  firstName: string;
  lastName: string;
  staffId: string;
  walletBalance: number;
  position: "staff" | "TA" | "professor";
  favorites: Schema.Types.ObjectId[];
  registeredEvents: Schema.Types.ObjectId[];
  // TODO: Filter registeredEvents by (date < today) to get attended ones
  myWorkshops: Schema.Types.ObjectId[];
  permissions?: string[]; // only filled if professor
}

const PROFESSOR_PERMISSIONS = [
  "EDIT_WORKSHOP_DETAILS",
  "VIEW_MY_WORKSHOPS",
  "VIEW_PARTICIPANTS",
  "VIEW_REMAINING_SPOTS",
  "VIEW_STATUS_REQUESTS",
  "RECEIVE_WORKSHOP_NOTIFICATIONS",
];

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