import mongoose, { Schema, model } from "mongoose";
import { IEvent } from "../../interfaces/event.interface";
import { EVENT_TYPES } from "../../constants/events.constants";

// Base event schema
const EventSchema = new Schema<IEvent>(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(EVENT_TYPES),
    },
    archived: {
      type: Boolean,
      default: false,
    },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    allowedUsers: [{ type: String, enum: ["student", "ta", "prof"] }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    event_name: { type: String, required: true },
    event_start_date: { type: Date, required: true },
    event_end_date: { type: Date, required: true },
    event_start_time: { type: String, required: true },
    event_end_time: { type: String, required: true },
    registration_deadline: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { discriminatorKey: "type", collection: "events" }
);

EventSchema.virtual("is_passed").get(function (this: IEvent) {
  return new Date() > this.event_end_date;
});

EventSchema.set("toJSON", { virtuals: true });
EventSchema.set("toObject", { virtuals: true });

export const Event = model<IEvent>("Event", EventSchema);
