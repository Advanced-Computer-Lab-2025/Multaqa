"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Collapse,
  IconButton,
  Portal,
  Fade,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import type { ChipProps } from "@mui/material";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardPosition, setCardPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  // Calculate card position when expanded
  useEffect(() => {
    if (isExpanded && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Use the same width as defined in getConditionalStyles for consistency
      const cardWidth = type === "events" ? 300 : rect.width;

      setCardPosition({
        top: rect.top + scrollTop,
        left: rect.left,
        width: cardWidth,
        height: rect.height,
      });
    }
  }, [isExpanded, type]);

  const handleExpandClick = () => {
    const newExpanded = !isExpanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onExpandChange?.(newExpanded);
  };

  const handleOverlayClick = () => {
    const newExpanded = false;
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onExpandChange?.(newExpanded);
  };

  const getConditionalStyles = (type: string | undefined) => {
    // For events type, maintain fixed dimensions to prevent layout shift
    const eventStyles = {
      height: "auto",
      minHeight: 280,
      maxHeight: 280, // Fixed height to prevent layout shift
      width: 300, // Fixed width to match expanded card
      maxWidth: 300,
      minWidth: 300,
    };

    // For vendor type
    const vendorStyles = {
      height: "auto",
      minHeight: 150,
      maxHeight: 260,
      width: "100%",
    };

    if (type && type.trim() === "events") {
      return eventStyles;
    } else if (type && type.trim() === "vendor") {
      return vendorStyles;
    }
  };
  const currentType = getConditionalStyles(type);
  const boxShadow =
    elevation === "none"
      ? "none"
      : elevation === "strong"
      ? "-8px -8px 16px 0 #FAFBFF, 8px 8px 16px 0 rgba(22, 27, 29, 0.18)"
      : "-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.12)";

  // Render the card content
  const renderCardContent = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        background,
        border: borderColor
          ? `1px solid ${borderColor}`
          : "1px solid rgba(0,0,0,0.06)",
        boxShadow,
        overflow: "hidden",
        padding: "4px",
        ...currentType,
        ...sx,
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

        {/* Expanded Details - Only show in collapsed state */}
        <Collapse in={isExpanded && !isExpanded} timeout={300} unmountOnExit>
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

  return (
    <>
      {/* Regular card - always rendered */}
      <Box ref={cardRef}>{renderCardContent()}</Box>

      {/* Overlay and expanded card - only when expanded */}
      {isExpanded && (
        <Portal>
          {/* Semi-transparent overlay - behind the card */}
          <Fade in={isExpanded} timeout={300}>
            <Box
              onClick={handleOverlayClick}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1300,
                cursor: "pointer",
                overflowY: "auto", // Allow scrolling within the overlay
                minHeight: "100vh", // Ensure overlay covers full viewport height
              }}
            />
          </Fade>

          {/* Expanded card positioned absolutely - above the overlay */}
          <Fade in={isExpanded} timeout={400}>
            <Box
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the card
              sx={{
                position: "absolute",
                top: cardPosition.top,
                left: cardPosition.left,
                width: cardPosition.width,
                zIndex: 1301,
                maxHeight: "80vh",
                overflow: "hidden",
                transform: "translateZ(0)", // Force hardware acceleration for better positioning
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  background: "#ffffff", // Ensure white background for expanded card
                  border: borderColor
                    ? `1px solid ${borderColor}`
                    : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  overflowY: "auto", // Allow vertical scrolling within the expanded card
                  padding: "4px",
                  height: "auto",
                  maxHeight: "80vh",
                  minHeight: 400,
                  width: "100%",
                  maxWidth: type === "events" ? 300 : "100%", // Ensure same max width as collapsed
                  minWidth: type === "events" ? 300 : "auto", // Ensure same min width as collapsed
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

                  {/* Expanded Details - Always visible in overlay */}
                  {details && (
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
                  )}
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
                        transform: "rotate(180deg)", // Always rotated in overlay
                        color: borderColor || "rgba(0,0,0,0.5)",
                        "&:hover": {
                          background: borderColor
                            ? `${borderColor}15`
                            : "rgba(0,0,0,0.04)",
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
            </Box>
          </Fade>
        </Portal>
      )}
    </>
  );
}
