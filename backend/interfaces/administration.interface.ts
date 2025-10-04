import { Document } from "mongoose";
import { IUser } from "./user.interface";

export interface IAdministration extends IUser {
  name: string;
  roleType: AdministrationRoleType;
  permissions: string[];
  // TODO: for the role assignments, filter users on role = unknown and isVerified = false
  // TODO: for the participants in loyalty program, filter on vendors where program != null
}

export type AdministrationRoleType = "admin" | "eventsOffice";

export const ADMIN_PERMISSIONS = [
  "CREATE_ADMIN",
  "DELETE_ADMIN",
  "VERIFY_ROLE",
  "SEND_VERIFICATION",
  "DELETE_COMMENT",
  "BLOCK_USER",
  "VIEW_USERS",
  "MANAGE_PERMISSIONS",
];

export const EVENT_OFFICE_PERMISSIONS = [
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