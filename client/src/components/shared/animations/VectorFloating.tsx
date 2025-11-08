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
    )}, ${alpha(theme.palette.secondary.main, 0.25)})`,
    filter: "blur(60px)",
    zIndex: 0,
  },
  shapes: [
    {
      sx: {
        gridColumn: "1 / span 2",
        gridRow: "1 / span 3",
        borderRadius: "999px",
        bgcolor: theme.palette.primary.main,
        animation: "floatSlow 9s ease-in-out infinite",
        animationDelay: "0s",
      },
    },
    {
      sx: {
        gridColumn: "3 / span 3",
        gridRow: "1 / span 2",
        borderRadius: 2,
        bgcolor: theme.palette.secondary.main,
        animation: "floatMed 11s ease-in-out infinite",
        animationDelay: "0.8s",
      },
    },
    {
      sx: {
        gridColumn: "6 / span 1",
        gridRow: "1 / span 2",
        borderRadius: "20px",
        bgcolor: theme.palette.tertiary.main,
        animation: "floatFast 7.5s ease-in-out infinite",
        animationDelay: "0.4s",
      },
    },
    {
      sx: {
        gridColumn: "1 / span 2",
        gridRow: "4 / span 2",
        borderRadius: 2,
        bgcolor: theme.palette.tertiary.dark,
        animation: "floatSlow 10s ease-in-out infinite",
        animationDelay: "1.1s",
      },
    },
    {
      sx: {
        gridColumn: "4 / span 2",
        gridRow: "3 / span 3",
        borderRadius: "50%",
        bgcolor: theme.palette.primary.light,
        animation: "floatMed 12s ease-in-out infinite",
        animationDelay: "0.2s",
      },
    },
    {
      sx: {
        gridColumn: "3 / span 1",
        gridRow: "4 / span 3",
        bgcolor: theme.palette.secondary.dark,
        borderRadius: 1,
        animation: "floatFast 8.5s ease-in-out infinite",
        animationDelay: "1.6s",
      },
    },
    {
      sx: {
        gridColumn: "5 / span 2",
        gridRow: "5 / span 2",
        borderRadius: "999px",
        bgcolor: theme.palette.primary.dark,
        animation: "floatSlow 13s ease-in-out infinite",
        animationDelay: "0.6s",
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
        animation: "floatFast 9.5s ease-in-out infinite",
        animationDelay: "1.3s",
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
        bgcolor: theme.palette.secondary.main,
        animation: "floatMed 11.5s ease-in-out infinite",
        animationDelay: "0.9s",
      },
    },
    {
      sx: {
        gridColumn: "6 / span 1",
        gridRow: "3 / span 3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "floatFast 10.5s ease-in-out infinite",
        animationDelay: "0.5s",
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
        overflow: "hidden",
        display: "block",
        minWidth: { xs: "280px", sm: "360px", md: "480px" },
        minHeight: { xs: "280px", sm: "360px", md: "480px" },
        maxWidth: "600px",
        maxHeight: "600px",
        "@keyframes floatSlow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "@keyframes floatMed": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(12px)" },
        },
        "@keyframes floatFast": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
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
