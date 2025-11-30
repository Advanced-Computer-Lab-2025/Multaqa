"use client";
import React, { useState, useRef, useEffect } from "react";
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
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Delay collapse to allow animation to play
    collapseTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  if (createButtonStyle) {
    return (
      <StyledButton
        {...props}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          width: isExpanded ? "auto" : "48px",
          height: height || "48px",
          minWidth: "48px",
          padding: isExpanded ? "0 16px 0 12px" : "0 0 0 9px",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          ...sx,
        }}
        loadingPosition="start"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          <AddIcon
            sx={{
              fontSize: "24px",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              flexShrink: 0,
            }}
          />
          <Box
            sx={{
              maxWidth: isExpanded ? "200px" : "0px",
              opacity: isExpanded ? 1 : 0,
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              overflow: "hidden",
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
