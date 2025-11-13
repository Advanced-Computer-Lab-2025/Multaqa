"use client";

import { useState, useEffect, useRef } from "react";
import { Box, alpha, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { flushSync } from "react-dom";
import VectorFloating from "./animations/VectorFloating";

// Minimum loading display time in milliseconds
const MINIMUM_LOADING_TIME = 3000;

type FloatingShapeProps = {
  delay: number;
  duration: number;
  size: number;
  color: string;
  borderRadius: string | number;
  initialPosition: { x: number; y: number };
  index: number;
};

const FloatingShape = ({
  delay,
  duration,
  size,
  color,
  borderRadius,
  initialPosition,
  index,
}: FloatingShapeProps) => {
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

interface AnimatedLoadingProps {
  showProgress?: boolean;
  inline?: boolean;
}

export default function AnimatedLoading({
  showProgress = false,
  inline = false,
}: AnimatedLoadingProps) {
  const theme = useTheme();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [canFinish, setCanFinish] = useState(false);
  const [startTime] = useState(() => Date.now());
  const progressTimerRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const isFinishingRef = useRef(false);
  const minimumTimeTimerRef = useRef<number | null>(null);

  // Minimum time enforcement
  useEffect(() => {
    if (!showProgress) return;

    // Set timer for minimum display time
    minimumTimeTimerRef.current = window.setTimeout(() => {
      setCanFinish(true);
    }, MINIMUM_LOADING_TIME);

    return () => {
      if (minimumTimeTimerRef.current) {
        clearTimeout(minimumTimeTimerRef.current);
      }
    };
  }, [showProgress]);

  useEffect(() => {
    if (!showProgress) return;

    progressTimerRef.current = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (isFinishingRef.current || prev >= 95) {
          return prev;
        }

        const velocityBoost =
          prev < 40 ? 16 : prev < 70 ? 9 : prev < 90 ? 5 : 2.5;
        const jitter =
          prev < 40 ? Math.random() * 6 : Math.random() * (prev < 70 ? 4 : 2);
        return Math.min(prev + velocityBoost + jitter, 95);
      });
    }, 210);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [showProgress]);

  useEffect(() => {
    if (!showProgress) return;

    progressRef.current = loadingProgress;

    // Only allow finishing if minimum time has passed AND progress is high enough
    if (loadingProgress >= 99.5 && canFinish) {
      isFinishingRef.current = true;
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }
  }, [loadingProgress, showProgress, canFinish]);

  useEffect(() => {
    if (!showProgress) return;

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      if (minimumTimeTimerRef.current) {
        clearTimeout(minimumTimeTimerRef.current);
      }
      // Only complete if minimum time has passed
      const elapsed = Date.now() - startTime;
      if (progressRef.current < 100 && elapsed >= MINIMUM_LOADING_TIME) {
        flushSync(() => {
          isFinishingRef.current = true;
          setLoadingProgress(100);
        });
      }
    };
  }, [showProgress, startTime]);

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
      color: theme.palette.tertiary.main,
      borderRadius: "16px",
      delay: 200,
      duration: 4800,
      initialPosition: { x: 75, y: 20 },
    },
    {
      size: 55,
      color: theme.palette.tertiary.main,
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
      color: theme.palette.tertiary.dark,
      borderRadius: "8px",
      delay: 600,
      duration: 4100,
      initialPosition: { x: 25, y: 75 },
    },
    {
      size: 45,
      color: theme.palette.tertiary.dark,
      borderRadius: "999px",
      delay: 300,
      duration: 4600,
      initialPosition: { x: 60, y: 35 },
    },
  ];

  return (
    <Box
      sx={{
        position: inline ? "relative" : "fixed",
        inset: inline ? "auto" : 0,
        width: inline ? "100%" : "auto",
        height: inline ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: inline
          ? "transparent"
          : `radial-gradient(circle at top left, ${alpha(
              theme.palette.primary.main,
              0.15
            )}, transparent 50%), radial-gradient(circle at bottom right, ${alpha(
              theme.palette.tertiary.main,
              0.12
            )}, transparent 55%)`,
        backgroundColor: inline ? "transparent" : theme.palette.background.default,
        zIndex: inline ? 1 : 9999,
        opacity: showProgress && loadingProgress >= 100 ? 0 : 1,
        transition: "opacity 0.4s ease-out",
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
      {showProgress ? (
        <>
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
                  color: theme.palette.tertiary.main,
                  filter: `drop-shadow(0 4px 16px ${alpha(
                    theme.palette.tertiary.main,
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
                    color: theme.palette.common.white,
                  }}
                >
                  {Math.round(loadingProgress)}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <VectorFloating />
        </Box>
      )}
    </Box>
  );
}


