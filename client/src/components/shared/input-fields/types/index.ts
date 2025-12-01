import { TextFieldProps } from "@mui/material";

export type FieldType =
  | "text"
  | "name"
  | "email"
  | "password"
  | "numeric"
  | "numeric-float"
  | "phone";

export type SelectFieldType =
  | "single"
  | "multiple";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export type StakeholderType =
  | "student"
  | "staff"
  | "ta"
  | "professor"
  | "admin"
  | "events-office"
  | "vendor";

export interface CustomSelectFieldProps {
  fieldType: SelectFieldType;
  options: SelectOption[];
  name: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isError?: boolean;
  helperText?: string;
  value?: string | number | string[] | number[];
  onChange?: (value: string | number | string[] | number[]) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  // General styling props
  label?: string;
  placeholder?: string;
  width?: string;
  height?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
  required?: boolean;

  // Neumorphic styling props
  neumorphicBox?: boolean; // Enable neumorphic box styling
  disableDynamicMorphing?: boolean; // Disable dynamic morphing on focus/blur
}

export interface CustomTextFieldProps
  extends Omit<TextFieldProps, "variant" | "children"> {
  name: string;
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

  // Text field specific props
  autoCapitalizeName?: boolean; // Automatically capitalize names (first, last, full) - default true for text fields
  separateLabels?: boolean; // Separate labels for first and last name when fieldType is "text" and label contains "name"
  disableIcon?: boolean; // Disable the label and icon - default false (label shown by default)
  borderRadius?: string; // Custom border radius for neumorphic box
  disableEndAdornment?: boolean; // Disable end adornment (email domain or password toggle) - default false
}

export interface CustomRatingProps {
  multaqaFill?: boolean;
}

export interface CustomCheckboxProps {
  multaqaFill?: boolean;
}

export interface CustomRadioProps {
  multaqaFill?: boolean;
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


export interface CustomSelectFieldV2Props {
  fieldType: SelectFieldType;
  options: SelectOption[];
  name: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isError?: boolean;
  helperText?: string;
  value?: string | number | string[] | number[];
  onChange?: (value: string | number | string[] | number[]) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;

  // General styling props
  label?: string;
  placeholder?: string;
  placeholderStyle?: string;
  width?: string;
  height?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
  required?: boolean;

  // Neumorphic styling props
  neumorphicBox?: boolean;
  disableDynamicMorphing?: boolean;

  // Positioning props
  usePortalPositioning?: boolean; // Use portal-based positioning (old behavior) - default: false
}

export interface SelectFieldV2StyleProps {
  isOpen: boolean;
  isFocused: boolean;
  isHovered: boolean;
  hasValue: boolean;
  isError: boolean;
  disabled: boolean;
  size: "small" | "medium";
  neumorphicBox: boolean;
  minWidthFromContent?: number;
}

export interface DropdownStyleProps {
  isOpen: boolean;
}

export interface OptionStyleProps {
  isSelected: boolean;
  isDisabled: boolean;
}
