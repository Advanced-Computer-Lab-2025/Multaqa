import { TextFieldProps } from "@mui/material";

export interface BaseFieldProps extends Omit<TextFieldProps, "variant"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isError?: boolean;
  helperText?: string;
}

export type StakeholderType =
  | "student"
  | "staff"
  | "ta"
  | "professor"
  | "admin"
  | "events-office"
  | "vendor";

export interface EmailFieldProps extends Omit<BaseFieldProps, "type"> {
  label?: string;
  placeholder?: string;
  stakeholderType?: StakeholderType;
  showDomainHint?: boolean;
}

export interface PasswordFieldProps extends Omit<BaseFieldProps, "type"> {
  label?: string;
  placeholder?: string;
}