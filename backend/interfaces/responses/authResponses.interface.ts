import { IUser } from "../models/user.interface";
export type UserResponse = Omit<IUser, "password">;

export interface SignupResponse {
  success: boolean;
  message: string;
  user: UserResponse;
  verificationtoken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserResponse;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface MeResponse {
  user: UserResponse;
  message: string;
}
