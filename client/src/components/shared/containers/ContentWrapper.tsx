"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ContentWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  padding?: { xs?: number; md?: number };
  horizontalPadding?: { xs?: number; md?: number };
  headerMarginBottom?: number;
}

/**
 * ContentWrapper - A reusable container for content pages
 * Provides consistent title and description styling across all content components
 */
export default function ContentWrapper({
  title,
  description,
  children,
  padding = { xs: 2, md: 4 },
  horizontalPadding,
  headerMarginBottom = 4,
}: ContentWrapperProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: padding,
        px: horizontalPadding,
        backgroundColor: "transparent",
        minHeight: "100vh",
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: headerMarginBottom }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontWeight: 700,
            color: theme.palette.tertiary.dark,
            mb: 1,
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{
              color: "#757575",
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Content */}
      {children}
    </Box>
  );
}
