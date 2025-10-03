"use client";

import React from "react";
import { FormControl, FormLabel, FormGroup, FormHelperText } from "@mui/material";
import CustomCheckbox from "./CustomCheckbox";
import { CustomCheckboxGroupProps } from './types';
import { handleCheckboxGroupChange } from './utils';

const CustomCheckboxGroup: React.FC<CustomCheckboxGroupProps> = ({
  label,
  options,
  onChange,
  helperText,
  error = false,
  multaqaFill = true,
  size = "medium",
  row = false,
}) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    options.filter((opt) => opt.checked).map((opt) => opt.value)
  );

  return (
    <FormControl component="fieldset" error={error} fullWidth>
      <FormLabel 
        component="legend" 
        sx={{ 
          color: error ? "error.main" : "text.primary",
          fontWeight: 500,
          marginBottom: 1,
        }}
      >
        {label}
      </FormLabel>
      <FormGroup row={row}>
        {options.map((option) => (
          <div key={option.value} style={{ display: "flex", alignItems: "center" }}>
            <CustomCheckbox
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleCheckboxGroupChange(
                option.value, 
                e.target.checked, 
                selectedValues, 
                setSelectedValues, 
                onChange
              )}
              disabled={option.disabled}
              multaqaFill={multaqaFill}
              size={size}
            />
            <span style={{ marginLeft: 8 }}>{option.label}</span>
          </div>
        ))}
      </FormGroup>
      {helperText && (
        <FormHelperText sx={{ marginTop: 1 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomCheckboxGroup;
