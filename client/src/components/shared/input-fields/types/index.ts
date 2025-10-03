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

export interface CustomTextFieldProps extends Omit<TextFieldProps, "variant" | "children"> {
  fieldType: FieldType;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isError?: boolean;
  helperText?: string;
  children?: React.ReactNode;

  // Email specific props
  stakeholderType?: StakeholderType;
  showDomainHint?: boolean;

  // Phone specific props
  countryCode?: string;

  // General styling props
  label?: string;
  placeholder?: string;
  width?: string;
  height?: string;

  // Neumorphic styling props
  neumorphicBox?: boolean; // Enable neumorphic box styling
  disableDynamicMorphing?: boolean; // Disable dynamic morphing on focus/blur
}

export interface CustomRatingProps {
  multaqaFill?: boolean; // Use Multaqa primary color (#7851da) from lightTheme.ts instead of default yellow
}

export interface CustomCheckboxProps {
  multaqaFill?: boolean; // Use Multaqa primary color (#7851da) from lightTheme.ts - default true
}

export interface CustomRadioProps {
  multaqaFill?: boolean; // Use Multaqa primary color (#7851da) from lightTheme.ts - default true
}

export interface CheckboxOption {
  label: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
}

export interface CustomCheckboxGroupProps {
  label: string;
  options: CheckboxOption[];
  onChange?: (selectedValues: string[]) => void;
  onRadioChange?: (selectedValue: string) => void; // For radio mode
  helperText?: string;
  error?: boolean;
  multaqaFill?: boolean;
  size?: "small" | "medium";
  row?: boolean;
  enableMoreThanOneOption?: boolean; // If false, behaves as radio group (default: true)
}