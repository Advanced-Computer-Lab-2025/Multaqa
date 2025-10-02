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
    boxShadow: `
    -12px -12px 20px 0 #FAFBFF,
     6px 7px 16px 0 rgba(107, 79, 224, 0.6)
     `,
  },
   
  fontFamily: "var(--font-pt-sans), system-ui, sans-serif",
  textTransform: "none",
  letterSpacing: "0.5px",
  fontWeight: 900,
  boxShadow: `
  -10px -10px 20px 0 #FAFBFF,
   10px 10px 20px 0 rgba(22, 27, 29, 0.25)
`,
transition: "all 0.2s ease-in-out",

"&:hover": {
  boxShadow: `
    -10px -10px 30px 0 #FFFFFF,
    10px 10px 30px 0 #9696ab
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
