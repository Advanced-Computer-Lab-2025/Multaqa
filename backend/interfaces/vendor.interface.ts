import { Document, Schema } from "mongoose";
import { IUser } from "./user.interface";

export interface IVendor extends IUser {
  companyName: string;
  taxCard: string;
  logo: string;
  loyaltyProgram?: {
    discountRate: number;
    promoCode: string;
    termsAndConditions: string;
  };
  requestedEvents: {
    event: string;
    RequestData: any;
    status: string; // or a more specific type if you have one
  }[];
}
