import { Schema } from "mongoose";
import { Event } from "./eventSchema";

const tripSchema = new Schema({
  capacity: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
});

export const Trip = Event.discriminator("trip", tripSchema);
