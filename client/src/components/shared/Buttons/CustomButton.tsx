"use client";
import React from "react";
import { CustomButtonProps } from "./types/index";
import { StyledButton } from "./styles/index";



const CustomButton: React.FC<CustomButtonProps> = ({ label, width, height, children, ...props }) => {
  return <StyledButton {...props} sx={{width:width, height:height}} loadingPosition="start">{label || children}</StyledButton>;
};

export default CustomButton;
