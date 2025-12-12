import { Schema } from "mongoose";
import { Event } from "./eventSchema";

const tripSchema = new Schema({
  capacity: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  waitlist: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      joinedAt: { type: Date, required: true, default: Date.now },
      status: {
        type: String,
        enum: ["waitlist", "pending_payment"],
        required: true,
        default: "waitlist",
      },
      paymentDeadline: { type: Date },
      notifiedAt: { type: Date },
    },
  ],
});

export const Trip = Event.discriminator("trip", tripSchema);
