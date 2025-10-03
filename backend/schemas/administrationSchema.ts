import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IAdministration, ADMIN_PERMISSIONS, EVENT_OFFICE_PERMISSIONS } from "../interfaces/administration.interface";

const administrationSchema = new Schema<IAdministration>({
  name: { type: String, required: true },
  roleType: { type: String, enum: ["admin", "eventOffice"], required: true },
  permissions: {
    type: [String],
    default: function (this: IAdministration) {
      return this.roleType === "admin"
        ? ADMIN_PERMISSIONS
        : EVENT_OFFICE_PERMISSIONS;
    },
  },
});

export const Administration = User.discriminator<IAdministration>(
  "administration",
  administrationSchema
);
