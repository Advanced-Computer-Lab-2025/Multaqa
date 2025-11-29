import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { IEvent } from "../../interfaces/models/event.interface";
import { Event_Request_Status } from "../../constants/user.constants";

const bazaarSchema = new Schema<IEvent>({
  vendors: [
    {
      vendor: { type: Schema.Types.ObjectId, ref: "vendor", required: true },
      RequestData: {
        type: new Schema(
          {
            bazaarLocation: { type: String },
            bazaarAttendees: [
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
    },
  ],
});

export const Bazaar = Event.discriminator("bazaar", bazaarSchema);
