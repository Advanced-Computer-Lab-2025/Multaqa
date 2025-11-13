"use client";

import { alpha, Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Theme, SxProps } from "@mui/material/styles";
import NeumorphicBox from "@/components/shared/containers/NeumorphicBox";
import type { CustomBoxProps } from "@/components/shared/containers/types";

interface AnimatedCloseButtonProps {
  open: boolean;
  onClick: () => void;
  sx?: SxProps<Theme>;
  ariaLabel?: string;
  lineColor?: string;
  appearance?: "floating" | "neumorphic";
  neumorphicProps?: Partial<Omit<CustomBoxProps, "children">>;
  variant?: "menu" | "closeOnly";
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
  lineColor,
  appearance = "floating",
  neumorphicProps,
  variant = "menu",
}: AnimatedCloseButtonProps) {
  const theme = useTheme();

  const resolvedAppearance =
    appearance === "neumorphic" || neumorphicProps
      ? "neumorphic"
      : "floating";

  const resolvedLineColor = lineColor ?? theme.palette.text.primary;

  const baseButtonSx: SxProps<Theme> = [(muiTheme) => {
    if (resolvedAppearance === "neumorphic") {
      return {
        borderRadius: "50%",
        width: "100%",
        height: "100%",
        padding: "9px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: resolvedLineColor,
        border: `1px solid ${alpha(resolvedLineColor, 0.75)}`,
        backgroundColor: alpha(muiTheme.palette.common.white, 0.95),
        transition:
          "border-width 0.18s ease-in-out, background-color 0.2s ease, transform 0.2s ease",
        "&:hover": {
          borderWidth: "2px",
          backgroundColor: alpha(resolvedLineColor, 0.08),
        },
        "&:active": {
          transform: "scale(0.96)",
        },
      };
    }

    return {
      borderRadius: 12,
      backgroundColor: alpha(muiTheme.palette.common.white, 0.65),
      boxShadow: `0 8px 20px ${alpha(muiTheme.palette.common.black, 0.12)}`,
      width: 44,
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        backgroundColor: alpha(muiTheme.palette.common.white, 0.82),
      },
    };
  }];

  const closeOnlyLines = [
    {
      key: "close-top",
      open: {
        top: "50%",
        transform: "translateY(-50%) rotate(45deg)",
      },
      closed: {
        top: "25%",
        transform: "translateY(0) rotate(0deg)",
      },
    },
    {
      key: "close-bottom",
      open: {
        top: "50%",
        transform: "translateY(-50%) rotate(-45deg)",
      },
      closed: {
        top: "75%",
        transform: "translateY(0) rotate(0deg)",
      },
    },
  ] as const;

  const menuLines = [
    {
      key: "menu-top",
      top: 0,
      getTransform: (isOpen: boolean) =>
        isOpen
          ? "translateY(8px) rotate(45deg)"
          : "translateY(0) rotate(0)",
    },
    {
      key: "menu-middle",
      top: "50%",
      getTransform: (isOpen: boolean) =>
        isOpen ? "scaleX(0)" : "translateY(0) rotate(0)",
    },
    {
      key: "menu-bottom",
      top: "100%",
      getTransform: (isOpen: boolean) =>
        isOpen
          ? "translateY(-6px) rotate(-45deg)"
          : "translateY(0) rotate(0)",
    },
  ] as const;

  const renderLines = () => {
    if (variant === "closeOnly") {
      return closeOnlyLines.map((line) => (
        <Box
          key={line.key}
          component="span"
          sx={{
            position: "absolute",
            left: 0,
            width: "100%",
            height: 2,
            borderRadius: 1,
            backgroundColor: resolvedLineColor,
            transformOrigin: "center",
            top: open ? line.open.top : line.closed.top,
            transform: open ? line.open.transform : line.closed.transform,
            opacity: open ? 1 : 0,
            transition: `transform 0.45s ease, top 0.45s ease, opacity 0.2s ease${
              open ? "" : " 0.18s"
            }`,
          }}
        />
      ));
    }

    return menuLines.map((line) => (
      <Box
        key={line.key}
        component="span"
        sx={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: 2,
          borderRadius: 1,
          backgroundColor: resolvedLineColor,
          transformOrigin: "center",
          top: line.top,
          transform: line.getTransform(open),
          opacity: open && line.key === "menu-middle" ? 0 : 1,
          transition: "transform 0.52s ease, opacity 0.52s ease",
        }}
      />
    ));
  };

  const button = (
    <IconButton
      onClick={onClick}
      aria-label={ariaLabel ?? (open ? "Close menu" : "Open menu")}
      sx={[
        ...baseButtonSx,
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        sx={{
          position: "relative",
          width: 20,
          height: variant === "closeOnly" ? 20 : 14,
        }}
      >
        {renderLines()}
      </Box>
    </IconButton>
  );

  if (resolvedAppearance !== "neumorphic") {
    return button;
  }

  const {
    containerType = "inwards",
    padding = "2px",
    margin = "0",
    width = "42px",
    height = "42px",
    borderRadius = "50%",
    sx: containerSx,
    ...restContainerProps
  } = neumorphicProps ?? {};

  return (
    <NeumorphicBox
      containerType={containerType}
      padding={padding}
      margin={margin}
      width={width}
      height={height}
      borderRadius={borderRadius}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(containerSx ?? {}),
      }}
      {...restContainerProps}
    >
      {button}
    </NeumorphicBox>
  );
}
