import { INotification } from "../interfaces/models/notification.interface";
import { Notification } from "../schemas/misc/notification-schema";
import GenericRepository from "../repos/genericRepo";
import eventBus from "../utils/eventBus";

export class NotificationService {
  private notificationRepo: GenericRepository<INotification>;

  constructor() {
    this.notificationRepo = new GenericRepository(Notification);
  }

  async sendNotification(notificationData: INotification): Promise<INotification> {
    // 1. Save to MongoDB to persist the notification and send it when user is online again
    const notification = await this.notificationRepo.create({
      userId: notificationData.userId,
      type: notificationData.type,
      message: notificationData.message,
      read: false,
      delivered: false,
      title: notificationData.title,
      role: notificationData.role,
      adminRole: notificationData.adminRole,
      staffPosition: notificationData.staffPosition,
      createdAt: new Date(),
    });

    // Emit the event based on type if user is online
    switch (notificationData.type) {
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
        console.warn(`No event bus handler for notification type: ${notificationData.type}`);
        // Fallback for new generic notifications
        eventBus.emit("notification:new", notification);
    }

    return notification;
  }

  static async markAsRead(notificationId: string) {
    const notif = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    eventBus.emit("notification:read", notif);
    return notif;
  }
}
