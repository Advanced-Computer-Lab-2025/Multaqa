import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { IEvent } from "../../interfaces/event.interface";

const bazaarSchema = new Schema<IEvent>({
  vendors: [
    {
      vendor: { type: Schema.Types.ObjectId, ref: "vendor", required: true },
      RequestData: { type: Schema.Types.Mixed, required: true },
    },
  ],
});

export const Bazaar = Event.discriminator("bazaar", bazaarSchema);
