import React from 'react';
import { SelectOption, SelectFieldType } from './index';

export interface CustomSelectFieldV2Props {
  fieldType: SelectFieldType;
  options: SelectOption[];
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
}

export interface DropdownStyleProps {
  isOpen: boolean;
}

export interface OptionStyleProps {
  isSelected: boolean;
  isDisabled: boolean;
}
