import { Schema } from "mongoose";
import { IStaffMember } from "../../interfaces/staffMember.interface";
import { User } from "./userSchema";
import { StaffPosition } from "../../constants/staffMember.constants";
import { PROFESSOR_PERMISSIONS } from "../../constants/staffMember.constants";

const staffMemberSchema = new Schema<IStaffMember>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gucId: { type: String, required: true },
  position: {
    type: String,
    enum: Object.values(StaffPosition),
    required: true,
  },
  walletBalance: { type: Number, default: 0 },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }],
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }],
  myWorkshops: [{ type: Schema.Types.ObjectId, ref: "Workshop", default: [] }],
  permissions: {
    type: [String],
    default: function (this: IStaffMember) {
      return this.position === "professor" ? PROFESSOR_PERMISSIONS : [];
    },
  },
});

export const StaffMember = User.discriminator<IStaffMember>(
  "staffMember",
  staffMemberSchema
);
