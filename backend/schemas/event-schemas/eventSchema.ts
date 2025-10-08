import mongoose, { Schema, model } from "mongoose";
import { IEvent } from "../../interfaces/event.interface";
import { EVENT_TYPES } from "../../constants/events.constants";
import "../stakeholder-schemas/userSchema";
import { UserRole } from "../../constants/user.constants";

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
    allowedUsers: [{ type: String, enum: Object.values(UserRole) }],
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

EventSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    // Explicitly ensure attendees is included
    if (doc.attendees !== undefined) {
      ret.attendees = doc.attendees;
    }
    return ret;
  },
});
EventSchema.set("toObject", { virtuals: true });

export const Event = model<IEvent>("Event", EventSchema);
