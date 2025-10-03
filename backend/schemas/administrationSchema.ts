import { Schema } from "mongoose";
import { User, IUser } from "./userSchema";

export interface IAdministration extends IUser {
  name: string;
  roleType: "admin" | "eventOffice";
  permissions: string[];
  // TODO: for the role assignments, filter users on role = unknown and isVerified = false
  // TODO: for the participants in loyalty program, filter on vendors where program != null
}

const ADMIN_PERMISSIONS = [
  "CREATE_ADMIN",
  "DELETE_ADMIN",
  "VERIFY_ROLE",
  "SEND_VERIFICATION",
  "DELETE_COMMENT",
  "BLOCK_USER",
  "VIEW_USERS",
  "MANAGE_PERMISSIONS",
];

const EVENT_OFFICE_PERMISSIONS = [
  "CREATE_EVENT",
  "UPDATE_EVENT",
  "DELETE_EVENT",
  "ASSIGN_VENDOR",
  "VIEW_EVENT_REGISTRATIONS",
  "APPROVE_VENDOR_UPLOADS",
  "RECEIVE_PROFESSOR_REQUESTS", 
  "APPROVE_PROFESSOR_WORKSHOP",
  "REJECT_PROFESSOR_WORKSHOP",
  "REQUEST_WORKSHOP_EDITS",
];

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
