import { IEvent } from "../models/event.interface";

export interface GetVendorEventsResponse {
  success: boolean;
  data: IEvent[];
  message: string;
}

export interface ApplyToBazaarOrBoothResponse {
  success: boolean;
  applicationResult: any; // You might want to create a specific interface for this
  message: string;
}