"use client";

import React from "react";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import NeumorphicBox from '../containers/NeumorphicBox';
import { CustomSelectFieldProps } from './types';
import { StyledSelectField } from './styles/StyledSelectField';
import {
  createSelectLabelWithIcon,
  getSelectFieldDisplayValue,
  formatSelectDisplayText,
  createSelectChangeHandler,
} from './utils';

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({ 
  label,
  fieldType, 
  options,
  neumorphicBox = false,
  value,
  onChange,
  placeholder,
  size = "medium",
  disabled = false,
  required = false,
  isError = false,
  helperText,
  ...props 
}) => {
  // Create handlers using utilities
  const handleSelectValueChange = createSelectChangeHandler(onChange);

  // Create label with icon
  const labelWithIcon = createSelectLabelWithIcon(label, fieldType);

  // Get the display value for select fields
  const getDisplayValue = () => {
    return getSelectFieldDisplayValue(value, fieldType);
  };

  return (
    <>
      {neumorphicBox ? (
        <NeumorphicBox 
          containerType="inwards"
          padding="2px" 
          borderRadius="50px"
          width="100%"
        >
          <FormControl 
            fullWidth
            size={size} 
            disabled={disabled}
            required={required}
            error={isError}
            sx={{ width: '100%' }}
          >
            {label && (
              <InputLabel 
                id={`select-label-${fieldType}`}
                sx={{
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  fontWeight: 500,
                  backgroundColor: 'transparent',
                  padding: '2px 8px',
                  '& .MuiSvgIcon-root': {
                    display: 'none',
                  },
                  ...(neumorphicBox && size === 'small' && {
                    background: '#ffffff',
                  }),
                }}
              >
                {labelWithIcon}
              </InputLabel>
            )}
            <StyledSelectField
              label={label}
              labelId={`select-label-${fieldType}`}
              fieldType={fieldType}
              neumorphicBox={neumorphicBox}
              variant="outlined"
              value={getDisplayValue()}
              onChange={handleSelectValueChange}
              multiple={fieldType === "multiple"}
              displayEmpty
              renderValue={(selected) => {
                if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                  return <span style={{ color: 'transparent', fontStyle: 'italic' }}>{placeholder || 'Select...'}</span>;
                }
                return formatSelectDisplayText(selected, options, fieldType, placeholder);
              }}
              {...props}
            >
              {options.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </MenuItem>
              ))}
            </StyledSelectField>
            {helperText && (
              <div style={{ 
                fontSize: '0.75rem', 
                color: isError ? '#d32f2f' : '#666', 
                marginTop: '3px',
                marginLeft: '14px'
              }}>
                {helperText}
              </div>
            )}
          </FormControl>
        </NeumorphicBox>
      ) : (
        <FormControl 
          fullWidth
          size={size} 
          disabled={disabled}
          required={required}
          error={isError}
          sx={{ width: '100%' }}
        >
          {label && (
            <InputLabel 
              id={`select-label-${fieldType}-standard`}
              sx={{
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fontWeight: 500,
                padding: '2px 8px',
                '& .MuiSvgIcon-root': {
                  display: 'none',
                },
              }}
            >
              {labelWithIcon}
            </InputLabel>
          )}
          <StyledSelectField
            label={label}
            labelId={`select-label-${fieldType}-standard`}
            fieldType={fieldType}
            neumorphicBox={neumorphicBox}
            variant="standard"
            value={getDisplayValue()}
            onChange={handleSelectValueChange}
            multiple={fieldType === "multiple"}
            displayEmpty
            renderValue={(selected) => {
              if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                return <span style={{ color: 'transparent', fontStyle: 'italic' }}>{placeholder || 'Select...'}</span>;
              }
              return formatSelectDisplayText(selected, options, fieldType, placeholder);
            }}
            {...props}
          >
            {options.map((option) => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </MenuItem>
            ))}
          </StyledSelectField>
          {helperText && (
            <div style={{ 
              fontSize: '0.75rem', 
              color: isError ? '#d32f2f' : '#666', 
              marginTop: '3px',
              marginLeft: '14px'
            }}>
              {helperText}
            </div>
          )}
        </FormControl>
      )}
    </>
  );
};

export default CustomSelectField;