import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { FUNDING_SOURCES } from "../../constants/events.constants";
import { IConference } from "../../interfaces/models/conference.interface";

const conferenceSchema = new Schema<IConference>({
  fullAgenda: { type: String },
  websiteLink: { type: String },
  requiredBudget: { type: Number, min: 0 },
  fundingSource: { type: String, enum: Object.values(FUNDING_SOURCES) },
  extraRequiredResources: [{ type: String }],
});

export const Conference = Event.discriminator("conference", conferenceSchema);
