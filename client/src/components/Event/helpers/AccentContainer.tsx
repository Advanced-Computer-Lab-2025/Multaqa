"use client";

import React, { useState } from "react";
import { Box, Typography, type ButtonProps, IconButton } from "@mui/material";
import { FullscreenExit, Fullscreen } from "@mui/icons-material";
import {resolveButtonPalette } from "../../utils"
import theme from "@/themes/lightTheme";

export type AccentContainerProps = {
  title: string;
  accent?: ButtonProps["color"];
  children: React.ReactNode;
};

const AccentContainer: React.FC<AccentContainerProps> = ({ title, accent = "primary" as ButtonProps["color"], children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Backdrop blur effect for background elements */}
      {isExpanded && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            transition: "all 0.3s ease",
          }}
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <Box 
        sx={{ 
          position: "relative",
          zIndex: isExpanded ? 1000 : "auto",
          transition: "all 0.3s ease",
        }}
      >
        <Box
          sx={{
            paddingBottom:"6px",
            backgroundColor:resolveButtonPalette(theme, accent).light,
            borderRadius: "20px",
            maxWidth: isExpanded ? "600px" : "250px",
            width: isExpanded ? "400px" : "auto",
            height: isExpanded ? "600px" : "350px",
            transition: "all 0.5s ease",
            boxShadow: isExpanded ? "0 20px 40px rgba(0,0,0,0.3)" : "0 6px 14px rgba(0,0,0,0.15)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" fontWeight={700} sx={{ padding:"8px 20px 2px 22px", color: resolveButtonPalette(theme, accent).dark, fontSize:"16px"}}>
              {title}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                mr: 1,
                mt:0.5,
                color: resolveButtonPalette(theme, accent).dark,
                borderRadius:"11px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              {isExpanded ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
            </IconButton>
          </Box>
          <Box sx={{
            backgroundColor: "transparent",
            padding:"2px 8px",
            borderRadius: 3,
            width:"100%",
            height:"100%",
          }}>
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AccentContainer;