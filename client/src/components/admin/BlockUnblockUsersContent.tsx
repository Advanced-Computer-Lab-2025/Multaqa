"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CustomButton from "../shared/Buttons/CustomButton";
import StatusChip from "../layout/StatusChip";
import SecurityIcon from "@mui/icons-material/Security";
import ManagementScreen from "./shared/ManagementScreen";
import ManagementCard from "../shared/containers/ManagementCard";
import { User } from "./types";
import { handleToggleBlock } from "./utils";

const initialUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@guc.edu.eg",
    role: "Admin",
    status: "Active",
    createdDate: "15/01/2025",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@guc.edu.eg",
    role: "Event Office",
    status: "Active",
    createdDate: "20/01/2025",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@guc.edu.eg",
    role: "Student",
    status: "Blocked",
    createdDate: "25/01/2025",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@guc.edu.eg",
    role: "Professor",
    status: "Active",
    createdDate: "10/02/2025",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@guc.edu.eg",
    role: "TA",
    status: "Active",
    createdDate: "12/02/2025",
  },
];

export default function BlockUnblockUsersContent() {
  const [users, setUsers] = useState<User[]>(initialUsers);

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
          onClick={() => handleToggleBlock(user.id, setUsers)}
          startIcon={
            user.status === "Active" ? (
              <BlockIcon />
            ) : (
              <CheckCircleOutlineIcon />
            )
          }
          sx={{
            width: "100%",
            maxWidth: "120px",
            color: user.status === "Active" ? "error.main" : "success.main",
            borderColor:
              user.status === "Active"
                ? "rgba(219, 48, 48, 0.5)"
                : "rgba(76, 175, 80, 0.5)",
            "&:hover": {
              backgroundColor:
                user.status === "Active"
                  ? "rgba(219, 48, 48, 0.04)"
                  : "rgba(76, 175, 80, 0.04)",
              borderColor:
                user.status === "Active" ? "error.main" : "success.main",
            },
          }}
        />
      }
      hoverBorderColor={user.status === "Active" ? "#db3030" : "#4caf50"}
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
      borderColor="#db3030"
      items={users}
      renderItem={renderUserCard}
      noItemsMessage="No Users Found"
      noItemsSubtitle="There are no users to display for access control."
    />
  );
}
