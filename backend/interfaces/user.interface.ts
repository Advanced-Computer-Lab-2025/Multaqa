import { Schema } from "mongoose";

export interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  // Add more user fields as needed
}
