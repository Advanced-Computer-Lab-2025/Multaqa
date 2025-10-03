import { Schema } from "mongoose";
import { User, IUser } from "./userSchema";

export interface IVendor extends IUser {
  companyName: string;
  taxCard: string;
  logo?: string;
  loyaltyProgram?: {
    discountRate: number;
    promoCode: string;
    termsAndConditions: string;
  };
}

const vendorSchema = new Schema<IVendor>({
  companyName: { type: String, required: true },
  taxCard: { type: String, required: true },
  logo: { type: String },
  loyaltyProgram: {
    discountRate: Number,
    promoCode: String,
    termsAndConditions: String,
  },
});

export const Vendor = User.discriminator<IVendor>("vendor", vendorSchema);

