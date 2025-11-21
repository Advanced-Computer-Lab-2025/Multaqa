import { IUser } from "./user.interface";
import { Event_Request_Status } from "../../constants/user.constants";
import { IFileInfo } from "../fileData.interface";

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
     QRCodeGenerated?: boolean;
  };
 
}

export interface IVendor extends IUser {
  companyName: string;
  taxCard: IFileInfo;
  logo: IFileInfo;
  loyaltyProgram?: {
    discountRate: number;
    promoCode: string;
    termsAndConditions: string;
  };
  requestedEvents: IRequestedEvent[];
}
