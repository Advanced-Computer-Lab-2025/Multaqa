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
    registeredAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
    updatedAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "role", collection: "users" }
);
userSchema.set("toObject", { virtuals: true });

export const User = model<IUser>("User", userSchema);
