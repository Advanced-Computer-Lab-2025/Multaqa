"use client";

import React, { useState } from "react";
import { Box, Typography, type ButtonProps, IconButton, Backdrop } from "@mui/material";
import { FullscreenExit, Fullscreen } from "@mui/icons-material";
import {resolveButtonPalette } from "../utils"
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
      <Backdrop
        open={isExpanded}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer - 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
        onClick={() => setIsExpanded(false)}
      />
      <Box sx={{ 
        position: isExpanded ? "fixed" : "relative",
        top: isExpanded ? "50%" : "auto",
        left: isExpanded ? "50%" : "auto",
        transform: isExpanded ? "translate(-50%, -50%)" : "none",
        zIndex: isExpanded ? (theme) => theme.zIndex.drawer : "auto",
      }}>
        <Box
          sx={{
            paddingBottom:"6px",
            backgroundColor:resolveButtonPalette(theme, accent).light,
            borderRadius: "20px",
            maxWidth: isExpanded ? "600px" : "250px",
            width: isExpanded ? "80vw" : "auto",
            height: isExpanded ? "80vh" : "350px",
            transition: "all 0.3s ease",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" fontWeight={700} sx={{ padding:"10px 20px 2px 22px", color: resolveButtonPalette(theme, accent).dark, fontSize:"16px"}}>
              {title}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                mr: 1,
                color: resolveButtonPalette(theme, accent).dark,
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


