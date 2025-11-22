import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { IEvent } from "../../interfaces/models/event.interface";

const bazaarSchema = new Schema<IEvent>({
  vendors: [
    {
      vendor: { type: Schema.Types.ObjectId, ref: "vendor", required: true },
      RequestData: { type: Schema.Types.Mixed, required: true },
      QRCodeGenerated: { type: Boolean, default: false },
    },
  ]

});

export const Bazaar = Event.discriminator("bazaar", bazaarSchema);
