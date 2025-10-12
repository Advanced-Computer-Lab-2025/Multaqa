import React from "react";
import { Box, Typography } from "@mui/material";
import { ManagementCardProps } from "./types";

const ManagementCard: React.FC<Omit<ManagementCardProps, "id">> = ({
  name,
  email,
  details,
  statusComponent,
  actions,
  hoverBorderColor,
  hoverBoxShadow,
}) => {
  return (
    <Box
      sx={{
        border: "2px solid #e0e0e0",
        borderRadius: "12px",
        padding: "16px",
        backgroundColor: "#fff",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        "&:hover": {
          borderColor: hoverBorderColor,
          boxShadow: hoverBoxShadow,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
          flexGrow: 1,
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
            {name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: "14px",
              mb: 1,
            }}
          >
            {email}
          </Typography>
          {details}
        </Box>
        {statusComponent}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        {actions}
      </Box>
    </Box>
  );
};

export default ManagementCard;
