"use client";
import React, { useState } from "react";
import { IconButton, Badge } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useNotifications } from "@/context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: "#6299d0",
          backgroundColor: "rgba(98, 153, 208, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(98, 153, 208, 0.2)",
            transform: "scale(1.05)",
          },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: 36,
          height: 36,
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.65rem",
              height: 18,
              minWidth: 18,
              padding: "0 4px",
            },
          }}
        >
          <NotificationsIcon sx={{ fontSize: 20 }} />
        </Badge>
      </IconButton>

      <NotificationDropdown
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
    </>
  );
}


