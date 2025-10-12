import { IEvent } from "../models/event.interface";
import { VendorRequest } from "../models/vendor.interface";

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

export interface UpdateEventResponse {
  success: boolean;
  data: IEvent;
  message: string;
}

export interface DeleteEventResponse {
  success: boolean;
  data: IEvent;
  message: string;
}

export interface GetVendorsRequestResponse {
  success: boolean;
  data: VendorRequest[];
  message: string;
}


export interface GetVendorRequestDetailsResponse {
  success: boolean;
  data: VendorRequest;
  message: string;
}

export interface RespondToVendorRequestResponse {
  success: boolean;
  message: string;
}

