import { ButtonProps } from "@mui/material";

// Extend ButtonProps with a custom "label" prop
export interface CustomButtonProps extends ButtonProps {
  label?: string;
  width?: string;
}