"use client";

import React from "react";
import { FormControl, FormLabel, FormGroup, RadioGroup, FormHelperText } from "@mui/material";
import CustomCheckbox from "./CustomCheckbox";
import CustomRadio from "./CustomRadio";
import { CustomCheckboxGroupProps } from './types';
import { handleCheckboxGroupChange, handleRadioGroupChange } from './utils';
import theme from "@/themes/lightTheme";

const CustomCheckboxGroup: React.FC<CustomCheckboxGroupProps> = ({
  label,
  options,
  onChange,
  onRadioChange,
  helperText,
  error = false,
  multaqaFill = false,
  size = "medium",
  row = false,
  enableMoreThanOneOption = true,
}) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    options.filter((opt) => opt.checked).map((opt) => opt.value)
  );
  
  const [selectedValue, setSelectedValue] = React.useState<string>(
    options.find((opt) => opt.checked)?.value || ""
  );

  const isRadioMode = !enableMoreThanOneOption;

  return (
    <FormControl component="fieldset" error={error} fullWidth>
      <FormLabel 
        component="legend" 
        sx={{ 
          color: error ? "error.main" : theme.palette.primary.dark,
          fontWeight: 600,
          marginBottom: 1,
          fontSize:"14px",
          marginLeft:"12px"
        }}
      >
        {label}
      </FormLabel>
      
      {isRadioMode ? (
        <RadioGroup
          value={selectedValue}
          onChange={(e) => handleRadioGroupChange(
            e.target.value,
            setSelectedValue,
            onRadioChange
          )}
          row={row}
        >
          {options.map((option) => (
            <div key={option.value} style={{ display: "flex", alignItems: "center" }}>
              <CustomRadio
                value={option.value}
                disabled={option.disabled}
                multaqaFill={multaqaFill}
                size={size}
              />
              <span style={{ marginLeft: 8,fontSize:"12px" }}>{option.label}</span>
            </div>
          ))}
        </RadioGroup>
      ) : (
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
      )}
      
      {helperText && (
        <FormHelperText sx={{ marginTop: 1 , fontStyle:"italic", color:theme.palette.primary.dark}}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomCheckboxGroup;
