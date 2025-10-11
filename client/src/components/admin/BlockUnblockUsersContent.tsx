"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CustomButton from "../shared/Buttons/CustomButton";
import StatusChip from "../layout/StatusChip";
import SecurityIcon from "@mui/icons-material/Security";
import ManagementScreen from "./shared/ManagementScreen";

type User = {
  id: string;
  name: string;
  email: string;
  role:
    | "Student"
    | "Staff"
    | "TA"
    | "Professor"
    | "Admin"
    | "Event Office"
    | "Vendor";
  status: "Active" | "Blocked";
  createdDate: string;
};

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
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleToggleBlock = (userId: string) => {
    // TODO: API call to update user status
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "Active" ? "Blocked" : "Active",
            }
          : user
      )
    );
  };

  const renderUserCard = (user: User) => (
    <Box
      key={user.id}
      sx={{
        border: "2px solid #e0e0e0",
        borderRadius: "12px",
        padding: "16px",
        backgroundColor: "#fff",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: user.status === "Active" ? "#db3030" : "#4caf50",
          boxShadow:
            user.status === "Active"
              ? "0 2px 8px rgba(219, 48, 48, 0.1)"
              : "0 2px 8px rgba(76, 175, 80, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              fontWeight: 600,
              color: "#1E1E1E",
              fontSize: "16px",
              mb: 0.5,
            }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
            }}
          >
            {user.email}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#9e9e9e",
              fontSize: "12px",
            }}
          >
            {user.role} • Created: {user.createdDate}
          </Typography>
        </Box>
        <StatusChip status={user.status} />
      </Box>

      <CustomButton
        label={user.status === "Active" ? "Block" : "Unblock"}
        variant="outlined"
        onClick={() => handleToggleBlock(user.id)}
        startIcon={
          user.status === "Active" ? <BlockIcon /> : <CheckCircleOutlineIcon />
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
    </Box>
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
