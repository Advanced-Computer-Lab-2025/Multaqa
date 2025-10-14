"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Collapse,
  IconButton,
  Portal, // Re-introduced Portal for out-of-flow rendering
  Fade,
  SxProps,
  Theme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import type { ChipProps } from "@mui/material";
import { ActionCardProps } from "./types";

/**
 * ActionCard (Pop-Out Simulation)
 *
 * This version uses a Portal to render the expanded card out of the DOM flow,
 * preventing layout shift, while using the original card's position and scale
 * to simulate an in-place pop-out expansion.
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
  const [chevronRotated, setChevronRotated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null); // Ref is back for positioning
  const [cardPosition, setCardPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  // Sync chevron rotation with expanded state when controlled
  React.useEffect(() => {
    if (controlledExpanded !== undefined) {
      setChevronRotated(controlledExpanded);
    }
  }, [controlledExpanded]);

  // *** POSITION CALCULATION LOGIC (FIXED) ***
  useEffect(() => {
    if (isExpanded && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

      // Use the width of the collapsed card for the expanded card's initial width
      const cardWidth = type === "events" ? 300 : rect.width;

      setCardPosition({
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft, // Corrected positioning (rect.left + scrollLeft)
        width: cardWidth,
        height: rect.height,
      });
    }
  }, [isExpanded, type]);
  // *** END POSITION CALCULATION LOGIC ***

  // For chevron rotation to open
  const handleExpandClick = () => {
    const newExpanded = !isExpanded;

    // Immediately rotate chevron
    setChevronRotated(newExpanded);

    if (newExpanded) {
      // Expanding with delay to show chevron rotation
      setTimeout(() => {
        if (controlledExpanded === undefined) {
          setInternalExpanded(newExpanded);
        }
        onExpandChange?.(newExpanded);
      }, 500); // 0.5s delay
    } else {
      // Collapsing with delay to show chevron rotation
      setTimeout(() => {
        if (controlledExpanded === undefined) {
          setInternalExpanded(newExpanded);
        }
        onExpandChange?.(newExpanded);
      }, 500); // 0.5s delay
    }
  };

  // For chevron rotation to close
  const handleOverlayClick = () => {
    const newExpanded = false;
    // Immediately rotate chevron back
    setChevronRotated(false);
    // Collapsing with delay to show chevron rotation
    setTimeout(() => {
      if (controlledExpanded === undefined) {
        setInternalExpanded(newExpanded);
      }
      onExpandChange?.(newExpanded);
    }, 200); // 0.2s delay
  };

  // Styles are now only for the COLLAPSED state
  const getConditionalStyles = (type: string | undefined) => {
    const baseStyles = {
      height: "auto" as const,
      minHeight: 280, // minHeight property is only for the collapsed card
      maxHeight: 280,
      transition: "all 0.3s ease-in-out",
      position: "relative" as const,
      zIndex: "auto" as const,
      transform: "scale(1)",
    };

    const eventStyles = {
      ...baseStyles,
      width: 300,
      maxWidth: 300,
      minWidth: 300,
      "&:hover": {
        transform: "scale(1.02)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        zIndex: 5,
      },
    };

    const vendorStyles = {
      ...baseStyles,
      minHeight: 150,
      maxHeight: 260,
      width: "100%",
      "&:hover": {
        transform: "scale(1.02)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        zIndex: 5,
      },
    };

    if (type && type.trim() === "events") {
      return eventStyles;
    } else if (type && type.trim() === "vendor") {
      return vendorStyles;
    }
    return baseStyles;
  };

  const currentType = getConditionalStyles(type);
  const boxShadow =
    elevation === "none"
      ? "none"
      : elevation === "strong"
      ? "-8px -8px 16px 0 #FAFBFF, 8px 8px 16px 0 rgba(22, 27, 29, 0.18)"
      : "-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.12)";

  // Render the card content (Used for BOTH collapsed view and the expanded modal content)
  const renderCardContent = ({
    isModal = false,
    extraStyles = {},
  }: {
    isModal?: boolean;
    extraStyles?: SxProps<Theme>;
  }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        // Modal uses a solid white background, collapsed uses the prop background
        background: isModal ? "#ffffff" : background,
        border: borderColor
          ? `1px solid ${borderColor}`
          : "1px solid rgba(0,0,0,0.06)",
        boxShadow: isModal ? "0 8px 32px rgba(0,0,0,0.3)" : boxShadow,
        overflow: "hidden",
        padding: "4px",
        height: "auto",
        ...(!isModal && currentType), // Apply fixed sizing only to the collapsed card
        ...extraStyles,
      }}
    >
      {/* Right Icon */}
      {rightIcon && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
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
          overflowY: isModal ? "auto" : "hidden", // Only scrollable in modal
          overflowX: "hidden",
          p: 2,
          scrollbarGutter: "stable",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.2)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": { background: "rgba(0,0,0,0.3)" },
        }}
      >
        {/* Header content (title, tags, etc.) - same as before */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            ...headerSx,
          }}
        >
          {/* Stack containing title, tags, subtitleNode, metaNodes */}
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            {/* ... (Title, Tags, etc. logic) */}
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
                  maxWidth: isModal
                    ? "100%"
                    : type == "events"
                    ? "250px"
                    : "90%", // Full width in modal
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
          {type === "vendor" && rightSlot}
        </Box>
        {children ? <Box sx={{ mt: 1.5 }}>{children}</Box> : null}

        {/* Expanded Details - Only visible in Modal, or controlled collapse in collapsed state */}
        {(isModal || !isExpanded) && details && (
          <Collapse in={isModal} timeout={300} unmountOnExit={!isModal}>
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
          {/* Icon Button */}
          <IconButton
            onClick={handleExpandClick}
            size="small"
            sx={{
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: chevronRotated ? "rotate(180deg)" : "rotate(0deg)",
              color: borderColor || "rgba(0,0,0,0.5)",
              "&:hover": {
                background: borderColor
                  ? `${borderColor}15`
                  : "rgba(0,0,0,0.04)",
                transform: chevronRotated
                  ? "rotate(180deg) scale(1.1)"
                  : "rotate(0deg) scale(1.1)",
              },
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
          {type === "events" && !registered && rightSlot && (
            <Box>{rightSlot}</Box>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* 1. Regular card - only visible when not expanded */}
      <Box ref={cardRef} sx={{ visibility: isExpanded ? "hidden" : "visible" }}>
        {renderCardContent({ isModal: false, extraStyles: sx })}
      </Box>

      {/* 2. Overlay and expanded card - only when expanded */}
      {isExpanded && (
        <Portal>
          {/* Semi-transparent overlay */}
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
              }}
            />
          </Fade>

          {/* Expanded card positioned over the original location and scaled up */}
          <Fade in={isExpanded} timeout={400}>
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: "absolute",
                top: cardPosition.top,
                left: cardPosition.left,
                width: cardPosition.width,
                zIndex: 1301,
                // Scale it up for the "pop-out" effect
                transform: "scale(1.05)",
                transition: "transform 0.4s ease-out",
                // Allow the card content to dictate its new, larger height
                height: "auto",
                maxHeight: "90vh",
                overflow: "hidden",
                // Keep the width of the collapsed card, and the inner content will grow within it
              }}
            >
              {renderCardContent({
                isModal: true,
                // Ensure the expanded content is still the same width as the collapsed card
                extraStyles: {
                  width: cardPosition.width,
                  minWidth: cardPosition.width,
                  maxWidth: cardPosition.width,
                  maxHeight: "90vh",
                },
              })}
            </Box>
          </Fade>
        </Portal>
      )}
    </>
  );
}
