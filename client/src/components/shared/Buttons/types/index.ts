import { ButtonProps } from "@mui/material";

// Extend ButtonProps with a custom "label" prop
export interface CustomButtonProps extends ButtonProps {
  label?: string;
  width?: string;
  height?: string;
  createButtonStyle?: boolean; // Expandable create button with + icon
  fitContent?: boolean; // Forces width: fit-content to prevent text wrapping
}
