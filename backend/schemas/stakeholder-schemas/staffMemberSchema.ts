import { Schema } from "mongoose";
import { IStaffMember } from "../../interfaces/models/staffMember.interface";
import { User } from "./userSchema";
import { StaffPosition } from "../../constants/staffMember.constants";

const staffMemberSchema = new Schema<IStaffMember>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gucId: { type: String, required: true },
  position: {
    type: String,
    enum: Object.values(StaffPosition),
    default: StaffPosition.UNKNOWN,
  },
  walletBalance: { type: Number, default: 0 },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }],
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }],
  myWorkshops: [{ type: Schema.Types.ObjectId, ref: "Workshop", default: [] }]
});

export const StaffMember = User.discriminator<IStaffMember>(
  "staffMember",
  staffMemberSchema
);
