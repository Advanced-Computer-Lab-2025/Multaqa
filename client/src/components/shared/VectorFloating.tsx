"use client";

import { alpha, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { useEffect, useState } from "react";

const floatingStyles = (theme: Theme, isExiting: boolean) => ({
  container: {
    position: "relative" as const,
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gridTemplateRows: "repeat(6, 1fr)",
    gap: 14,
    animation: isExiting
      ? "moveToCenter 0.8s ease-in-out forwards"
      : "fadeInShapes 0.5s ease",
    "@keyframes fadeInShapes": {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    "@keyframes moveToCenter": {
      "0%": { transform: "translateX(0) scale(1)" },
      "100%": { transform: "translateX(-25%) scale(0.8)", opacity: 0 },
    },
  },
  gradient: {
    position: "absolute" as const,
    inset: 0,
    borderRadius: 6,
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.12
    )}, ${alpha(theme.palette.tertiary.main, 0.25)})`,
    filter: "blur(60px)",
    zIndex: 0,
    opacity: 0.6,
    animation: "pulseGradient 5.8s ease-in-out infinite",
    "@keyframes pulseGradient": {
      "0%": { opacity: 0.35, transform: "scale(0.94)" },
      "45%": { opacity: 0.7, transform: "scale(1)" },
      "100%": { opacity: 0.35, transform: "scale(0.94)" },
    },
  },
  shapes: [
    {
      sx: {
        gridColumn: "1 / span 2",
        gridRow: "1 / span 3",
        borderRadius: "999px",
        bgcolor: theme.palette.primary.main,
        animation: "floatSlow 6.5s ease-in-out infinite",
        animationDelay: "0s",
      },
    },
    {
      sx: {
        gridColumn: "3 / span 3",
        gridRow: "1 / span 2",
        borderRadius: 2,
        bgcolor: theme.palette.tertiary.main,
        animation: "floatMed 7.5s ease-in-out infinite",
        animationDelay: "0.6s",
      },
    },
    {
      sx: {
        gridColumn: "6 / span 1",
        gridRow: "1 / span 2",
        borderRadius: "20px",
        bgcolor: theme.palette.tertiary.main,
        animation: "floatFast 5.5s ease-in-out infinite",
        animationDelay: "0.3s",
      },
    },
    {
      sx: {
        gridColumn: "1 / span 2",
        gridRow: "4 / span 2",
        borderRadius: 2,
        bgcolor: theme.palette.tertiary.dark,
        animation: "floatSlow 7.2s ease-in-out infinite",
        animationDelay: "0.9s",
      },
    },
    {
      sx: {
        gridColumn: "3 / span 1",
        gridRow: "4 / span 3",
        bgcolor: theme.palette.tertiary.dark,
        borderRadius: 1,
        animation: "floatFast 6.2s ease-in-out infinite",
        animationDelay: "1.2s",
      },
    },
    {
      sx: {
        gridColumn: "5 / span 2",
        gridRow: "5 / span 2",
        borderRadius: "999px",
        // Reuse the pink accent applied across gym sessions (e.g. SessionTypeDropdown)
        bgcolor: "#e91e63",
        animation: "floatSlow 8.5s ease-in-out infinite",
        animationDelay: "0.5s",
      },
    },
    {
      sx: {
        gridColumn: "2 / span 2",
        gridRow: "3 / span 2",
        bgcolor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "floatFast 6.8s ease-in-out infinite",
        animationDelay: "1s",
        "& > div": {
          width: "80%",
          height: 6,
          bgcolor: theme.palette.common.black,
          borderRadius: 3,
        },
      },
    },
    {
      sx: {
        gridColumn: "2 / span 1",
        gridRow: "6 / span 1",
        width: "70%",
        justifySelf: "center",
        borderRadius: 1,
        bgcolor: theme.palette.tertiary.main,
        animation: "floatMed 7.8s ease-in-out infinite",
        animationDelay: "0.7s",
      },
    },
    {
      sx: {
        gridColumn: "6 / span 1",
        gridRow: "3 / span 3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "floatFast 7s ease-in-out infinite",
        animationDelay: "0.4s",
        "& > div": {
          width: 12,
          height: "100%",
          bgcolor: theme.palette.text.primary,
          borderRadius: 999,
        },
      },
    },
  ],
});

export default function VectorFloating({
  triggerExit = false,
}: {
  triggerExit?: boolean;
}) {
  const theme = useTheme();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (triggerExit) {
      setIsExiting(true);
    }
  }, [triggerExit]);

  const styles = floatingStyles(theme, isExiting);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        opacity: 0.35,
        overflow: "hidden",
        display: "block",
        "@keyframes floatSlow": {
          "0%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "45%": { transform: "translate3d(14px, -18px, 0) scale(1.06)" },
          "80%": { transform: "translate3d(-10px, -6px, 0) scale(0.97)" },
          "100%": { transform: "translate3d(0, 0, 0) scale(1)" },
        },
        "@keyframes floatMed": {
          "0%": { transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)" },
          "35%": {
            transform: "translate3d(-18px, 22px, 0) scale(0.95) rotate(-3deg)",
          },
          "70%": {
            transform: "translate3d(12px, -16px, 0) scale(1.04) rotate(2deg)",
          },
          "100%": { transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)" },
        },
        "@keyframes floatFast": {
          "0%": { transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)" },
          "25%": {
            transform: "translate3d(14px, -16px, 0) scale(1.05) rotate(3deg)",
          },
          "55%": {
            transform: "translate3d(-12px, 10px, 0) scale(0.95) rotate(-2deg)",
          },
          "85%": {
            transform: "translate3d(8px, -12px, 0) scale(1.03) rotate(1deg)",
          },
          "100%": { transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)" },
        },
      }}
    >
      <Box sx={styles.gradient} />
      <Box sx={styles.container}>
        {styles.shapes.map((shape, index) => (
          <Box key={index} sx={shape.sx}>
            {"& > div" in shape.sx && <Box />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
