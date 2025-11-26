"use client";
import React from "react";
import {
  Popover,
  Box,
  Typography,
  Divider,
  Button,
  Stack,
  alpha,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";
import NotificationItem from "./NotificationItem";
import { NotificationsNone as NotificationsNoneIcon } from "@mui/icons-material";

interface NotificationDropdownProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export default function NotificationDropdown({
  open,
  anchorEl,
  onClose,
}: NotificationDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { notifications, markAsRead, markAsUnread, deleteNotification, markAllAsRead } =
    useNotifications();

  // Show only notifications from the last 24 hours
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const recentNotifications = notifications.filter((notification) => {
    const notificationDate = new Date(notification.createdAt);
    return notificationDate >= twentyFourHoursAgo;
  });
  
  const hasNotifications = recentNotifications.length > 0;

  // Extract locale and entity from current path (e.g., /en/professor/... -> en, professor)
  const getLocaleAndEntity = () => {
    const segments = pathname?.split("/").filter(Boolean) || [];
    // Path structure: [locale, entity, ...]
    const locale = segments[0] || "en"; // fallback to en if not found
    const entity = segments[1] || "student"; // fallback to student if not found
    return { locale, entity };
  };

  const handleViewAll = () => {
    const { locale, entity } = getLocaleAndEntity();
    router.push(`/${locale}/${entity}/notifications`);
    onClose();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          width: 420,
          maxHeight: 600,
          marginTop: 1,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: 2,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f9fbfc",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            Notifications
          </Typography>
          {hasNotifications && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              sx={{
                fontSize: "0.75rem",
                textTransform: "none",
                color: "#6299d0",
                "&:hover": {
                  backgroundColor: alpha("#6299d0", 0.1),
                },
              }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
      </Box>

      {/* Notifications List */}
      <Box sx={{ maxHeight: 400, overflowY: "auto", padding: 1.5 }}>
        {!hasNotifications ? (
          // Empty state
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              textAlign: "center",
            }}
          >
            <NotificationsNoneIcon
              sx={{ fontSize: 64, color: "#ccc", marginBottom: 2 }}
            />
            <Typography
              variant="body1"
              sx={{ color: "#666", fontWeight: 500, marginBottom: 0.5 }}
            >
              No notifications
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              You're all caught up!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onRead={markAsRead}
                onUnread={markAsUnread}
                onDelete={deleteNotification}
                compact
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* Footer */}
      {hasNotifications && (
        <>
          <Divider />
          <Box
            sx={{
              padding: 1.5,
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#f9fbfc",
            }}
          >
            <Button
              onClick={handleViewAll}
              fullWidth
              sx={{
                textTransform: "none",
                color: "#6299d0",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: alpha("#6299d0", 0.1),
                },
              }}
            >
              View All Notifications
            </Button>
          </Box>
        </>
      )}
    </Popover>
  );
}


