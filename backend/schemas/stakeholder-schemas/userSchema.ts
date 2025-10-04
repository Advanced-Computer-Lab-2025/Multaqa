import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";

// Base schema (all users share these fields)
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    role: {
      type: String,
      required: true,
      enum: ["student", "staffMember", "vendor", "administration", "unknown"],
    },
    isVerified: { type: Boolean, default: false },
    notifications: {
      type: [
        {
          title: String,
          message: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [], 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "role", collection: "users" }
);

export const User = model<IUser>("User", userSchema);