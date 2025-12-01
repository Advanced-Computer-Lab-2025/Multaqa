"use client";
import React, { useState } from "react";
import { Typography, Box, Stack, Pagination } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotifications } from "@/context/NotificationContext";
import NotificationItem from "./NotificationItem";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";

const ITEMS_PER_PAGE = 10;

export default function NotificationsPageContent() {
  const { notifications, markAsRead, markAsUnread, deleteNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "read") return notification.read;
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as "all" | "unread" | "read");
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ContentWrapper
      title="Notifications"
      description="View and manage all your notifications"
      padding={{ xs: 2, md: 3 }}
    >
      {/* Tabs for filtering - COMMENTED OUT FOR SPECIAL PAGE */}
      {/* <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
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
      </Box> */}

      {/* Notifications Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
          {`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications`}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {`Showing ${filteredNotifications.length === 0 ? 0 : startIndex + 1}-${Math.min(endIndex, filteredNotifications.length)} of ${filteredNotifications.length} ${activeTab === "all" ? "" : activeTab} notification${filteredNotifications.length !== 1 ? "s" : ""}`}
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
        <>
          <Stack spacing={2}>
            {paginatedNotifications.map((notification) => (
              <NotificationItem
                key={`${notification._id}-${notification.read}`}
                notification={notification}
                onRead={markAsRead}
                onUnread={markAsUnread}
                onDelete={deleteNotification}
                compact={false}
              />
            ))}
          </Stack>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 2,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#666",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#6299d0 !important",
                    color: "#fff !important",
                  },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "rgba(98, 153, 208, 0.1)",
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </ContentWrapper>
  );
}
