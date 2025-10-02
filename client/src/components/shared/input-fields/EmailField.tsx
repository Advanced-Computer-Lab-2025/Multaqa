"use client";

import React, { useState, useEffect } from "react";
import { Email } from "@mui/icons-material";
import { InputAdornment, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CustomTextField from "./CustomTextField";
import { EmailFieldProps, StakeholderType } from '@/types/components/input-fields';

// Domain mapping based on stakeholder type
const getDomainForStakeholder = (type: StakeholderType): string => {
  switch (type) {
    case "student":
      return "@student.guc.edu.eg";
    case "staff":
    case "ta":
    case "professor":
    case "admin":
    case "events-office":
      return "@guc.edu.eg";
    case "vendor":
      return "@company.com"; // Generic for vendors
    default:
      return "@guc.edu.eg";
  }
};

// Styled domain hint component
const DomainHint = styled(Typography)(({ theme }) => ({
  position: "absolute",
  right: "20px", // Align with right padding of container
  top: "50%",
  transform: "translateY(-50%)",
  color: theme.palette.text.secondary,
  fontSize: "1rem", // Same size as input text
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  pointerEvents: "none",
  opacity: 0.6,
  zIndex: 1,
}));

const EmailFieldContainer = styled(Box)({
  position: "relative",
  width: "100%",
});

const EmailField: React.FC<EmailFieldProps> = ({
  label = "Email",
  placeholder, // We'll ignore this since label acts as placeholder
  stakeholderType = "student",
  showDomainHint = true,
  value = "",
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(String(value || ""));
  const [showHint, setShowHint] = useState(false);
  const domain = getDomainForStakeholder(stakeholderType);

  useEffect(() => {
    setInputValue(String(value || ""));
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    
    // Show hint when user starts typing but hasn't typed @ yet
    setShowHint(
      showDomainHint && 
      newValue.length > 0 && 
      !newValue.includes("@") && 
      !newValue.includes(".")
    );
    
    // Auto-complete domain if user types just the username
    if (newValue && !newValue.includes("@") && stakeholderType !== "vendor") {
      // Don't auto-complete for vendors as they have various domains
      if (onChange) {
        onChange(event);
      }
    } else {
      if (onChange) {
        onChange(event);
      }
    }
  };

  const handleBlur = () => {
    // Auto-complete domain on blur if user hasn't specified one
    if (inputValue && !inputValue.includes("@") && stakeholderType !== "vendor") {
      const completeEmail = inputValue + domain;
      setInputValue(completeEmail);
      
      if (onChange) {
        const syntheticEvent = {
          target: { value: completeEmail }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }
    setShowHint(false);
  };

  return (
    <EmailFieldContainer>
      <CustomTextField
        label={label}
        type="email"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        startIcon={
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        }
        {...props}
      />
      {showHint && showDomainHint && (
        <DomainHint variant="body2">
          {domain}
        </DomainHint>
      )}
    </EmailFieldContainer>
  );
};

export default EmailField;