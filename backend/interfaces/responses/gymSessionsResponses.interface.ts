import { IGymSessionEvent } from "../gymSessionsEvent.interface";

export interface CreateGymSessionResponse {
  success: boolean;
  message: string;
  data: IGymSessionEvent;
}

export interface GetAllGymSessionsResponse {
  success: boolean;
  data: IGymSessionEvent[];
  message?: string;
}