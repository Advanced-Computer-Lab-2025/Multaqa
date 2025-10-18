import { IUser } from "./user.interface";
import { Event_Request_Status } from "../../constants/user.constants";

export interface IRequestedEvent {
  event: string;
  RequestData: any;
  status: Event_Request_Status;
}

export interface VendorRequest {
  vendor: Partial<IVendor>;
  RequestData: {
    data: any;
    status: Event_Request_Status;
  };
}

export interface IVendor extends IUser {
  companyName: string;
  // taxCard: string;
  // logo: string;
  loyaltyProgram?: {
    discountRate: number;
    promoCode: string;
    termsAndConditions: string;
  };
  requestedEvents: IRequestedEvent[];
}
