"use client";

import React from "react";
import { RatingProps } from "@mui/material";
import { StyledRating } from './styles/StyledRating';

export interface CustomRatingProps extends Omit<RatingProps, 'children'> {
  multaqaFill?: boolean; 
}

const CustomRating: React.FC<CustomRatingProps> = ({ 
  multaqaFill = false,
  defaultValue = 0,
  precision = 0.5,
  ...props 
}) => {
  return (
    <StyledRating 
      {...props}
      multaqaFill={multaqaFill}
      defaultValue={defaultValue}
      precision={precision}
    />
  );
};

export default CustomRating;