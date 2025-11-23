"use client";
import React, { useState } from "react";
import { Typography, Box, Tabs, Tab } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotifications } from "@/context/NotificationContext";
import ManagementScreen from "@/components/admin/shared/ManagementScreen";
import ManagementCard from "@/components/shared/containers/ManagementCard";
import { INotification } from "@/types/notifications";
import {
  formatRelativeTime,
  getNotificationIcon,
  getNotificationColor,
} from "./utils";
import { IconButton, alpha } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function NotificationsPageContent() {
  const { notifications, markAsRead, deleteNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "read") return notification.read;
    return true;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as "all" | "unread" | "read");
  };

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.read && notification._id) {
      markAsRead(notification._id);
    }
  };

  const renderNotificationCard = (notification: INotification) => {
    const Icon = getNotificationIcon(notification.type);
    const color = getNotificationColor(notification.type);

    return (
      <ManagementCard
        key={notification._id}
        name={notification.title}
        email=""
        details={
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                marginBottom: 1,
              }}
            >
              {notification.message}
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
        }
        statusComponent={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: "4px 12px",
              borderRadius: 1,
              backgroundColor: alpha(color, 0.1),
            }}
          >
            <Icon sx={{ fontSize: 18, color }} />
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
        }
        actions={
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (notification._id) {
                deleteNotification(notification._id);
              }
            }}
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
        }
        hoverBorderColor={color}
        hoverBoxShadow={`0 2px 8px ${alpha(color, 0.2)}`}
        onClick={() => handleNotificationClick(notification)}
        sx={{
          cursor: notification.read ? "default" : "pointer",
          backgroundColor: notification.read ? "transparent" : alpha(color, 0.02),
        }}
      />
    );
  };

  return (
    <Box>
      {/* Tabs for filtering */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
            },
            "& .Mui-selected": {
              color: "#6299d0 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#6299d0",
            },
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Unread" value="unread" />
          <Tab label="Read" value="read" />
        </Tabs>
      </Box>

      <ManagementScreen
        pageTitle="Notifications"
        pageSubtitle="View and manage all your notifications"
        boxTitle={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications`}
        boxSubtitle={`You have ${filteredNotifications.length} ${activeTab === "all" ? "" : activeTab} notification${filteredNotifications.length !== 1 ? "s" : ""}`}
        boxIcon={<NotificationsIcon fontSize="small" />}
        borderColor="#6299d0"
        items={filteredNotifications}
        renderItem={renderNotificationCard}
        noItemsMessage={
          activeTab === "all"
            ? "No Notifications"
            : activeTab === "unread"
            ? "No Unread Notifications"
            : "No Read Notifications"
        }
        noItemsSubtitle={
          activeTab === "all"
            ? "You don't have any notifications yet."
            : activeTab === "unread"
            ? "You're all caught up! No unread notifications."
            : "You haven't read any notifications yet."
        }
      />
    </Box>
  );
}

