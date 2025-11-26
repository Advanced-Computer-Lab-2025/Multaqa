import eventBus from "../utils/eventBus";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";
import { NotificationType } from "../constants/user.constants";

export interface Notification {
  userId?: string;
  role?: UserRole[];
  adminRole?: AdministrationRoleType[];
  staffPosition?: StaffPosition[];
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  delivered: boolean;
  createdAt: Date;
}

export class NotificationService {

  static async sendNotification(notification: Notification) {
    // Emit the event based on type if user is online
    switch (notification.type) {
      case "WORKSHOP_REQUEST_SUBMITTED":
        eventBus.emit("notification:workshop:requestSubmitted", notification);
        break;
      case "WORKSHOP_STATUS_CHANGED":
        eventBus.emit("notification:workshop:statusChanged", notification);
        break;
      case "EVENT_NEW":
        eventBus.emit("notification:event:new", notification);
        break;
      case "EVENT_REMINDER":
        eventBus.emit("notification:event:reminder", notification);
        break;
      case "LOYALTY_NEW_PARTNER":
        eventBus.emit("notification:loyalty:newPartner", notification);
        break;
      case "VENDOR_PENDING_REQUEST":
        eventBus.emit("notification:vendor:pendingRequest", notification);
        break;
      default:
        console.warn(`No event bus handler for notification type: ${notification.type}`);
        // Fallback for new generic notifications
        eventBus.emit("notification:new", notification);
    }
  }

  static async markAsRead(userId: string, notificationId: string) {
    const userRepo = new GenericRepository(User);
    const user = await userRepo.findById(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    const notificationIndex = user.notifications?.findIndex((notification) => {
      return (notification._id as any).toString() === notificationId.toString();
    });

    if (notificationIndex === -1 || notificationIndex === undefined) {
      throw new Error("Notification not found");
    }

    console.log("Marking notification as read:", { userId, notificationId });
    user.notifications[notificationIndex].read = true;
    await user.save();

    // Emit read event to inform other tabs(sockets)
    eventBus.emit("notification:read", { userId, notification: user.notifications[notificationIndex] });
    return { userId, notificationId };
  }

  static async sendUndeliveredNotifications(userId: string) {
    const userRepo = new GenericRepository(User);
    const user = await userRepo.findById(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    if (!user.notifications || user.notifications.length === 0) {
      return;
    }

    const undeliveredNotifications = user.notifications.filter((notification) => !notification.delivered);
    for (const notification of undeliveredNotifications) {
      const notificationData: Notification = {
        userId: userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        delivered: notification.delivered,
        createdAt: notification.createdAt
      };
      await NotificationService.sendNotification(notificationData);
      notification.delivered = true;
    }
    await user.save();

    return undeliveredNotifications;
  }

  static async deleteNotification(userId: string, notificationId: string) {
    const userRepo = new GenericRepository(User);
    const user = await userRepo.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    if (!user.notifications || user.notifications.length === 0) {
      throw createError(404, "Notification not found");
    }

    console.log("Deleting notification:", { userId, notificationId });
    user.notifications = user.notifications.filter((notification) => {
      return (notification._id as any).toString() !== notificationId.toString();
    }); 
    await user.save();

    // Emit delete event to inform other tabs(sockets)
    eventBus.emit("notification:delete", { userId, notificationId });
    return { userId, notificationId };
  }

}
