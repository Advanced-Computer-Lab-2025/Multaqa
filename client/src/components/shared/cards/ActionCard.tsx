"use client";

import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Collapse,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import type { ChipProps } from "@mui/material";
import { ActionCardProps } from "./types";

/**
 * ActionCard
 * A flexible, neumorphic-leaning card for listing items with a title, tags, optional metadata, and expandable details.
 *
 * New Features:
 * - Smooth scaling animation for expand/collapse (like the reference code)
 * - Inline expansion without overlay
 * - Smooth transitions and hover effects
 */
export default function ActionCard({
  title,
  type = "events",
  registered = true,
  leftIcon,
  rightIcon,
  tags,
  subtitleNode,
  metaNodes,
  rightSlot,
  children,
  expanded: controlledExpanded,
  details,
  sx,
  headerSx,
  detailsSx,
  background = "#ffffffaa",
  borderColor,
  elevation = "soft",
  onExpandChange,
}: ActionCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleExpandClick = () => {
    const newExpanded = !isExpanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onExpandChange?.(newExpanded);
  };

  const getConditionalStyles = (
    type: string | undefined,
    isExpanded: boolean
  ) => {
    // For events type, use scaling approach like the reference code
    const eventStyles = {
      height: "auto" as const,
      minHeight: isExpanded ? 400 : 280,
      maxHeight: isExpanded ? ("none" as const) : 280,
      width: 300,
      maxWidth: 300,
      minWidth: 300,
      transform: isExpanded ? "scale(1.05)" : "scale(1)",
      transition: "all 0.3s ease-in-out",
      zIndex: isExpanded ? 10 : ("auto" as const),
      position: "relative" as const,
      boxShadow: isExpanded ? "0 8px 32px rgba(0,0,0,0.15)" : "none",
    };

    // For vendor type
    const vendorStyles = {
      height: "auto" as const,
      minHeight: isExpanded ? 300 : 150,
      maxHeight: isExpanded ? ("none" as const) : 260,
      width: "100%",
      transform: isExpanded ? "scale(1.02)" : "scale(1)",
      transition: "all 0.3s ease-in-out",
      zIndex: isExpanded ? 10 : ("auto" as const),
      position: "relative" as const,
      boxShadow: isExpanded ? "0 8px 32px rgba(0,0,0,0.15)" : "none",
    };

    if (type && type.trim() === "events") {
      return eventStyles;
    } else if (type && type.trim() === "vendor") {
      return vendorStyles;
    }

    return {};
  };

  const currentType = getConditionalStyles(type, isExpanded) || {};
  const boxShadow =
    elevation === "none"
      ? "none"
      : elevation === "strong"
      ? "-8px -8px 16px 0 #FAFBFF, 8px 8px 16px 0 rgba(22, 27, 29, 0.18)"
      : "-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.12)";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        background,
        border: borderColor
          ? `1px solid ${borderColor}`
          : "1px solid rgba(0,0,0,0.06)",
        boxShadow: isExpanded ? "0 8px 32px rgba(0,0,0,0.15)" : boxShadow,
        overflow: "hidden",
        padding: "4px",
        ...currentType,
        ...sx,
        // Add hover effects like in reference code
        "&:hover": {
          boxShadow: isExpanded
            ? "0 8px 32px rgba(0,0,0,0.15)"
            : "0 4px 20px rgba(0,0,0,0.1)",
          transform: isExpanded ? "scale(1.05)" : "scale(1.02)",
        },
      }}
    >
      {/* Right Icon - Top Right with Flex */}
      {rightIcon && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            pt: 0.5,
            pr: 0.5,
            pointerEvents: "auto",
          }}
        >
          {rightIcon}
        </Box>
      )}

      {/* Scrollable Content Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: 2,
          scrollbarGutter: "stable",
          // Custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.2)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0,0,0,0.3)",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            ...headerSx,
          }}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            <Stack
              direction={type === "events" ? "column" : "row"}
              spacing={1}
              alignItems={type === "events" ? "start" : "center"}
              sx={{ minWidth: 0, flexWrap: "wrap" }}
            >
              {leftIcon ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {leftIcon}
                </Box>
              ) : null}
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1E1E1E",
                  overflow: "hidden",
                  maxWidth: type == "events" ? "250px" : "90%",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </Typography>
              {tags?.map((t, idx) => {
                const { label, size, ...rest } = t as {
                  label: React.ReactNode;
                  size?: ChipProps["size"];
                } & Partial<ChipProps>;
                return (
                  <Chip
                    key={idx}
                    size={size ?? "small"}
                    label={label}
                    {...rest}
                  />
                );
              })}
            </Stack>

            {subtitleNode}

            {metaNodes?.map((node, i) => (
              <React.Fragment key={i}>{node}</React.Fragment>
            ))}
          </Stack>

          {/* Show rightSlot in header only if type is vendor */}
          {type === "vendor" && rightSlot}
        </Box>
        {children ? <Box sx={{ mt: 1.5 }}>{children}</Box> : null}

        {/* Expanded Details - Show when expanded */}
        <Collapse in={isExpanded} timeout={300} unmountOnExit>
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1.5,
              background: "rgba(98,153,208,0.06)",
              border: borderColor
                ? `1px dashed ${borderColor}`
                : "1px dashed rgba(0,0,0,0.08)",
              ...detailsSx,
            }}
          >
            {details}
          </Box>
        </Collapse>
      </Box>

      {/* Expand/Collapse Button - Fixed at Bottom */}
      {details && (
        <Box
          sx={{
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            justifyContent: registered ? "center" : "space-between",
            alignItems: "center",
            py: 1,
            px: 2,
            background: "rgba(255,255,255,0.8)",
          }}
        >
          {/* Expand/Collapse Icon Button */}
          <IconButton
            onClick={handleExpandClick}
            size="small"
            sx={{
              transition: "all 0.3s ease",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              color: borderColor || "rgba(0,0,0,0.5)",
              "&:hover": {
                background: borderColor
                  ? `${borderColor}15`
                  : "rgba(0,0,0,0.04)",
                transform: isExpanded
                  ? "rotate(180deg) scale(1.1)"
                  : "rotate(0deg) scale(1.1)",
              },
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>

          {/* Register/Action Button - Right (show for events type when not registered) */}
          {type === "events" && !registered && rightSlot && (
            <Box>{rightSlot}</Box>
          )}
        </Box>
      )}
    </Box>
  );
}
