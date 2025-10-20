"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import theme from "@/themes/lightTheme";
import EmptyStateImg from "../../../../public/assets/images/undraw_co-empty.svg";

interface EmptyStateProps {
  title?: string;
  description?: string;
  imageAlt?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  width?: number;
  height?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nothing to show",
  description = "Try adjusting your search or filters",
  imageAlt = "Empty state illustration",
  ctaLabel,
  onCtaClick,
  width = 360,
  height = 270,
}) => {
  return (
    <Box sx={{ textAlign: "center", py: 8, gridColumn: "1 / -1" }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Image
          src={EmptyStateImg}
          alt={imageAlt}
          width={width}
          height={height}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{ color: theme.palette.tertiary.dark, mb: 1, fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      {ctaLabel && onCtaClick && (
        <Button variant="contained" color="primary" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
