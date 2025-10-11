import { IEvent } from "../models/event.interface";

export interface GetEventsResponse {
  success: boolean;
  data: IEvent[];
  message: string;
}

export interface GetEventByIdResponse {
  success: boolean;
  data: IEvent;
  message: string;
}

export interface CreateEventResponse {
  success: boolean;
  data: IEvent;
  message: string;
}

export interface DeleteEventResponse {
  success: boolean;
  data: IEvent;
  message: string;
}
