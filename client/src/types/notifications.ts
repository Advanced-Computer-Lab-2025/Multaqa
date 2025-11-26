// Import notification types from backend constants
export enum NotificationType {
  WORKSHOP_REQUEST_SUBMITTED = "WORKSHOP_REQUEST_SUBMITTED",
  WORKSHOP_STATUS_CHANGED = "WORKSHOP_STATUS_CHANGED",
  EVENT_NEW = "EVENT_NEW",
  EVENT_REMINDER = "EVENT_REMINDER",
  LOYALTY_NEW_PARTNER = "LOYALTY_NEW_PARTNER",
  VENDOR_PENDING_REQUEST = "VENDOR_PENDING_REQUEST",
}

// Notification interface matching backend structure
export interface INotification {
  _id?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  delivered: boolean;
  createdAt: Date;
}

// Context type for notification provider
export interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAsUnread: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

// Helper type guard to check if notification type is valid
export const isValidNotificationType = (type: string): type is NotificationType => {
  return Object.values(NotificationType).includes(type as NotificationType);
};


