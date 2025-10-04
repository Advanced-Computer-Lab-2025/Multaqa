"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// Neumorphic styled modal box with the exact design from NeumorphicBox
export const StyledModalBox = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '90vw',
  backgroundColor: '#E4EBF5',
  borderRadius: '16px',
  padding: '32px',
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  // Neumorphic outward shadow effect - sharper top-left, softer bottom-right
  boxShadow: `
    -5px -5px 5px 0 #FAFBFF,
    5px 5px 10px 0 rgba(22, 27, 29, 0.25)
  `,
  transition: "all 0.3s ease-in-out",
  outline: 'none',
  border: 'none',
}));

// Optional: Inward variant for nested elements if needed
export const StyledModalBoxInward = styled(Box)(() => ({
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  borderRadius: '12px',
  padding: '16px',
  // Neumorphic inward shadow effect
  boxShadow: `
    inset -2px -2px 5px 0 #FAFBFF,
    inset 2px 2px 5px 0 rgba(22, 27, 29, 0.25)
  `,
  transition: "all 0.3s ease-in-out",
}));
