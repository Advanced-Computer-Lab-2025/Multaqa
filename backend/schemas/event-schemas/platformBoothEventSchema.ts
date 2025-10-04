import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { allow } from "joi";

const platformBoothSchema = new Schema({
  boothSetupDuration: { type: Number, min: 1, max: 4 }, // in weeks
  boothSetupLocation: { type: String },
  boothAttendees: [
    {
      name: { type: String },
      email: { type: String },
    },
  ],
  boothSize: { type: String, allowedValues: ["2x2", "4x4"] },
});

export const PlatformBooth = Event.discriminator(
  "platform_booth",
  platformBoothSchema
);
