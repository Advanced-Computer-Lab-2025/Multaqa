import { IEvent } from "../event.interface";

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
  event: IEvent;
  message: string;
}
