import { Schema, model, Document } from "mongoose";

export type UserRole =
  | "student"
  | "staffMember"
  | "vendor"
  | "administration"
  | "unknown";

export interface INotification {
  title: string;
  message: string;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  status: "active" | "blocked";
  role: UserRole;
  createdAt: Date;
  isVerified: boolean;
  notifications: INotification[];
}

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
    notifications: [
      {
        title: String,
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "role", collection: "users" }
);

export const User = model<IUser>("User", userSchema);