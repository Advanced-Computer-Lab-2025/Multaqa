"use client";

import React from "react";
import { Box, Typography, type ButtonProps } from "@mui/material";
import {resolveButtonPalette } from "../utils"
import theme from "@/themes/lightTheme";

export type AccentContainerProps = {
  title: string;
  accent?: ButtonProps["color"];
  children: React.ReactNode;
};

const AccentContainer: React.FC<AccentContainerProps> = ({ title, accent = "primary" as ButtonProps["color"], children }) => {
  return (
    <Box>
      <Box
        sx={{
          paddingBottom:"10px",
          backgroundColor:resolveButtonPalette(theme, accent).light,
          borderRadius: "30px",
          boxShadow: "inset -2px -2px 5px #fffff7, inset 2px 2px 5px rgba(22,27,29,0.2)",
          maxWidth:"500px",
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ padding:"10px 20px 2px 22px", color: resolveButtonPalette(theme, accent).dark,}}>
          {title}
        </Typography>
        <Box sx={{
          backgroundColor: "transparent",
          padding:"2px 10px",
          borderRadius: 3,
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AccentContainer;


