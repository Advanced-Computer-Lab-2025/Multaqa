import { NotificationType } from "@/types/notifications";
import {
  School,
  Event,
  Notifications,
  CardGiftcard,
  Business,
  CheckCircle,
  HourglassEmpty,
  EventAvailable,
} from "@mui/icons-material";

/**
 * Format a date to a relative time string (e.g., "2 hours ago", "Yesterday")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

/**
 * Format a date to a specific date string (e.g., "Jan 15, 2024")
 */
export const formatSpecificDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Get icon component for a notification type
 */
export const getNotificationIcon = (type: NotificationType): React.ElementType => {
  switch (type) {
    case NotificationType.WORKSHOP_REQUEST_SUBMITTED:
      return School;
    case NotificationType.WORKSHOP_STATUS_CHANGED:
      return CheckCircle;
    case NotificationType.EVENT_NEW:
      return Event;
    case NotificationType.EVENT_REMINDER:
      return Notifications;
    case NotificationType.LOYALTY_NEW_PARTNER:
      return CardGiftcard;
    case NotificationType.VENDOR_PENDING_REQUEST:
      return Business;
    case NotificationType.WAITLIST_PROMOTED:
      return EventAvailable;
    case NotificationType.WAITLIST_EXPIRED:
      return HourglassEmpty;
    default:
      return Notifications;
  }
};

/**
 * Get color for a notification type
 */
export const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.WORKSHOP_REQUEST_SUBMITTED:
      return "#6299d0"; // Primary blue
    case NotificationType.WORKSHOP_STATUS_CHANGED:
      return "#4caf50"; // Success green
    case NotificationType.EVENT_NEW:
      return "#ff9800"; // Orange
    case NotificationType.EVENT_REMINDER:
      return "#f44336"; // Red
    case NotificationType.LOYALTY_NEW_PARTNER:
      return "#9c27b0"; // Purple
    case NotificationType.VENDOR_PENDING_REQUEST:
      return "#2196f3"; // Blue
    case NotificationType.WAITLIST_PROMOTED:
      return "#4caf50"; // Success green
    case NotificationType.WAITLIST_EXPIRED:
      return "#ff9800"; // Warning orange
    default:
      return "#6299d0";
  }
};

/**
 * Truncate notification message
 */
export const truncateMessage = (message: string, maxLength: number = 100): string => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + "...";
};

/**
 * Check if notification message is truncated
 */
export const isNotificationTruncated = (message: string, maxLength: number = 100): boolean => {
  return message.length > maxLength;
};


