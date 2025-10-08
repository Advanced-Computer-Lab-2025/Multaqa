import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { IEvent } from "../../interfaces/event.interface";

const bazaarSchema = new Schema<IEvent>({
  vendors: [{ type: Schema.Types.ObjectId, ref: "vendor" }],
});

export const Bazaar = Event.discriminator("bazaar", bazaarSchema);
