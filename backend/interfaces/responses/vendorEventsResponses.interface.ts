import { IApplicationResult } from "../applicationResult.interface";
import { IRequestedEvent } from "../models/vendor.interface";
import { VendorRequest } from "../models/vendor.interface";

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