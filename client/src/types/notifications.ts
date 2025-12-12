// Import notification types from backend constants
export enum NotificationType {
  WORKSHOP_REQUEST_SUBMITTED = "WORKSHOP_REQUEST_SUBMITTED",
  WORKSHOP_STATUS_CHANGED = "WORKSHOP_STATUS_CHANGED",
  EVENT_NEW = "EVENT_NEW",
  EVENT_REMINDER = "EVENT_REMINDER",
  LOYALTY_NEW_PARTNER = "LOYALTY_NEW_PARTNER",
  VENDOR_PENDING_REQUEST = "VENDOR_PENDING_REQUEST",
  BUG_REPORT_SUBMITTED = "BUG_REPORT_SUBMITTED",
  BUG_RESOLVED = "BUG_RESOLVED",
  COMMENT_FLAGGED = "COMMENT_FLAGGED",
  USHERING_TEAM_UPDATED = "USHERING_TEAM_UPDATED",
  USHERING_TEAM_DELETED = "USHERING_TEAM_DELETED",
  USHERING_SLOT_CANCELLED = "USHERING_SLOT_CANCELLED",
  USHERING_SLOT_BOOKED = "USHERING_SLOT_BOOKED",
  USHERING_SLOTS_ADDED = "USHERING_SLOTS_ADDED",
  USHERING_POST_TIME_UPDATED = "USHERING_POST_TIME_UPDATED",
  USHERING_BROADCAST_ALL = "USHERING_BROADCAST_ALL",
  USHERING_BROADCAST_APPLICANTS = "USHERING_BROADCAST_APPLICANTS",
  USHERING_SLOTS_OPENING = "USHERING_SLOTS_OPENING",
  WAITLIST_PROMOTED = "WAITLIST_PROMOTED",
  WAITLIST_EXPIRED = "WAITLIST_EXPIRED",
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


