"use client";

import React from "react";
import { RadioProps } from "@mui/material";
import { StyledRadio } from './styles/StyledRadio';

export interface CustomRadioProps extends Omit<RadioProps, 'children'> {
  multaqaFill?: boolean; // Use Multaqa primary color (#7851da) - default true
}

const CustomRadio: React.FC<CustomRadioProps> = ({ 
  multaqaFill = true,
  size = "medium",
  ...props 
}) => {
  return (
    <StyledRadio 
      {...props}
      multaqaFill={multaqaFill}
      size={size}
    />
  );
};

export default CustomRadio;