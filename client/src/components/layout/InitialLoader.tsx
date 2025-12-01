"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import VectorFloating from "../shared/VectorFloating";

export default function InitialLoader() {
  const [show, setShow] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Check if we've already shown the loader in this session
    const hasLoaded = sessionStorage.getItem("multaqa_initial_load");
    if (hasLoaded) {
      setShow(false);
    } else {
      sessionStorage.setItem("multaqa_initial_load", "true");

      // Start exit animation after 2.5 seconds
      const timer = setTimeout(() => {
        setExiting(true);
      }, 2500);

      // Remove from DOM after animation completes (e.g. 0.8s for VectorFloating exit + fade)
      const removeTimer = setTimeout(() => {
        setShow(false);
      }, 3300); // 2500 + 800ms

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.8s ease-out", // Match VectorFloating exit duration roughly
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {/* Background Vector */}
      <Box sx={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <VectorFloating triggerExit={exiting} />
      </Box>

      {/* Logo & Text */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          animation: "pulse 2s infinite ease-in-out",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)", opacity: 0.8 },
            "50%": { transform: "scale(1.05)", opacity: 1 },
            "100%": { transform: "scale(1)", opacity: 0.8 },
          },
        }}
      >
        <Image
          src="/assets/images/new-multaqa-logo.png"
          alt="Multaqa Logo"
          width={180}
          height={180}
          style={{ objectFit: "contain" }}
          priority
        />
        <Typography
          variant="h3"
          sx={{
            fontFamily: "var(--font-jost)",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "text.primary",
            textTransform: "uppercase",
          }}
        >
          Multaqa
        </Typography>
      </Box>
    </Box>
  );
}
