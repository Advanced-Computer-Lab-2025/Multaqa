"use client";

import { Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

// Wrapper Card component matching FilterCardWrapper structure
export const ModalCardWrapper = styled(Card, {
  shouldForwardProp: (prop) => prop !== "borderColor",
})<{
  borderColor?: string;
}>(({ theme, borderColor }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: `3px solid ${borderColor || theme.palette.tertiary.main}`,
  borderRadius: "16px",
  padding: 0,
  overflow: "visible",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  // Remove neumorphic box-shadow so modal looks crisp like dropdowns
  boxShadow: "none",
  // Default widths - can be overridden via sx prop
  width: "90vw",
  maxWidth: "90vw",
  // Small screens (sm: 600px) to Large screens (lg: 1200px)
  [theme.breakpoints.up("sm")]: {
    width: "80vw",
    maxWidth: "80vw",
  },
  // Large screens and above (lg: 1200px+)
  [theme.breakpoints.up("lg")]: {
    width: "50vw",
    maxWidth: "50vw",
  },
}));

// Neumorphic styled modal box with the exact design from FilterBox/FilterCard
export const StyledModalBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  // inner box should not carry its own border to avoid double-border notches;
  // the outer Card wrapper (`ModalCardWrapper`) provides the 2px tertiary border
  border: "none",
  borderRadius: "16px",
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  // Ensure no neumorphic shadow remains
  boxShadow: "none",
  // Neumorphic outward shadow effect - reduced blur on top-left light shadow
  // boxShadow: `
  //   5px 5px 10px 0 rgba(22, 27, 29, 0.25),
  //   -5px -5px 5px 0 #FAFBFF
  // `,
  transition: "all 0.3s ease-in-out",
  maxHeight: "90vh",
  overflow: "auto",
}));

// Scrollable content container with padding
export const StyledModalContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  padding: "16px",
  // Hide scrollbar for cleaner look
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  // Responsive padding
  [theme.breakpoints.up("sm")]: {
    padding: "24px",
  },
  [theme.breakpoints.up("md")]: {
    padding: "32px",
  },
  [theme.breakpoints.up("xs")]: {
    padding: "12px",
  },

}));

// Close button container - stays fixed at top
export const StyledModalHeader = styled(Box)(() => ({
  padding: "16px 16px 0",
  flexShrink: 0,
}));

// Optional: Inward variant for nested elements if needed (matching FilterBox pressed state)
export const StyledModalBoxInward = styled(Box)(({ theme }) => ({
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  backgroundColor: theme.palette.background.default,
  // keep no border on inward box to avoid double-border artifacts
  border: "none",
  borderRadius: "16px",
  padding: "16px",
  // Neumorphic inward shadow effect - matching FilterBox pressed state
  // boxShadow: `
  //   inset 2px 2px 5px 0 rgba(22, 27, 29, 0.25),
  //   inset -2px -2px 5px 0 #FAFBFF
  // `,
  transition: "all 0.3s ease-in-out",
  boxShadow: "none",
}));

// CustomModal specific wrapper - smaller width (40% on md+ screens)
export const CustomModalCardWrapper = styled(Card, {
  shouldForwardProp: (prop) => prop !== "borderColor",
})<{
  borderColor?: string;
}>(({ theme, borderColor }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: `3px solid ${borderColor || theme.palette.tertiary.main}`,
  borderRadius: "16px",
  padding: 0, // No padding on wrapper - padding is inside neumorphic box
  overflow: "visible",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  // Smaller widths for CustomModal
  width: "90vw",
  maxWidth: "90vw",
  // Small screens (sm: 600px)
  [theme.breakpoints.up("sm")]: {
    width: "70vw",
    maxWidth: "70vw",
  },
  // Medium screens and above (md: 900px) - Max 40% width
  [theme.breakpoints.up("md")]: {
    width: "40vw",
    maxWidth: "40vw",
  },
  // Remove any default card shadows to avoid neumorphic effect
  boxShadow: "none",
}));

// CustomModal specific box - inherits same styling as StyledModalBox
export const CustomModalBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#ffffff",
  // inner box: no border; wrapper (`CustomModalCardWrapper`) keeps the border
  border: "none",
  borderRadius: "16px",
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  padding: "32px", // Add internal padding
  // Neumorphic outward shadow effect
  // Ensure no neumorphic shadow for modal content
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",
  maxHeight: "90vh",
  overflow: "hidden",
}));
