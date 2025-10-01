"use client";

import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled wrapper for MUI Button
const StyledButton = styled(Button)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "50px",
  padding: "8px 20px",
  "&.MuiButton-outlined": {
    borderWidth: "2px",
    borderStyle: "solid",
  },
}));

// Extend ButtonProps with a custom "label" prop
interface CustomButtonProps extends ButtonProps {
  label?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, children, ...props }) => {
  return <StyledButton {...props}>{label || children}</StyledButton>;
};

export default CustomButton;
