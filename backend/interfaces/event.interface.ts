import { Document } from "mongoose";
import { IUser } from "./user.interface.js";
import { IReview } from "./review.interface.js";
import { EVENT_TYPES } from "../constants/events.constants.js";
import { IVendor } from "./vendor.interface.js";

export interface IEvent extends Document {
  id: string;
  type: EVENT_TYPES;
  archived: boolean;
  attendees: IUser[];
  allowedUsers: EVENT_TYPES[];
  reviews: IReview[];
  event_name: string;
  event_start_date: Date;
  event_end_date: Date;
  event_start_time: string;
  event_end_time: string;
  registration_deadline: Date;
  location: string;
  description: string;
  is_passed: boolean;
  price: number;
  vendors?: IVendor[];
}
