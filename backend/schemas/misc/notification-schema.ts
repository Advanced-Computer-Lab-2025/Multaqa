import mongoose, { Schema } from "mongoose";
import { INotification } from "../../interfaces/models/notification.interface";

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: false },
  role: [{ type: String }],
  adminRole: [{ type: String }],
  staffPosition: [{ type: String }],
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  delivered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);