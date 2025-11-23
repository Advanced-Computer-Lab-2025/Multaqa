import { Schema, model } from "mongoose";
import { IUser } from "../../interfaces/models/user.interface";
import { UserRole } from "../../constants/user.constants";
import { UserStatus } from "../../constants/user.constants";

// Base schema (all users share these fields)
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
    },
    notifications: [{
      type: { type: String, required: true },
      title: { type: String, required: true },
      message: { type: String, required: true },
      read: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }],
    isVerified: { type: Boolean, default: false },
    registeredAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "role", collection: "users" }
);

export const User = model<IUser>("User", userSchema);
