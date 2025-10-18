import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Box, SxProps, Theme } from "@mui/material";

interface StatusChipProps {
  status?: string;
  sx?: SxProps<Theme>;
}

const StatusChip: React.FC<StatusChipProps> = ({ status = "Live", sx }) => {
  const isBlocked = status === "Blocked";
  const isActive = status === "Active";

  const defaultStyles = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
    ...(isBlocked && {
      backgroundColor: "#ffebee",
      color: "#d32f2f",
      border: "1px solid #d32f2f",
    }),
    ...(isActive && {
      backgroundColor: "#e8f5e8",
      color: "#2e7d32",
      border: "1px solid #2e7d32",
    }),
    ...(!isBlocked &&
      !isActive && {
        backgroundColor: "#e8f5e8",
        color: "#2e7d32",
        border: "1px solid #2e7d32",
      }),
  };

  return (
    <Box sx={{ ...defaultStyles, ...sx }}>
      {isBlocked ? <XCircle size={14} /> : <CheckCircle size={14} />}
      {status}
    </Box>
  );
};

export default StatusChip;
