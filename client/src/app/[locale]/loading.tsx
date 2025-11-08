"use client";

import { useState, useEffect } from "react";
import { Box, alpha, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FloatingShape = ({
  delay,
  duration,
  size,
  color,
  borderRadius,
  initialPosition,
  index,
  // disable eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    const animate = () => {
      setPosition({
        x: Math.random() * 70 + 15,
        y: Math.random() * 70 + 15,
      });
    };

    const interval = setInterval(animate, duration);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <Box
      sx={{
        position: "absolute",
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: borderRadius,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${delay}ms`,
        animation: `float-${index} ${duration / 1000}s ease-in-out infinite`,
      }}
    />
  );
};

export default function Loading() {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 180);

    return () => clearInterval(progressInterval);
  }, []);

  const shapes = [
    {
      size: 70,
      color: theme.palette.primary.main,
      borderRadius: "50%",
      delay: 0,
      duration: 4000,
      initialPosition: { x: 20, y: 25 },
    },
    {
      size: 100,
      color: theme.palette.secondary.main,
      borderRadius: "16px",
      delay: 200,
      duration: 4800,
      initialPosition: { x: 75, y: 20 },
    },
    {
      size: 55,
      color: theme.palette.tertiary?.main || theme.palette.primary.light,
      borderRadius: "20px",
      delay: 400,
      duration: 4300,
      initialPosition: { x: 50, y: 50 },
    },
    {
      size: 85,
      color: theme.palette.primary.light,
      borderRadius: "50%",
      delay: 100,
      duration: 5200,
      initialPosition: { x: 80, y: 70 },
    },
    {
      size: 65,
      color: theme.palette.secondary.dark,
      borderRadius: "8px",
      delay: 600,
      duration: 4100,
      initialPosition: { x: 25, y: 75 },
    },
    {
      size: 45,
      color: theme.palette.primary.dark,
      borderRadius: "999px",
      delay: 300,
      duration: 4600,
      initialPosition: { x: 60, y: 35 },
    },
    {
      size: 75,
      color: alpha(theme.palette.secondary.main, 0.7),
      borderRadius: "12px",
      delay: 500,
      duration: 5000,
      initialPosition: { x: 35, y: 55 },
    },
  ];

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at top left, ${alpha(
          theme.palette.primary.main,
          0.15
        )}, transparent 50%), radial-gradient(circle at bottom right, ${alpha(
          theme.palette.secondary.main,
          0.12
        )}, transparent 55%)`,
        backgroundColor: theme.palette.background.default,
        zIndex: 9999,
        opacity: loadingProgress >= 100 ? 0 : 1,
        transition: "opacity 0.5s ease-out",
        overflow: "hidden",
        "@keyframes float-0": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0px) rotate(0deg)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-18px) rotate(4deg)",
          },
        },
        "@keyframes float-1": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0px) rotate(-2deg)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-22px) rotate(3deg)",
          },
        },
        "@keyframes float-2": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0px) rotate(3deg)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-15px) rotate(-4deg)",
          },
        },
        "@keyframes float-3": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0px) rotate(-3deg)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-20px) rotate(5deg)",
          },
        },
        "@keyframes float-4": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0px) rotate(2deg)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-16px) rotate(-2deg)",
          },
        },
        "@keyframes float-5": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0px) rotate(-4deg)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-19px) rotate(4deg)",
          },
        },
        "@keyframes float-6": {
          "0%, 100%": {
            transform: "translate(-50%, -50%) translateY(0px) rotate(1deg)",
          },
          "50%": {
            transform: "translate(-50%, -50%) translateY(-17px) rotate(-3deg)",
          },
        },
        "@keyframes pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        {shapes.map((shape, index) => (
          <FloatingShape key={index} {...shape} index={index} />
        ))}
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CircularProgress
            variant="determinate"
            value={loadingProgress}
            size={80}
            thickness={3}
            sx={{
              color: theme.palette.secondary.main,
              filter: `drop-shadow(0 4px 16px ${alpha(
                theme.palette.secondary.main,
                0.5
              )})`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {Math.round(loadingProgress)}%
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: theme.palette.text.primary,
            textAlign: "center",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          MULTAQA
        </Typography>
      </Box>
    </Box>
  );
}
