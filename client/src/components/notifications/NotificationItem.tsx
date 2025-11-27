"use client";
import React from "react";
import { Box, IconButton, Typography, alpha } from "@mui/material";
import {
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { INotification } from "@/types/notifications";
import {
  formatRelativeTime,
  getNotificationIcon,
  getNotificationColor,
  truncateMessage,
  isNotificationTruncated,
} from "./utils";

interface NotificationItemProps {
  notification: INotification;
  onRead: (notificationId: string) => void;
  onUnread: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
  compact?: boolean;
}

export default function NotificationItem({
  notification,
  onRead,
  onUnread,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const Icon = getNotificationIcon(notification.type);
  const color = getNotificationColor(notification.type);

  // Determine if notification is truncated in compact mode
  const isTruncated = compact && isNotificationTruncated(notification.message, 80);

  // Extract locale and entity from pathname
  const getLocaleAndEntity = () => {
    const segments = pathname?.split("/").filter(Boolean) || [];
    const locale = segments[0] || "en";
    const entity = segments[1] || "student";
    return { locale, entity };
  };

  const handleClick = () => {
    // If truncated in compact mode, navigate to individual notification page
    if (isTruncated && notification._id) {
      const { locale, entity } = getLocaleAndEntity();
      router.push(`/${locale}/${entity}/notifications/${notification._id}`);
      return;
    }

    // Otherwise, just mark as read if unread
    if (!notification.read && notification._id) {
      onRead(notification._id);
    }
  };

  const handleToggleRead = (e: React.MouseEvent) => {
    console.log("🔘 Toggle read button clicked", {
      notificationId: notification._id,
      currentReadStatus: notification.read
    });
    e.stopPropagation();
    if (notification._id) {
      if (notification.read) {
        onUnread(notification._id);
      } else {
        onRead(notification._id);
      }
    } else {
      console.log("⚠️ No notification ID found");
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    console.log("🗑️ Delete button clicked", { notificationId: notification._id });
    e.stopPropagation();
    if (notification._id) {
      onDelete(notification._id);
    } else {
      console.log("⚠️ No notification ID found");
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        padding: compact ? 1.5 : 2,
        borderRadius: 1,
        backgroundColor: notification.read ? "#ffffff" : alpha("#6299d0", 0.12),
        border: `1px solid ${notification.read ? "#e0e0e0" : alpha("#6299d0", 0.35)}`,
        cursor: isTruncated || !notification.read ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: notification.read ? alpha("#6299d0", 0.08) : alpha("#6299d0", 0.1),
          borderColor: alpha("#6299d0", 0.5),
          transform: isTruncated || !notification.read ? "translateX(4px)" : "none",
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          borderRadius: "50%",
          backgroundColor: alpha(color, 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: compact ? 20 : 24, color }} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant={compact ? "body2" : "body1"}
          sx={{
            fontWeight: notification.read ? 400 : 600,
            color: notification.read ? "#666" : "#333",
            marginBottom: 0.5,
          }}
        >
          {notification.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#888",
            fontSize: compact ? "0.75rem" : "0.875rem",
            marginBottom: 0.5,
          }}
        >
          {compact
            ? truncateMessage(notification.message, 80)
            : notification.message}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#999",
            fontSize: "0.75rem",
          }}
        >
          {formatRelativeTime(notification.createdAt)}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
        {/* Read/Unread Toggle */}
        <IconButton
          onClick={handleToggleRead}
          size="small"
          sx={{
            color: notification.read ? "#4caf50" : "#999",
            "&:hover": {
              color: notification.read ? "#45a049" : "#6299d0",
              backgroundColor: notification.read
                ? alpha("#4caf50", 0.1)
                : alpha("#6299d0", 0.1),
            },
          }}
          title={notification.read ? "Mark as unread" : "Mark as read"}
        >
          {notification.read ? (
            <DoneAllIcon fontSize="small" />
          ) : (
            <DoneIcon fontSize="small" />
          )}
        </IconButton>

        {/* Delete Button */}
        <IconButton
          onClick={handleDelete}
          size="small"
          sx={{
            color: "#999",
            "&:hover": {
              color: "#f44336",
              backgroundColor: alpha("#f44336", 0.1),
            },
          }}
          title="Delete notification"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}


