"use client";

import React, { useState } from "react";
import { Box, Stack, Typography, Chip, Collapse, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import type { ChipProps, SxProps, Theme } from "@mui/material";
import { ActionCardProps } from "./types";

/**
 * ActionCard
 * A flexible, neumorphic-leaning card for listing items with a title, tags, optional metadata, and expandable details.
 * 
 * New Features:
 * - Fixed height with scrollable content area
 * - Expand/collapse button at the bottom
 * - Smooth animations for expand/collapse
 * - Word wrapping for title and content (no horizontal overflow)
 */
export default function ActionCard({
  title,
  type="events",
  leftIcon,
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
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleExpandClick = () => {
    const newExpanded = !isExpanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onExpandChange?.(newExpanded);
  };

  const getConditionalStyles = (
    type: string | undefined, // Type can be a string or undefined/null
    isExpanded: boolean
)=> { // 2. Explicitly define the return type as object

    // These are the styles you want to apply ONLY if type is "events"
    const eventStyles = {
        height: isExpanded ? "100%" : "auto",
        minHeight: isExpanded ? 280 : 240,
        maxHeight: isExpanded ? 400 : 280,
        width: "100%",
        transition: "max-height 0.3s ease",
    };

    // These are the styles you want to apply ONLY if type is "events"
    const vendorStyles = {
      height: isExpanded ? "100%" : "auto",
      minHeight: isExpanded ? 280 : 150,
      maxHeight: isExpanded ? 400 : 260,
      width: "100%",
      transition: "all 0.5s ease",
  };

    // Return the eventStyles object if the condition is met, otherwise return an empty object {}
    if (type && type.trim() === "events") {
      return eventStyles;
    }
    else if (type && type.trim() === "vendor") {
      return vendorStyles;
    }
  }
  const currentType = getConditionalStyles(type, isExpanded);
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
        border: borderColor ? `1px solid ${borderColor}` : "1px solid rgba(0,0,0,0.06)",
        boxShadow,
        overflow: "hidden",
        ...currentType,
        ...sx,
      }}
    >
      {/* Scrollable Content Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: 2,
          scrollbarGutter: "stable", // ADD THIS LINE
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
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flexWrap: "wrap" }}>
              {leftIcon ? <Box sx={{ display: "flex", alignItems: "center" }}>{leftIcon}</Box> : null}
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1E1E1E",
                  wordBreak: "break-word",
                }}
              >
                {title}
              </Typography>
              {tags?.map((t, idx) => {
                const { label, size, ...rest } = t as {
                  label: React.ReactNode;
                  size?: ChipProps["size"];
                } & Partial<ChipProps>;
                return <Chip key={idx} size={size ?? "small"} label={label} {...rest} />;
              })}
            </Stack>

            {subtitleNode}

            {metaNodes?.map((node, i) => (
              <React.Fragment key={i}>{node}</React.Fragment>
            ))}
          </Stack>
          {rightSlot}
        </Box>

        {children ? <Box sx={{ mt: 1.5 }}>{children}</Box> : null}

        {/* Expanded Details */}
        <Collapse in={isExpanded} timeout={300} unmountOnExit>
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1.5,
              background: "rgba(98,153,208,0.06)",
              border: borderColor ? `1px dashed ${borderColor}` : "1px dashed rgba(0,0,0,0.08)",
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
            justifyContent: "center",
            py: 0.5,
            background: "rgba(255,255,255,0.8)",
          }}
        >
          <IconButton
            onClick={handleExpandClick}
            size="small"
            sx={{
              transition: "all 0.3s ease",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              color: borderColor || "rgba(0,0,0,0.5)",
              "&:hover": {
                background: borderColor ? `${borderColor}15` : "rgba(0,0,0,0.04)",
              },
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}