import React from "react";
import { Chip, Box } from "@mui/material";

interface StatusChipProps {
  active?: boolean;
  label?: string;
  sx?: any;
}

/**
 * StatusChip - A shared component for displaying Active/Blocked status
 * with equal padding on indicator and text
 */
const StatusChip: React.FC<StatusChipProps> = ({
  active = true,
  label,
  sx,
}) => {
  const statusLabel = label || (active ? "Active" : "Blocked");
  const indicatorColor = active ? "#34d399" : "#ef4444";
  const bgColor = active
    ? "rgba(16, 185, 129, 0.2)"
    : "rgba(219, 48, 48, 0.2)";
  const textColor = active ? "#34d399" : "#ef4444";

  return (
    <Chip
      label={statusLabel}
      icon={
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: indicatorColor,
          }}
        />
      }
      sx={{
        bgcolor: bgColor,
        color: textColor,
        fontWeight: 500,
        fontSize: "0.75rem",
        height: 28,
        "& .MuiChip-icon": {
          marginLeft: 1,
          marginRight: 0,
        },
        "& .MuiChip-label": {
          paddingLeft: 1,
          paddingRight: 1,
        },
        ...sx,
      }}
    />
  );
};

export default StatusChip;

