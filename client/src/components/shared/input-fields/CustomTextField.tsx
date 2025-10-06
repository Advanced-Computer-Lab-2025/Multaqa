"use client";

import React, { useState } from "react";
import NeumorphicBox from '../containers/NeumorphicBox';
import { CustomTextFieldProps } from './types';
import { StyledTextField } from './styles/StyledTextField';
import {
  createLabelWithIcon,
  getEmailEndAdornment,
  getPasswordEndAdornment,
  handleEmailInputChange,
  handleEmailKeyPress,
  getEmailDisplayValue,
  createFocusHandler,
  createBlurHandler,
  capitalizeName,
} from './utils';

const CustomTextField: React.FC<CustomTextFieldProps> = ({ 
  label, 
  fieldType, 
  InputProps, 
  stakeholderType = "staff",
  neumorphicBox = false,
  disableDynamicMorphing = true,
  autoCapitalizeName = true,
  value,
  onChange,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Handle input change - email, name capitalization, or regular
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle email fields
    if (fieldType === "email") {
      handleEmailInputChange(event, fieldType, stakeholderType, setEmailUsername, onChange);
    }
    // Handle text fields with name capitalization
    else if (fieldType === "text" && autoCapitalizeName) {
      const inputValue = event.target.value;
      const capitalizedValue = capitalizeName(inputValue);
      
      if (onChange) {
        const syntheticEvent = {
          ...event,
          target: {
            ...event.target,
            value: capitalizedValue
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }
    // Handle all other fields normally
    else {
      if (onChange) {
        onChange(event);
      }
    }
  };

  // Handle key input to prevent @ symbol for non-vendor email fields
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    handleEmailKeyPress(event, fieldType, stakeholderType, props.onKeyPress);
  };

  // Create label with icon
  const labelWithIcon = createLabelWithIcon(label, fieldType);

  // Get the appropriate endAdornment based on field type
  const getEndAdornment = () => {
    if (fieldType === "email" && stakeholderType !== "vendor") {
      return getEmailEndAdornment(stakeholderType);
    } else if (fieldType === "password") {
      return getPasswordEndAdornment(showPassword, handleClickShowPassword, handleMouseDownPassword);
    }
    return undefined;
  };

  // Handle focus events
  const handleFocus = createFocusHandler(setIsFocused, props.onFocus);
  const handleBlur = createBlurHandler(
    setIsFocused, 
    props.onBlur, 
    fieldType, 
    stakeholderType, 
    value, 
    emailUsername, 
    onChange
  );

  // Get the display value for email fields
  const getDisplayValue = () => {
    return getEmailDisplayValue(value, fieldType, stakeholderType, emailUsername);
  };

  return (
    <>
      {neumorphicBox ? (
        <NeumorphicBox 
          containerType={disableDynamicMorphing ? "inwards" : (isFocused ? "inwards" : "outwards")}
          padding="2px" 
          borderRadius="50px"
          width="100%"
        >
          <StyledTextField 
            {...props}
            fullWidth
            label={labelWithIcon}
            fieldType={fieldType}
            stakeholderType={stakeholderType}
            neumorphicBox={neumorphicBox}
            variant="outlined"
            size="small"
            type={fieldType === "password" ? (showPassword ? "text" : "password") : props.type}
            value={getDisplayValue()}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            InputProps={{
              endAdornment: getEndAdornment(),
              ...InputProps,
            }}
          />
        </NeumorphicBox>
      ) : (
        <StyledTextField 
            {...props}
            fullWidth
            label={labelWithIcon}
            fieldType={fieldType}
            stakeholderType={stakeholderType}
            variant="standard"
            type={fieldType === "password" ? (showPassword ? "text" : "password") : props.type}
            value={getDisplayValue()}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            InputProps={{
              endAdornment: getEndAdornment(),
              ...InputProps,
            }}
          />
      )}
    </>
  );
};

export default CustomTextField;
