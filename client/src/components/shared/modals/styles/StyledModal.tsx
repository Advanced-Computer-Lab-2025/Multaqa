"use client";

import { Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

// Wrapper Card component matching FilterCardWrapper structure
export const ModalCardWrapper = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '18px',
  padding: 0,
  overflow: 'visible',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  // Default widths - can be overridden via sx prop
  width: '90vw',
  maxWidth: '90vw',
  // Small screens (sm: 600px) to Large screens (lg: 1200px)
  [theme.breakpoints.up('sm')]: {
    width: '80vw',
    maxWidth: '80vw',
  },
  // Large screens and above (lg: 1200px+)
  [theme.breakpoints.up('lg')]: {
    width: '50vw',
    maxWidth: '50vw',
  },
}));

// Neumorphic styled modal box with the exact design from FilterBox/FilterCard
export const StyledModalBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  borderRadius: '20px',
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  // Neumorphic outward shadow effect - reduced blur on top-left light shadow
  boxShadow: `
    5px 5px 10px 0 rgba(22, 27, 29, 0.25),
    -5px -5px 5px 0 #FAFBFF
  `,
  transition: "all 0.3s ease-in-out",
  maxHeight: '90vh',
  overflow: 'hidden',
}));

// Scrollable content container with padding
export const StyledModalContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '16px',
  // Hide scrollbar for cleaner look
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  // Responsive padding
  [theme.breakpoints.up('sm')]: {
    padding: '24px',
  },
  [theme.breakpoints.up('md')]: {
    padding: '32px',
  },
}));

// Close button container - stays fixed at top
export const StyledModalHeader = styled(Box)(() => ({
  padding: '16px 16px 0',
  flexShrink: 0,
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

// CustomModal specific wrapper - smaller width (40% on md+ screens)
export const CustomModalCardWrapper = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '18px',
  padding: '24px', // Add padding to the wrapper
  overflow: 'visible',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  // Smaller widths for CustomModal
  width: '90vw',
  maxWidth: '90vw',
  // Small screens (sm: 600px)
  [theme.breakpoints.up('sm')]: {
    width: '70vw',
    maxWidth: '70vw',
  },
  // Medium screens and above (md: 900px) - Max 40% width
  [theme.breakpoints.up('md')]: {
    width: '40vw',
    maxWidth: '40vw',
  },
}));

// CustomModal specific box - inherits same styling as StyledModalBox
export const CustomModalBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  borderRadius: '20px',
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  padding: '32px', // Add internal padding
  // Neumorphic outward shadow effect
  boxShadow: `
    5px 5px 10px 0 rgba(22, 27, 29, 0.25),
    -5px -5px 5px 0 #FAFBFF
  `,
  transition: "all 0.3s ease-in-out",
  maxHeight: '90vh',
  overflow: 'hidden',
}));
