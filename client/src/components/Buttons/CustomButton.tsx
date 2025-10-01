"use client";

import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled wrapper for MUI Button
const StyledButton = styled(Button)(({ theme }) => ({
  cursor:"pointer",
  background:theme.palette.background.default,
  borderRadius: "20px",
  padding: "0.75rem 2rem",
  fontWeight: 600,
  textTransform: "none",
  color: "#333",
  boxShadow: `
    -10px -10px 30px #FFFFFF,
    10px 10px 30px #AEAEC0
  `,
  transition: "all 0.2s ease-in-out",
}));

// Component wrapper
const CustomButton: React.FC<ButtonProps> = (props) => {
  return <StyledButton {...props} />;
};

export default CustomButton;
