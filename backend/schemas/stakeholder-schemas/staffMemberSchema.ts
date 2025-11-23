import { Schema } from "mongoose";
import { IStaffMember } from "../../interfaces/models/staffMember.interface";
import { User } from "./userSchema";
import { StaffPosition } from "../../constants/staffMember.constants";

const staffMemberSchema = new Schema<IStaffMember>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gucId: { type: String, required: true },
  position: {
    type: String,
    enum: Object.values(StaffPosition),
    default: StaffPosition.UNKNOWN,
  },
  walletBalance: { type: Number, default: 0 },
  transactions: [
    {
      eventName: { type: String, required: true },
      amount: { type: Number, required: true },
      walletAmount: { type: Number, default: 0 },
      cardAmount: { type: Number, default: 0 },
      type: { type: String, enum: ["payment", "refund"], required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  favorites: [{ type: Schema.Types.ObjectId, ref: "Event", default: [] }],
  registeredEvents: [
    { type: Schema.Types.ObjectId, ref: "Event", default: [] },
  ],
  myWorkshops: [{ type: Schema.Types.ObjectId, ref: "Workshop", default: [] }],
});

// Virtual attribute for events that have already started
staffMemberSchema.virtual("attendedEvents").get(function () {
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

export const StaffMember = User.discriminator<IStaffMember>(
  "staffMember",
  staffMemberSchema
);
