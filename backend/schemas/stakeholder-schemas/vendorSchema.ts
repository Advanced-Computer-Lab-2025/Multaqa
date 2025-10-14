import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IVendor } from "../../interfaces/models/vendor.interface";
import { Event_Request_Status } from "../../constants/user.constants";

const vendorSchema = new Schema<IVendor>({
  companyName: { type: String, required: true },
  taxCard: { type: String, required: true },
  logo: { type: String, required: true },
  loyaltyProgram: {
    discountRate: Number,
    promoCode: String,
    termsAndConditions: String,
  },
  requestedEvents: [
    {
      event: { type: Schema.Types.ObjectId, ref: "Event", required: true }, // the id to populate
      status: {
        type: String,
        required: true,
        enum: Object.values(Event_Request_Status),
        default: Event_Request_Status.PENDING,
      },
    },
  ],
});

export const Vendor = User.discriminator<IVendor>("vendor", vendorSchema);
