import { TextFieldProps } from "@mui/material";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "numeric"
  | "phone";

export type StakeholderType =
  | "student"
  | "staff"
  | "ta"
  | "professor"
  | "admin"
  | "events-office"
  | "vendor";

export interface CustomTextFieldProps extends Omit<TextFieldProps, "variant" | "type"> {
  fieldType?: FieldType;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isError?: boolean;
  helperText?: string;

  // Email specific props
  stakeholderType?: StakeholderType;
  showDomainHint?: boolean;

  // Phone specific props
  countryCode?: string;

  // General styling props
  label?: string;
  placeholder?: string;
}