"use client";

import { Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

// Wrapper Card component matching FilterCardWrapper structure
export const ModalCardWrapper = styled(Card)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '90vw',
  borderRadius: '18px',
  padding: 0,
  overflow: 'visible',
}));

// Neumorphic styled modal box with the exact design from FilterBox/FilterCard
export const StyledModalBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: '32px',
  backgroundColor: theme.palette.background.default,
  borderRadius: '20px',
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  // Neumorphic outward shadow effect - reduced blur on top-left light shadow
  boxShadow: `
    5px 5px 10px 0 rgba(22, 27, 29, 0.25),
    -5px -5px 5px 0 #FAFBFF
  `,
  transition: "all 0.3s ease-in-out",
}));

// Optional: Inward variant for nested elements if needed (matching FilterBox pressed state)
export const StyledModalBoxInward = styled(Box)(({ theme }) => ({
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  backgroundColor: theme.palette.background.default,
  borderRadius: '12px',
  padding: '16px',
  // Neumorphic inward shadow effect - matching FilterBox pressed state
  boxShadow: `
    inset 2px 2px 5px 0 rgba(22, 27, 29, 0.25),
    inset -2px -2px 5px 0 #FAFBFF
  `,
  transition: "all 0.3s ease-in-out",
}));
