"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, IconButton, Container, Paper, alpha } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNotifications } from "@/context/NotificationContext";
import {
  formatRelativeTime,
  getNotificationIcon,
  getNotificationColor,
} from "@/components/notifications/utils";
import AnimatedLoading from "@/components/shared/AnimatedLoading";

export default function IndividualNotificationPage() {
  const params = useParams();
  const router = useRouter();
  const { notifications, markAsRead, isLoading } = useNotifications();

  const notificationId = params.id as string;
  const locale = params.locale as string || "en";
  const entity = params.entity as string || "student";

  // Find the notification by ID
  const notification = notifications.find((n) => n._id === notificationId);

  // Auto-mark as read when viewed
  useEffect(() => {
    if (notification && !notification.read && notification._id) {
      markAsRead(notification._id);
    }
  }, [notification, markAsRead]);

  const handleBack = () => {
    router.push(`/${locale}/${entity}/notifications`);
  };

  if (isLoading) {
    return <AnimatedLoading />;
  }

  if (!notification) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 2, color: "#666" }}>
            Notification Not Found
          </Typography>
          <Typography variant="body2" sx={{ color: "#999", mb: 3 }}>
            The notification you're looking for doesn't exist or has been deleted.
          </Typography>
          <IconButton
            onClick={handleBack}
            sx={{
              color: "#6299d0",
              "&:hover": {
                backgroundColor: alpha("#6299d0", 0.1),
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Paper>
      </Container>
    );
  }

  const Icon = getNotificationIcon(notification.type);
  const color = getNotificationColor(notification.type);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            color: "#6299d0",
            backgroundColor: alpha("#6299d0", 0.1),
            "&:hover": {
              backgroundColor: alpha("#6299d0", 0.2),
              transform: "translateX(-4px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Notification Card */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: notification.read ? "#ffffff" : alpha("#6299d0", 0.03),
          border: `1px solid ${notification.read ? "#e0e0e0" : alpha("#6299d0", 0.2)}`,
        }}
      >
        {/* Header with Icon */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: alpha(color, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 32, color }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#333",
                mb: 1,
              }}
            >
              {notification.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#999",
                fontSize: "0.875rem",
              }}
            >
              {formatRelativeTime(notification.createdAt)}
            </Typography>
          </Box>

          {/* Read Status Badge */}
          <Box
            sx={{
              padding: "6px 16px",
              borderRadius: 1,
              backgroundColor: alpha(color, 0.1),
              border: `1px solid ${alpha(color, 0.2)}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color,
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            >
              {notification.read ? "Read" : "Unread"}
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ borderBottom: `1px solid #e0e0e0`, mb: 3 }} />

        {/* Message Content */}
        <Typography
          variant="body1"
          sx={{
            color: "#555",
            lineHeight: 1.8,
            fontSize: "1rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {notification.message}
        </Typography>
      </Paper>
    </Container>
  );
}
