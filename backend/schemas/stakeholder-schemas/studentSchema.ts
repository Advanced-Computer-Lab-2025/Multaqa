import { Schema } from "mongoose";
import { User } from "./userSchema";
import { IStudent } from "../../interfaces/models/student.interface";

const studentSchema = new Schema<IStudent>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gucId: { type: String, required: true },
    walletBalance: { type: Number, default: 0 },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }],
    registeredEvents: [
      { type: Schema.Types.ObjectId, ref: "Event", default: [] },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual attribute for events that have already started
studentSchema.virtual("attendedEvents").get(function () {
  if (!this.registeredEvents || this.registeredEvents.length === 0) {
    return [];
  }

  const now = new Date();

  return this.registeredEvents
    .filter((event: any) => {
      // If not populated, we can't check the date, so skip filtering
      if (!event || !event.eventStartDate) return false;

      const eventStartDate = new Date(event.eventStartDate);

      // If event has a start time, combine date and time
      if (event.eventStartTime) {
        const [hours, minutes] = event.eventStartTime.split(":").map(Number);
        eventStartDate.setHours(hours, minutes, 0, 0);
      } else {
        // If no start time specified, consider event started at beginning of the day
        eventStartDate.setHours(0, 0, 0, 0);
      }

      return eventStartDate <= now;
    })
    .map((event: any) => event._id || event); // Return just the ID
});

export const Student = User.discriminator<IStudent>("student", studentSchema);
