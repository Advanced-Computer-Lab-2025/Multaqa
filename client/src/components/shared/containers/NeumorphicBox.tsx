"use client";

import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CustomBoxProps } from "./types";

// styled wrapper for MUI Button
const StyledBox = styled(Box)<{ containerType: "inwards" | "outwards" }>(({ 
  theme,
  containerType
}) => ({
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  textTransform: "none",
  boxShadow: containerType === "inwards" 
    ? `
      inset -2px -2px 5px 0 #fffff7,
      inset 2px 2px 5px 0 rgba(22, 27, 29, 0.25)
    `
    : `
     -3px -3px 10px 0 #fffff7,
     5px 5px 10px 0 rgba(153, 153, 142, 0.6)
    `,
  transition: "box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  transform: containerType === "inwards" ? "scale(0.998)" : "scale(1)",
}));


const NeumorphicBox: React.FC<CustomBoxProps> = ({ 
  containerType="inwards",
  padding="0",
  margin="0",
  width="100%", 
  height="auto", 
  borderRadius="0", 
  children, 
  sx,
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
        ...sx, // Merge with any additional sx props passed
      }}
      {...props}
    >
      {children}
    </StyledBox>
  );
};


export default NeumorphicBox;

