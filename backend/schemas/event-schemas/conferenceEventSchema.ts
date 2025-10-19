import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { FUNDING_SOURCES } from "../../constants/events.constants";
import { IConference } from "../../interfaces/models/conference.interface";

const conferenceSchema = new Schema<IConference>({
  fullAgenda: { type: String, required: true },
  websiteLink: { type: String, required: true },
  requiredBudget: { type: Number, min: 0, required: true },
  fundingSource: {
    type: String,
    enum: Object.values(FUNDING_SOURCES),
    required: true,
  },
  extraRequiredResources: [{ type: String }],
});

export const Conference = Event.discriminator("conference", conferenceSchema);
