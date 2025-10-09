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
  requestedEvents: string[];
}
