import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { GYM_SESSION_TYPES } from "../../constants/events.constants";

const gymSessionSchema = new Schema({
  trainer: { type: String },
  sessionType: {
    type: String,
    enum: Object.values(GYM_SESSION_TYPES),
    required: true,
  },
  capacity: { type: Number, min: 1, default: 10, required: true },
  duration: { type: Number, min: 1, default: 60, required: true }, 
});

export const GymSession = Event.discriminator("gym_session", gymSessionSchema);
