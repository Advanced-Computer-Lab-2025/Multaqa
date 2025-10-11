import { IEvent } from "../models/event.interface";
import { IApplicationResult } from "../applicationResult.interface";
import { IRequestedEvent } from "../models/vendor.interface";

export interface GetVendorEventsResponse {
  success: boolean;
  data: IRequestedEvent[];
  message: string;
}

export interface ApplyToBazaarOrBoothResponse {
  success: boolean;
  data: IApplicationResult; 
  message: string;
}