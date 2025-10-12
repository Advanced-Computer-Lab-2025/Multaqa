"use client";

import React from "react";
import { CheckboxProps } from "@mui/material";
import { StyledCheckbox } from './styles/StyledCheckbox';

export interface CustomCheckboxProps extends Omit<CheckboxProps, 'children'> {
  multaqaFill?: boolean; 
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ 
  multaqaFill = true,
  size = "medium",
  ...props 
}) => {
  return (
    <StyledCheckbox 
      {...props}
      multaqaFill={multaqaFill}
      size={size}
    />
  );
};

export default CustomCheckbox;
