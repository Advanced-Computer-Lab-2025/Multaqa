import mongoose, { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { FACULTY } from "../../constants/workshops.constants";
import { FUNDING_SOURCES } from "../../constants/events.constants";
import "../stakeholder-schemas/staffMemberSchema";
import { Event_Request_Status } from "../../constants/user.constants";

const workshopSchema = new Schema({
  fullAgenda: { type: String },
  associatedFaculty: { type: String, enum: Object.values(FACULTY) },
  associatedProfs: [
    {
      type: Schema.Types.ObjectId,
      ref: "staffMember",
      validate: {
        //function to check if the staff member has the role 'professor'
        validator: async function (staffId: string) {
          const Staff = mongoose.model("staffMember");
          const staff = await Staff.findById(staffId);
          console.log("Validator check:", staffId, staff); // 👈 debug line
          return staff && staff.position === "professor";
        },
        message: "Associated staff member must have the role 'professor'.",
      },
    },
  ],
  requiredBudget: { type: Number, min: 0, default: 0 },
  fundingSource: { type: String, enum: Object.values(FUNDING_SOURCES) },
  extraRequiredResources: [{ type: String }],
  capacity: { type: Number, min: 1, default: 10 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true, min: 0 },
  approvalStatus: {
    type: String,
    enum: Object.values(Event_Request_Status),
    default: Event_Request_Status.PENDING,
  },
  comments: {
    type: String,
    default: "",
  },
});

export const Workshop = Event.discriminator("workshop", workshopSchema);
