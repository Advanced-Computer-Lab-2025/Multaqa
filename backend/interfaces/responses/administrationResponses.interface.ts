import { IAdministration } from "../models/administration.interface";
import { IStaffMember } from "../models/staffMember.interface";

export interface CreateAdminResponse {
  success: boolean;
  message: string;
  user: Omit<IAdministration, "password">;
}

export interface DeleteAdminResponse {
  success: boolean;
  message: string;
}

export interface GetAllAdminsResponse {
  success: boolean;
  data: Partial<IAdministration>[];  // // Each item may include some or all of these attributes: name, email, roleType, status, registeredAt, isVerified.
}
