"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import theme from "@/themes/lightTheme";
import ServerErrImg from "../../../../public/assets/images/undraw_co-cancel.svg";
import CustomButton from "../Buttons/CustomButton";

interface ErrorStateProps {
  title?: string;
  description?: string;
  imageAlt?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  width?: number;
  height?: number;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Errr! Something went wrong",
  description = "Something has occurred on our end. Please try again by refreshing.",
  imageAlt = "Server error illustration",
  ctaLabel = "Refresh",
  onCtaClick,
  width = 280,
  height = 210,
}) => {
  const handleDefaultClick = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <Box sx={{ textAlign: "center", py: 8, gridColumn: "1 / -1" }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Image
          src={ServerErrImg}
          alt={imageAlt}
          width={width}
          height={height}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{ color: theme.palette.error.main, mb: 1, fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      <CustomButton
        label={ctaLabel}
        color="primary"
        variant="contained"
        onClick={onCtaClick ?? handleDefaultClick}
      />
    </Box>
  );
};

export default ErrorState;
