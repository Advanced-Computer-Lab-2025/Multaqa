"use client";
import React, { useState } from "react";
import { Typography, Box, Tabs, Tab, Stack } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotifications } from "@/context/NotificationContext";
import NotificationItem from "./NotificationItem";

export default function NotificationsPageContent() {
  const { notifications, markAsRead, markAsUnread, deleteNotification } = useNotifications();
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <NotificationsIcon sx={{ fontSize: 32, color: "#6299d0" }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
            Notifications
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "#666", ml: 6 }}>
          View and manage all your notifications
        </Typography>
      </Box>

      {/* Tabs for filtering */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
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

      {/* Notifications Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
          {`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications`}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {`You have ${filteredNotifications.length} ${activeTab === "all" ? "" : activeTab} notification${filteredNotifications.length !== 1 ? "s" : ""}`}
        </Typography>
      </Box>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 8,
            textAlign: "center",
          }}
        >
          <NotificationsIcon
            sx={{ fontSize: 80, color: "#ccc", marginBottom: 2 }}
          />
          <Typography
            variant="h6"
            sx={{ color: "#666", fontWeight: 500, marginBottom: 0.5 }}
          >
            {activeTab === "all"
              ? "No Notifications"
              : activeTab === "unread"
                ? "No Unread Notifications"
                : "No Read Notifications"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#999" }}>
            {activeTab === "all"
              ? "You don't have any notifications yet."
              : activeTab === "unread"
                ? "You're all caught up! No unread notifications."
                : "You haven't read any notifications yet."}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onRead={markAsRead}
              onUnread={markAsUnread}
              onDelete={deleteNotification}
              compact={false}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
