import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { IEvent } from "../../interfaces/event.interface";

const bazaarSchema = new Schema<IEvent>({
  vendors: [{ type: Schema.Types.ObjectId, ref: "vendor" }],
  bazaarAttendees: [
    {
      name: { type: String },
      email: { type: String },
    },
  ],
});

export const Bazaar = Event.discriminator("bazaar", bazaarSchema);
