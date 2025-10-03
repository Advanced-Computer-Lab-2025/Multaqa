import mongoose, { Schema } from "mongoose";
import { IEvent } from "../interfaces/event.interface";

const eventSchema = new Schema<IEvent>({
  type: {
    type: String,
    enum: ["workshop", "bazaar", "platform_booth", "conference", "gym_session"],
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  attendees: [
    {
      type: Schema.Types.Mixed, // Replace with Schema.Types.ObjectId and ref if you have a User model
    },
  ],
  allowedUsers: [
    {
      type: String,
      enum: ["student", "ta", "prof"],
    },
  ],
  event_name: {
    type: String,
    required: true,
  },
  event_start_date: {
    type: Date,
    required: true,
  },
  event_end_date: {
    type: Date,
    required: true,
  },
  event_start_time: {
    type: String,
    required: true,
  },
  event_end_time: {
    type: String,
    required: true,
  },
  registration_deadline: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

eventSchema.virtual("is_passed").get(function (this: IEvent) {
  return new Date() > this.event_end_date;
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

export const Event = mongoose.model<IEvent>("Event", eventSchema, "Events");
