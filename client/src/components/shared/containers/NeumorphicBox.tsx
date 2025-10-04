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
      inset -2px -2px 5px 0 #FAFBFF,
      inset 2px 2px 5px 0 rgba(22, 27, 29, 0.25)
    `
    : `
      -5px -5px 10px 0 #FAFBFF,
      5px 5px 10px 0 rgba(22, 27, 29, 0.25)
    `,
  transition: "all 0.3s ease-in-out",
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

