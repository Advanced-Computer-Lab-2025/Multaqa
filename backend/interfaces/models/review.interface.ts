import { Types } from "mongoose";
import { IUser } from "./user.interface";

export interface IReview {
  reviewer: Types.ObjectId | IUser;
  rating?: number;
  comment?: string;
  createdAt: Date; 
}
