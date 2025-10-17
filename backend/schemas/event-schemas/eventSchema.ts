import mongoose, { Schema, model } from "mongoose";
import { IEvent } from "../../interfaces/models/event.interface";
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
    eventName: { type: String, required: true },
    eventStartDate: { type: Date, required: true },
    eventEndDate: { type: Date, required: true },
    eventStartTime: { type: String, required: true },
    eventEndTime: { type: String, required: true },
    registrationDeadline: { type: Date },
    location: { type: String, required: true, default: "" },
    description: { type: String, required: true },
  },
  { discriminatorKey: "type", collection: "events" }
);

EventSchema.virtual("isPassed").get(function (this: IEvent) {
  return new Date() > this.eventEndDate;
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
