import { IEvent } from "../models/event.interface";
import { IStaffMember } from "../models/staffMember.interface";
import { IUser } from "../models/user.interface";

export interface GetAllUsersResponse {
  success: boolean;
  data: Omit<IUser, 'password'>[];
  message?: string;
}

export interface GetUserByIdResponse {
  success: boolean;
  data: Omit<IUser, 'password'>;
  message?: string;
}

export interface BlockUserResponse {
  success: boolean;
  message: string;
}

export interface UnblockUserResponse {
  success: boolean;
  message: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  data: IEvent;
}

export interface AssignRoleResponse {
  success: boolean;
  message: string;
  user: Omit<IStaffMember, "password">;
  verificationToken: string;
}

export interface GetAllUnAssignedStaffMembersResponse {
  success: boolean;
  data: Omit<IStaffMember, "password">[];
  message: string;
}

export interface GetAllTAsResponse {
  success: boolean;
  data: Omit<IStaffMember, "password">[];
  message: string;
}

export interface GetAllProfessorsResponse {
  success: boolean;
  data: Omit<IStaffMember, "password">[];
  message: string;
}

export interface GetAllStaffResponse {
  success: boolean;
  data: Omit<IStaffMember, "password">[];
  message: string;
}