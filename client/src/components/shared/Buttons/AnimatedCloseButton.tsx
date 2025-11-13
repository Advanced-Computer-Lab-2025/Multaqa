"use client";

import { alpha, Box, IconButton } from "@mui/material";
import type { Theme, SxProps } from "@mui/material/styles";

interface AnimatedCloseButtonProps {
  open: boolean;
  onClick: () => void;
  sx?: SxProps<Theme>;
  ariaLabel?: string;
}

/**
 * AnimatedCloseButton Component
 * 
 * A reusable button with animated hamburger to X transition.
 * Perfect for menu toggles and modal close buttons.
 * 
 * @param open - Controls the animation state (false = hamburger, true = X)
 * @param onClick - Handler called when button is clicked
 * @param sx - Additional MUI sx styles to override defaults
 * @param ariaLabel - Accessibility label (defaults based on open state)
 */
export default function AnimatedCloseButton({
  open,
  onClick,
  sx,
  ariaLabel,
}: AnimatedCloseButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={ariaLabel ?? (open ? "Close menu" : "Open menu")}
      sx={[
        (theme) => ({
          borderRadius: 12,
          backgroundColor: alpha(theme.palette.common.white, 0.65),
          boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.12)}`,
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.82),
          },
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        sx={{
          position: "relative",
          width: 20,
          height: 14,
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            component="span"
            sx={(theme) => ({
              position: "absolute",
              left: 0,
              width: "100%",
              height: 2,
              borderRadius: 1,
              backgroundColor: theme.palette.text.primary,
              transition: "transform 0.52s ease, opacity 0.52s ease",
              transformOrigin: "center",
              top: index === 0 ? 0 : index === 1 ? "50%" : "100%",
              transform: open
                ? index === 0
                  ? "translateY(8px) rotate(45deg)"
                  : index === 1
                  ? "scaleX(0)"
                  : "translateY(-6px) rotate(-45deg)"
                : "translateY(0) rotate(0)",
              opacity: open && index === 1 ? 0 : 1,
            })}
          />
        ))}
      </Box>
    </IconButton>
  );
}
