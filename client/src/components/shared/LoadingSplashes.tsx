"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import VectorFloating from "@/components/shared/VectorFloating";

const RING_CONFIGS = [
  {
    key: "a",
    radius: 105,
    dashArray: "0 660",
    dashOffset: -330,
    animation: "ringA",
  },
  {
    key: "b",
    radius: 35,
    dashArray: "0 220",
    dashOffset: -110,
    animation: "ringB",
  },
  {
    key: "c",
    radius: 70,
    dashArray: "0 440",
    dashOffset: 0,
    animation: "ringC",
    cx: 85,
  },
  {
    key: "d",
    radius: 70,
    dashArray: "0 440",
    dashOffset: 0,
    animation: "ringD",
    cx: 155,
  },
] as const;

export default function LoadingSplashes() {
  const theme = useTheme();

  const colors = [
    theme.palette.secondary.main,
    "#e91e63",
    theme.palette.primary.main,
    theme.palette.tertiary.main,
  ];

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
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.22,
          pointerEvents: "none",
        }}
      >
        <VectorFloating />
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 240,
          height: 240,
          "@keyframes ringA": {
            "0%, 4%": {
              strokeDasharray: "0 660",
              strokeWidth: 20,
              strokeDashoffset: -330,
            },
            "12%": {
              strokeDasharray: "60 600",
              strokeWidth: 30,
              strokeDashoffset: -335,
            },
            "32%": {
              strokeDasharray: "60 600",
              strokeWidth: 30,
              strokeDashoffset: -595,
            },
            "40%, 54%": {
              strokeDasharray: "0 660",
              strokeWidth: 20,
              strokeDashoffset: -660,
            },
            "62%": {
              strokeDasharray: "60 600",
              strokeWidth: 30,
              strokeDashoffset: -665,
            },
            "82%": {
              strokeDasharray: "60 600",
              strokeWidth: 30,
              strokeDashoffset: -925,
            },
            "90%, 100%": {
              strokeDasharray: "0 660",
              strokeWidth: 20,
              strokeDashoffset: -990,
            },
          },
          "@keyframes ringB": {
            "0%, 12%": {
              strokeDasharray: "0 220",
              strokeWidth: 20,
              strokeDashoffset: -110,
            },
            "20%": {
              strokeDasharray: "20 200",
              strokeWidth: 30,
              strokeDashoffset: -115,
            },
            "40%": {
              strokeDasharray: "20 200",
              strokeWidth: 30,
              strokeDashoffset: -195,
            },
            "48%, 62%": {
              strokeDasharray: "0 220",
              strokeWidth: 20,
              strokeDashoffset: -220,
            },
            "70%": {
              strokeDasharray: "20 200",
              strokeWidth: 30,
              strokeDashoffset: -225,
            },
            "90%": {
              strokeDasharray: "20 200",
              strokeWidth: 30,
              strokeDashoffset: -305,
            },
            "98%, 100%": {
              strokeDasharray: "0 220",
              strokeWidth: 20,
              strokeDashoffset: -330,
            },
          },
          "@keyframes ringC": {
            "0%": {
              strokeDasharray: "0 440",
              strokeWidth: 20,
              strokeDashoffset: 0,
            },
            "8%": {
              strokeDasharray: "40 400",
              strokeWidth: 30,
              strokeDashoffset: -5,
            },
            "28%": {
              strokeDasharray: "40 400",
              strokeWidth: 30,
              strokeDashoffset: -175,
            },
            "36%, 58%": {
              strokeDasharray: "0 440",
              strokeWidth: 20,
              strokeDashoffset: -220,
            },
            "66%": {
              strokeDasharray: "40 400",
              strokeWidth: 30,
              strokeDashoffset: -225,
            },
            "86%": {
              strokeDasharray: "40 400",
              strokeWidth: 30,
              strokeDashoffset: -395,
            },
            "94%, 100%": {
              strokeDasharray: "0 440",
              strokeWidth: 20,
              strokeDashoffset: -440,
            },
          },
          "@keyframes ringD": {
            "0%, 8%": {
              strokeDasharray: "0 440",
              strokeWidth: 20,
              strokeDashoffset: 0,
            },
            "16%": {
              strokeDasharray: "40 400",
              strokeWidth: 30,
              strokeDashoffset: -5,
            },
            "36%": {
              strokeDasharray: "40 400",
              strokeWidth: 30,
              strokeDashoffset: -175,
            },
            "44%, 50%": {
              strokeDasharray: "0 440",
              strokeWidth: 20,
              strokeDashoffset: -220,
            },
            "58%": {
              strokeDasharray: "40 400",
              strokeWidth: 30,
              strokeDashoffset: -225,
            },
            "78%": {
              strokeDasharray: "40 400",
              strokeWidth: 30,
              strokeDashoffset: -395,
            },
            "86%, 100%": {
              strokeDasharray: "0 440",
              strokeWidth: 20,
              strokeDashoffset: -440,
            },
          },
        }}
      >
        <Box
          component="svg"
          width={240}
          height={240}
          viewBox="0 0 240 240"
          role="img"
          aria-label="Loading"
          sx={{ display: "block" }}
        >
          {RING_CONFIGS.map((ring, index) => (
            <Box
              key={ring.key}
              component="circle"
              cx={ring.cx ?? 120}
              cy={120}
              r={ring.radius}
              fill="none"
              stroke={colors[index]}
              strokeWidth={20}
              strokeDasharray={ring.dashArray}
              strokeDashoffset={ring.dashOffset}
              strokeLinecap="round"
              sx={{
                animation: `${ring.animation} 2s linear infinite`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
