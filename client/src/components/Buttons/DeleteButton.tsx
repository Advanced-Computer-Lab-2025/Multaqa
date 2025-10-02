"use client";

import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledDeleteButton = styled(Button)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "20px",
  padding: "5px 10px",
  fontWeight: 600,
  textTransform: "none",
  color: "#FFFFFF",
  border: "2px solid #c22121",
  boxShadow: `
    -5px -5px 4px 0 #FAFBFF,
    5px 5px 6px 0 rgba(150, 43, 43, 0.4)
  `,
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
 "&.MuiButton-outlined": {
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: theme.palette.error.light,
    color: theme.palette.error.main,
  },
"&:hover": {
    background: "#a81818",
    color: theme.palette.primary.contrastText,
    border: "2px solid #a81818",
    boxShadow: `
    -5px -5px 4px 0 #FAFBFF,
    5px 5px 6px 0 rgba(150, 43, 43, 0.4)
  `,
  },
  "&.MuiButton-outlined:hover": {
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#9e2020",
    background: "transparent",
    color: theme.palette.error.dark,
  },

  transition: "all 0.2s ease-in-out",
}));

// Extend ButtonProps with a custom "label" prop
interface CustomButtonProps extends ButtonProps {
  label?: string;
}

const DeleteButton: React.FC<CustomButtonProps> = ({ label="Delete", children, ...props }) => {
  return <StyledDeleteButton {...props} loadingPosition="start">{label || children}</StyledDeleteButton>;
};

export default DeleteButton;
