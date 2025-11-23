import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IVendor } from "../../interfaces/models/vendor.interface";
import { Event_Request_Status } from "../../constants/user.constants";

const vendorSchema = new Schema<IVendor>(
  {
    companyName: { type: String, required: true },
    taxCard: { type: Schema.Types.Mixed, required: true },
    logo: { type: Schema.Types.Mixed, required: true },
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
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        if (ret.requestedEvents) {
          ret.requestedEvents = ret.requestedEvents.filter((reqEvent: any) => {
            return !reqEvent.event?.archived;
          });
        }
        return ret;
      },
    },
  }
);

export const Vendor = User.discriminator<IVendor>("vendor", vendorSchema);
