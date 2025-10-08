import { Document } from "mongoose";
import { IUser } from "./user.interface";
import { AdministrationRoleType } from "../constants/administration.constants";

export interface IAdministration extends IUser {
  name: string;
  roleType: AdministrationRoleType;
  permissions: string[];
  // TODO: for the role assignments, filter users on role = unknown and isVerified = false
  // TODO: for the participants in loyalty program, filter on vendors where program != null
}