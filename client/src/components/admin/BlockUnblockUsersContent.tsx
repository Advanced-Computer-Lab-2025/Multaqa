"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CustomButton from "../shared/Buttons/CustomButton";
import StatusChip from "../shared/StatusChip";
import SecurityIcon from "@mui/icons-material/Security";
import ManagementScreen from "./shared/ManagementScreen";
import ManagementCard from "../shared/containers/ManagementCard";
import { User } from "./types";
import { handleToggleBlock, fetchAllUsers } from "./utils";
import { useTheme } from "@mui/material/styles";

export default function BlockUnblockUsersContent() {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const renderUserCard = (user: User) => (
    <ManagementCard
      key={user.id}
      name={user.name}
      email={user.email}
      details={
        <Typography
          variant="caption"
          sx={{
            color: "#9e9e9e",
            fontSize: "12px",
          }}
        >
          {user.role} • Created: {user.createdDate}
        </Typography>
      }
      statusComponent={<StatusChip status={user.status} />}
      actions={
        <CustomButton
          label={user.status === "Active" ? "Block" : "Unblock"}
          variant="outlined"
          size="small"
          onClick={async () => {
            try {
              await handleToggleBlock(user.id, user.status, setUsers);
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : "Failed to toggle block status";
              console.error("Error toggling block status:", errorMessage);
              alert(
                `Failed to ${
                  user.status === "Active" ? "block" : "unblock"
                } user: ${errorMessage}`
              );
            }
          }}
          startIcon={
            user.status === "Active" ? (
              <BlockIcon />
            ) : (
              <CheckCircleOutlineIcon />
            )
          }
          color={user.status === "Active" ? "error" : "success"}
          sx={{
            width: "100%",
            maxWidth: "100px !important",
            padding: "4px 12px !important",
            fontSize: "12px !important",
            height: "32px !important",
            minHeight: "32px !important",
            "& .MuiButton-startIcon": {
              marginRight: "4px",
              "& svg": {
                fontSize: "16px",
              },
            },
          }}
        />
      }
      hoverBorderColor={
        user.status === "Active" ? "success.main" : theme.palette.error.main
      }
      hoverBoxShadow={
        user.status === "Active"
          ? "0 2px 8px rgba(219, 48, 48, 0.1)"
          : "0 2px 8px rgba(76, 175, 80, 0.1)"
      }
    />
  );

  return (
    <ManagementScreen
      pageTitle="Block/Unblock Users"
      pageSubtitle="Manage user access by blocking or unblocking their accounts"
      boxTitle="User Access Control"
      boxSubtitle="Restrict or restore user access to the system as needed"
      boxIcon={<SecurityIcon fontSize="small" />}
      borderColor={theme.palette.error.main}
      items={loading ? [] : users}
      renderItem={renderUserCard}
      noItemsMessage={loading ? "Loading users..." : "No Users Found"}
      noItemsSubtitle={
        loading
          ? "Please wait while we fetch the users"
          : "There are no users to display for access control."
      }
    />
  );
}
