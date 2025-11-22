import React from "react";
import { Chip, Box, SxProps, Theme } from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";

type StatusChipVariant = "wallet" | "default";

interface StatusChipProps {
  // For default variant (used in admin/layout)
  status?: "Active" | "Blocked" | "Live" | string;

  // For wallet variant
  active?: boolean;
  label?: string;

  // Optional variant prop to switch between styles
  variant?: StatusChipVariant;

  sx?: SxProps<Theme>;
}

/**
 * StatusChip - A unified component for displaying status with two variants:
 *
 * 1. Default variant (status prop): Used in admin/layout, shows status with icons
 * 2. Wallet variant (active + label props): Used in wallet, shows circular indicator
 *
 * @example
 * // Default variant
 * <StatusChip status="Active" />
 * <StatusChip status="Blocked" />
 *
 * @example
 * // Wallet variant
 * <StatusChip variant="wallet" active={true} />
 * <StatusChip variant="wallet" active={false} label="Inactive" />
 */
const StatusChip: React.FC<StatusChipProps> = ({
  status = "Live",
  active = true,
  label,
  variant = "default",
  sx,
}) => {
  // Wallet variant styling
  if (variant === "wallet") {
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
  }

  // Default variant styling (admin/layout)
  const isBlocked = status === "Blocked";
  const isActive = status === "Active";

  const defaultStyles: SxProps<Theme> = {
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
    ...sx,
  };

  return (
    <Box sx={defaultStyles}>
      {isBlocked ? <XCircle size={14} /> : <CheckCircle size={14} />}
      {status}
    </Box>
  );
};

export default StatusChip;
