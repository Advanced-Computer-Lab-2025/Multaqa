import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { Event_Request_Status } from "../../constants/user.constants";
import { IPlatformBooth } from "../../interfaces/models/platformBooth.interface";

const platformBoothSchema = new Schema<IPlatformBooth>({
  vendor: { type: Schema.Types.ObjectId, ref: "vendor", required: true },
  RequestData: {
    type: new Schema(
      {
        boothSetupDuration: { type: Number, min: 1, max: 4 }, // in weeks
        boothLocation: { type: String },
        boothAttendees: [
          {
            name: { type: String },
            email: { type: String },
            nationalId: { type: Schema.Types.Mixed },
          },
        ],
        boothSize: { type: String, enum: ["2x2", "4x4"] },
        status: {
          type: String,
          enum: Object.values(Event_Request_Status),
          default: Event_Request_Status.PENDING,
        },
        QRCodeGenerated: { type: Boolean, default: false },
        hasPaid: { type: Boolean, default: false },
        paymentDeadline: { type: Date },
        participationFee: { type: Number },
      },
      { _id: false }
    ),
    required: true,
  },
});

export const PlatformBooth = Event.discriminator(
  "platform_booth",
  platformBoothSchema
);
