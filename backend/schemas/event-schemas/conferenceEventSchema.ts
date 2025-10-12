import { Schema } from "mongoose";
import { Event } from "./eventSchema";
import { FUNDING_SOURCES } from "../../constants/events.constants";

const conferenceSchema = new Schema({
  keynoteSpeaker: { type: String },
  fullAgenda: { type: String },
  websiteLink: { type: String },
  requiredBudget: { type: Number, min: 0 },
  fundingSource: { type: String, enum: Object.values(FUNDING_SOURCES) },
  extraRequiredResources: [{ type: String }],
  topics: [{ type: String }],
});

export const Conference = Event.discriminator("conference", conferenceSchema);
