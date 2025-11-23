"use client";
import React from "react";
import { Box, IconButton, Typography, alpha } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { INotification } from "@/types/notifications";
import {
  formatRelativeTime,
  getNotificationIcon,
  getNotificationColor,
  truncateMessage,
} from "./utils";

interface NotificationItemProps {
  notification: INotification;
  onRead: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
  compact?: boolean;
}

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);
  const color = getNotificationColor(notification.type);

  const handleClick = () => {
    if (!notification.read && notification._id) {
      onRead(notification._id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notification._id) {
      onDelete(notification._id);
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
        backgroundColor: notification.read ? "transparent" : alpha(color, 0.05),
        border: `1px solid ${notification.read ? "#e0e0e0" : alpha(color, 0.2)}`,
        cursor: notification.read ? "default" : "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: alpha(color, 0.08),
          borderColor: alpha(color, 0.3),
          transform: "translateX(4px)",
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
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}


