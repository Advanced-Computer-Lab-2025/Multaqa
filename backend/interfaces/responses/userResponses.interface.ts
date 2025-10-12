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