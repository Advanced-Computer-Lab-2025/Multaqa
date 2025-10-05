"use client";
import React from "react";
import { CustomButtonProps } from "./types/index";
import { StyledButton } from "./styles/index";



const CustomButton: React.FC<CustomButtonProps> = ({ label, width, children, ...props }) => {
  return (
    <StyledButton
      {...props}
      sx={{
        ...(width && { width }), 
      }}
      loadingPosition="start"
    >
      {label || children}
    </StyledButton>
  );
};

export default CustomButton;
