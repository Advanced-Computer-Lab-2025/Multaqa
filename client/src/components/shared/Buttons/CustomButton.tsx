"use client";
import React from "react";
import { CustomButtonProps } from "./types/index";
import { StyledButton } from "./styles/index";

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  width,
  height,
  children,
  className,
  sx,
  ...props
}) => {
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
