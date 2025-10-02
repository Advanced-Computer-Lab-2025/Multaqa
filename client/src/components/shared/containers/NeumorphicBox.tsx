"use client";

import React from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled wrapper for MUI Button
const StyledBox = styled(Box)<{ containerType: "inwards" | "outwards" }>(({ 
  theme,
  containerType
}) => ({
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  textTransform: "none",
  boxShadow: containerType === "inwards" 
    ? `
      inset -2px -2px 5px 0 #FAFBFF,
      inset 2px 2px 5px 0 rgba(22, 27, 29, 0.25)
    `
    : `
      -5px -5px 10px 0 #FAFBFF,
      5px 5px 10px 0 rgba(22, 27, 29, 0.25)
    `,
  transition: "box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  transform: containerType === "inwards" ? "scale(0.998)" : "scale(1)",
}));

interface CustomBoxProps extends BoxProps {
  containerType: "inwards" | "outwards";
  padding?: string | number;
  margin?: string | number;
  width?: string;
  height?: string;
  borderRadius?: string | number;
}

const NeumorphicBox: React.FC<CustomBoxProps> = ({ 
  containerType="inwards",
  padding="24px",
  margin="0",
  width="100%", 
  height="auto", 
  borderRadius="20px", 
  children, 
  ...props 
}) => {
  return (
    <StyledBox 
      containerType={containerType}
      sx={{
        padding,
        margin,
        width,
        height,
        borderRadius,
      }}
      {...props}
    >
      {children}
    </StyledBox>
  );
};


export default NeumorphicBox;

