"use client";

import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Styled wrapper for MUI TextField with neumorphic design and standard variant
const StyledTextField = styled(TextField)(({ theme }) => ({
  // Neumorphic background container
  backgroundColor: theme.palette.background.default,
  borderRadius: "15px",
  padding: "12px 20px", // Increased padding for more space
  boxShadow: `
    -5px -5px 10px 0 #FAFBFF,
    5px 5px 10px 0 rgba(22, 27, 29, 0.25)
  `,
  transition: "all 0.6s ease-in-out",
  
  "&:hover": {
    boxShadow: `
      -7px -7px 12px 0 #FAFBFF,
      7px 7px 12px 0 rgba(22, 27, 29, 0.3)
    `,
  },
  
  "&:focus-within": {
    boxShadow: `
      inset -2px -2px 5px 0 #FAFBFF,
      inset 2px 2px 5px 0 rgba(22, 27, 29, 0.25)
    `,
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
      color: theme.palette.primary.main, // Icons turn primary color when focused
    },
  },

  // Standard variant styling
  "& .MuiInput-root": {
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
    transition: "all 0.6s ease-in-out",
    "&:before": {
      borderBottomColor: theme.palette.text.secondary, // Minsk secondary color
      borderBottomWidth: "1px",
      transition: "border-bottom-color 0.5s ease-in-out, border-bottom-width 0.5s ease-in-out",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: theme.palette.text.primary, // Darker on hover
      borderBottomWidth: "1px",
    },
    "&:after": {
      borderBottomColor: theme.palette.primary.main, // Minsk primary color #7851da
      borderBottomWidth: "2px",
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "& input": {
      padding: "16px 0 6px 0", // Adjusted bottom padding to align with endAdornment
      fontFamily: "var(--font-poppins), system-ui, sans-serif",
      backgroundColor: "transparent",
      fontSize: "1rem",
    },
  },
  
  "& .MuiInputLabel-root": {
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
    color: theme.palette.text.secondary, // Use Minsk secondary color
    marginLeft: 16,
    marginTop: 4,
    fontSize: "1rem", // Full size like placeholder
    transform: "translate(40px, 24px) scale(1)", // Position aligned with icon (40px offset for icon + margin)
    transformOrigin: "top left",
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s ease-in-out, font-size 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: "none",
    "&.Mui-focused": {
      color: theme.palette.primary.main, // Minsk primary color when focused
      fontSize: "0.75rem", // Smaller when floating
      transform: "translate(0, 0) scale(1)", // Float up when focused, align with container edge, no scale since we use fontSize
    },
    "&.MuiInputLabel-shrink": {
      fontSize: "0.75rem", // Smaller when floating
      transform: "translate(0, 0) scale(1)", // Float up when has content, align with container edge, no scale since we use fontSize
      color: theme.palette.text.secondary, // Keep secondary color when not focused
      "&.Mui-focused": {
        color: theme.palette.primary.main, // Primary color when focused and has content
      },
    },
  },
  
  "& .MuiInputAdornment-root": {
    "& .MuiSvgIcon-root": {
      color: theme.palette.text.secondary, // Use Minsk secondary color
      transition: "color 0.5s ease-in-out",
    },
  },
  
  "& .MuiFormHelperText-root": {
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
    marginTop: "4px",
    marginLeft: 0,
  },
}));

// Wrap with motion for animations
const MotionTextField = motion(StyledTextField) as unknown as React.ComponentType<any>;

import { BaseFieldProps } from '@/types/components/input-fields';

const CustomTextField: React.FC<BaseFieldProps> = ({
  startIcon,
  endIcon,
  isError,
  helperText,
  placeholder,
  size = "medium",
  ...props
}) => {
  return (
    <MotionTextField
      variant="standard"
      error={isError}
      size={size}
      helperText={helperText}
      // Don't pass placeholder prop since label acts as placeholder
      InputProps={{
        startAdornment: startIcon,
        endAdornment: endIcon,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      {...props}
    />
  );
};

export default CustomTextField;