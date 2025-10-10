  import {LoginRequest} from "../authRequests.interface";
  import {IUser} from "../user.interface"

 export interface LoginResponse {
     success: boolean,
     message: string,
     user: Omit<IUser, 'password'>,
     accessToken: string
  }