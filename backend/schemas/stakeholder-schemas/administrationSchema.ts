import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IAdministration } from "../../interfaces/models/administration.interface";
import { AdministrationRoleType } from "../../constants/administration.constants";
import { ADMIN_PERMISSIONS, EVENT_OFFICE_PERMISSIONS } from "../../constants/administration.constants";

const administrationSchema = new Schema<IAdministration>({
  name: { type: String, required: true },
  roleType: { type: String, enum: Object.values(AdministrationRoleType), required: true },
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
