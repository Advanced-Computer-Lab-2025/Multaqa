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
    reviews: [
      {
        reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, min: 1, max: 5},
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    eventName: { type: String, required: true },
    eventStartDate: { type: Date, required: true },
    eventEndDate: { type: Date, required: true },
    eventStartTime: { type: String, required: true },
    eventEndTime: { type: String, required: true },
    registrationDeadline: { type: Date, required: true },
    location: { type: String, required: true, default: "" },
    description: { type: String, required: true },
    stripeProductId: { type: String },
    stripePriceId: { type: String },
  },
  { discriminatorKey: "type", collection: "events", timestamps: true }
);

EventSchema.virtual("isPassed").get(function (this: IEvent) {
  return new Date() > this.eventEndDate;
});

EventSchema.set("toJSON", {
  transform: function (doc, ret) {
    // Explicitly ensure attendees is included
    if (doc.attendees !== undefined) {
      ret.attendees = doc.attendees;
    }
    const record = ret as unknown as Record<string, unknown>;
    Object.keys(record).forEach((key) => {
      if (record[key] == null) {
        delete record[key];
      }
    });
    return ret;
  },
});

export const Event = model<IEvent>("Event", EventSchema);
