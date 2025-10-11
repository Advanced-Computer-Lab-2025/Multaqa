import { IEvent } from "../models/event.interface";

export interface CreateWorkshopResponse {
  success: boolean;
  data: IEvent;
  message: string;
}

export interface UpdateWorkshopResponse {
  success: boolean;
  data: IEvent;
  message: string;
}