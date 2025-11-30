"use client";
import React, { useState } from "react";
import { CustomButtonProps } from "./types/index";
import { StyledButton } from "./styles/index";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  width,
  height,
  children,
  className,
  sx,
  createButtonStyle = false,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  if (createButtonStyle) {
    return (
      <StyledButton
        {...props}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          maxWidth: isExpanded ? "300px !important" : "48px !important", // Force override
          width: "auto", // Ensure it can grow
          height: height || "48px",
          minWidth: "48px",
          padding: isExpanded ? "0 16px 0 12px" : "0 0 0 9px",
          transition: "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)", // Increased duration slightly
          overflow: "hidden",
          whiteSpace: "nowrap",
          ...sx,
        }}
        loadingPosition="start"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center content
            gap: 1,
            width: "100%",
          }}
        >
          <AddIcon
            sx={{
              fontSize: "24px",
              transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
              flexShrink: 0,
            }}
          />
          <Box
            sx={{
              maxWidth: isExpanded ? "400px" : "0px",
              opacity: isExpanded ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
              overflow: "hidden",
              whiteSpace: "nowrap", // Prevent wrapping
            }}
          >
            {label || children || "Create"}
          </Box>
        </Box>
      </StyledButton>
    );
  }

  return (
    <StyledButton
      {...props}
      className={className}
      sx={{ width: width, height: height, ...sx }}
      loadingPosition="start"
    >
      {label || children}
    </StyledButton>
  );
};

export default CustomButton;
