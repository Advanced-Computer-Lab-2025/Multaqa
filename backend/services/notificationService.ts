import { INotification } from "../interfaces/models/notification.interface";
import { Notification } from "../schemas/misc/notification-schema";
import GenericRepository from "../repos/genericRepo";
import eventBus from "../utils/eventBus";

export class NotificationService {
  private notificationRepo: GenericRepository<INotification>;

  constructor() {
    this.notificationRepo = new GenericRepository(Notification);
  }

  async sendNotification(userId: string, type: string, message: string): Promise<INotification> {
    // 1. Save to MongoDB to persist the notification and send it when user is online again
    const notification = await this.notificationRepo.create({
      userId: userId,
      type,
      message,
      read: false,
      createdAt: new Date(),
    });

    // 2. Emit the event based on type if user is online
    switch (type) {
      case "WORKSHOP_REMINDER":
        eventBus.emit("notification:workshop:reminder", notification);
        break;
      case "NEW_MESSAGE":
        eventBus.emit("notification:message", notification);
        break;
      case "SYSTEM_ALERT":
        eventBus.emit("notification:system:alert", notification);
        break;
      case "FRIEND_REQUEST":
        eventBus.emit("notification:friend:request", notification);
        break;
      case "FRIEND_ACCEPT":
        eventBus.emit("notification:friend:accept", notification);
        break;
      case "ACHIEVEMENT":
        eventBus.emit("notification:achievement", notification);
        break;
      case "PROMOTION":
        eventBus.emit("notification:promotion", notification);
        break;
      default:
        eventBus.emit("notification:new", notification);
    }

    return notification;
  }

  async markAsRead(notificationId: string) {
    const notif = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    eventBus.emit("notification:read", notif); 
    return notif;
  }

}
