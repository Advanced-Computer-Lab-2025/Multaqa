import eventBus from "../utils/eventBus";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import createError from "http-errors";

export interface Notification {
  userId?: string;
  role?: UserRole[];
  adminRole?: AdministrationRoleType[];
  staffPosition?: StaffPosition[];
  type: string;
  title: string;
  message: string;
  read: boolean;
  delivered: boolean;
  createdAt: Date;
}

export class NotificationService {

  async sendNotification(notification: Notification) {

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
      case "NOTIFICATION_READ":
        eventBus.emit("notification:read", notification);
        break;
      case "NOTIFICATION_DELETE":
        eventBus.emit("notification:delete", notification);
        break;
      case "NOTIFICATION_UPDATE":
        eventBus.emit("notification:update", notification);
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
      throw new Error("User not found");
    }

    const notificationIndex = user.notifications?.findIndex((notification) => {
      return (notification._id as any).toString() === notificationId.toString();
    });
    user.notifications[notificationIndex].read = true;
    await user.save();

    eventBus.emit("notification:read", { userId, notificationId });
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
    undeliveredNotifications.forEach((notification) => {
      eventBus.emit(notification.type, notification);
      notification.delivered = true;
    });
    await user.save();
  }
}
