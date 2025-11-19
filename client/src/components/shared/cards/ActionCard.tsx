"use client";

import React, { useState } from "react";
import { Box, Stack, Typography, Chip, Collapse, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import type { ChipProps} from "@mui/material";
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
  registered=true,
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
  disableTitleEllipsis,
  titleMaxLines,
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
)=> { 
// These are the styles you want to apply ONLY if type is "events"
    const eventStyles = {
        height: isExpanded ? "100%" : "auto",
        minHeight: 300,
        maxHeight: isExpanded ? 500 : 350,
        width: "100%",
        transition: "all 0.6s ease-in-out",
    };

    // These are the styles you want to apply ONLY if type is "events"
    const vendorStyles = {
      height: isExpanded ? "100%" : "auto",
      minHeight: isExpanded ? 280 : 150,
      maxHeight: isExpanded ? 400 : 280,
      width: "100%",
      transition: "all 0.6s ease-in-out",
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
        backgroundColor: background || `${borderColor}10`,
        border: "2px solid transparent",
        borderColor: `${borderColor}40`,
        boxShadow: `0 4px 12px ${borderColor}30`,
        overflow: "hidden",
        transition: "all 0.3s ease",
        padding:"12px 12px 4px 4px",
        "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow
                      },
        ...currentType,
        ...sx,
      }}
    >
      {/* Right Icon - Top Right Corner */}
    {rightIcon && (
      <Box
        sx={{
          width:"100%",
          display:"flex",
          alignItems:"end",
          justifyContent:"end",
          flexDirection:"row",
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
        <Stack spacing={1} sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction={type === "events" ? "column" : "row"} spacing={1} alignItems={type === "events" ? "start" : "center"} sx={{ minWidth: 0, flexWrap: "wrap"}}>
            {leftIcon ? <Box sx={{ display: "flex", alignItems: "center" }}>{leftIcon}</Box> : null}
            <Typography
              sx={{
                fontWeight: 700,
                color: "#1E1E1E",
                ...(disableTitleEllipsis
                  ? {
                      whiteSpace: "normal",
                      overflow: "visible",
                      textOverflow: "unset",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      ...(titleMaxLines
                        ? { WebkitLineClamp: titleMaxLines }
                        : {}),
                      maxWidth: "100%",
                      wordBreak: "break-word",
                    }
                  : {
                      overflow: "hidden",
                      maxWidth: type==="events"?"250px":"90%",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }),
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
        
        {/* Show rightSlot in header only if type is vendor */}
        {type === "vendor" && rightSlot}
      </Box>
        {children ? <Box sx={{ mt: 1.5 }}>{children}</Box> : null}

        {/* Expanded Details */}
        <Collapse in={isExpanded} timeout={300} unmountOnExit>
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1.5,
              background: "rgba(255,255,255,0.8)",
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
          justifyContent: !registered? "space-between": "center",
          alignItems: "center",
          py: 1,
          px: 2,
          background: "rgba(255,255,255,0.8)",
        }}
      >
        <Box sx={{ visibility: "hidden", minWidth: "1px" }}>
        {type === "events" && !registered && rightSlot ? <Box>{rightSlot}</Box> : null}
      </Box>
        {/* Expand/Collapse Icon Button */}
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

        {/* Register/Action Button - Right (show for events type when not registered) */}
        {type === "events" && !registered && rightSlot && <Box>{rightSlot}</Box>}
      </Box>
    )}
    </Box>
  );
}