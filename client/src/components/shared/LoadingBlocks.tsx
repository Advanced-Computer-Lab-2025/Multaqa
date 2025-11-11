"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function LoadingBlocks() {
  const theme = useTheme();

  // Array of 5 blocks with different colors from your theme
  const blocks = [
    { color: theme.palette.primary.main, delay: 0 },
    { color: theme.palette.primary.dark, delay: 0.2 },
    { color: theme.palette.tertiary.main, delay: 0.4 },
    { color: theme.palette.secondary.main, delay: 0.6 },
    { color: theme.palette.tertiary.dark, delay: 0.8 },
  ];

  const blockWidth = 50;
  const gap = 12; // 1.5 * 8 = 12px gap
  const totalDistance = (blockWidth + gap) * 4; // Distance of 4 blocks

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          height: 100,
          width: (blockWidth + gap) * 5,
        }}
      >
        {blocks.map((block, index) => (
          <Box
            key={index}
            sx={{
              width: blockWidth,
              height: blockWidth,
              backgroundColor: block.color,
              borderRadius: 2,
              position: "absolute",
              left: index * (blockWidth + gap),
              animation: `blockQueue 2s ease-in-out ${block.delay}s infinite`,
              "@keyframes blockQueue": {
                "0%": {
                  transform: "translateY(0) translateX(0)",
                },
                "15%": {
                  transform: `translateY(0) translateX(-${blockWidth + gap}px)`,
                },
                "30%": {
                  transform: `translateY(-80px) translateX(-${blockWidth + gap}px)`,
                },
                "50%": {
                  transform: `translateY(-80px) translateX(${totalDistance - (blockWidth + gap)}px)`,
                },
                "65%": {
                  transform: `translateY(0) translateX(${totalDistance - (blockWidth + gap)}px)`,
                },
                "100%": {
                  transform: "translateY(0) translateX(0)",
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
