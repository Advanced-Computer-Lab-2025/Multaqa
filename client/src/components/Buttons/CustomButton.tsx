"use client";

import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled wrapper for MUI Button
const StyledButton = styled(Button)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "50px",
  padding: "5px 10px",
  "&.MuiButton-outlined": {
    borderWidth: "2px",
    borderStyle: "solid",
  },
  "&.MuiButton-contained": {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: `
     -5px -5px 4px 0 #FAFBFF,
     5px 5px 6px 0 rgba(107, 79, 150, 0.6)
     `,
  },
   
  fontFamily: "var(--font-pt-sans), system-ui, sans-serif",
  textTransform: "none",
  letterSpacing: "0.5px",
  fontWeight: 900,
  boxShadow: `
   -5px -5px 10px 0 #FAFBFF,
   5px 5px 10px 0 rgba(22, 27, 29, 0.25)
`,

"&:hover": {
  boxShadow: `
   -5px -5px 10px 0 #FAFBFF,
   5px 5px 10px 0 rgba(22, 27, 29, 0.25)
  `,
},

"&.MuiButton-contained:hover": {
    background: theme.palette.primary.dark,
    boxShadow: `
   -5px -5px 7px 0 #FAFBFF,
   5px 5px 6px 0 rgba(22, 27, 29, 0.25)
`,
  },

"&:active": {
  boxShadow: `
    inset -10px -10px 10px 0 #000000 25%,
    inset 10px 10px 10px 0 #FFFFFF 80%
  `,
},
}));

// Extend ButtonProps with a custom "label" prop
interface CustomButtonProps extends ButtonProps {
  label?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, children, ...props }) => {
  return <StyledButton {...props} loadingPosition="start">{label || children}</StyledButton>;
};

export default CustomButton;
