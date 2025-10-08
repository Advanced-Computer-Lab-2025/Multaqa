import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IVendor } from "../../interfaces/vendor.interface";

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

