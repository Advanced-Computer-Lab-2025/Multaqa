"use client";

import React, { useState } from "react";
import { TextField, TextFieldProps, InputAdornment, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { inputBaseClasses } from "@mui/material/InputBase";
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import NeumorphicBox from '../containers/NeumorphicBox';

// styled wrapper for MUI TextField
const StyledTextField = styled(TextField)<{ fieldType: "email" | "text" | "password" | "numeric" }>(({ 
  theme,
  fieldType
}) => ({

}));

// Extend TextFieldProps with a custom "fieldType" prop
interface CustomTextFieldProps extends Omit<TextFieldProps, 'children'> {
  fieldType: "text" | "email" | "password" | "numeric";
  label?: string;
  placeholder?: string;
  children?: React.ReactNode;
  width?: string;
  height?: string;
  userType?: "student" | "staff" | "vendor"; // New prop to determine email domain
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ 
  label, 
  children, 
  fieldType, 
  InputProps, 
  userType = "staff",
  value,
  onChange,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");

  // Get email domain based on user type
  const getEmailDomain = () => {
    switch (userType) {
      case "student":
        return "@student.guc.edu.eg";
      case "staff":
        return "@guc.edu.eg";
      case "vendor":
        return "";
      default:
        return "@guc.edu.eg";
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Handle email input change - only allow username part before @ for non-vendors
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    if (fieldType === "email" && userType !== "vendor") {
      // Remove any @ symbols and everything after them
      const cleanValue = inputValue.split('@')[0];
      setEmailUsername(cleanValue);
      
      // Call parent onChange with full email if provided
      if (onChange) {
        const syntheticEvent = {
          ...event,
          target: {
            ...event.target,
            value: cleanValue + getEmailDomain()
          }
        };
        onChange(syntheticEvent);
      }
    } else {
      // For non-email fields or vendor users, use normal onChange
      if (onChange) {
        onChange(event);
      }
    }
  };

  // Handle key input to prevent @ symbol for non-vendor email fields
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (fieldType === "email" && userType !== "vendor" && event.key === "@") {
      event.preventDefault();
    }
    
    // Call parent onKeyPress if provided
    if (props.onKeyPress) {
      props.onKeyPress(event);
    }
  };

  // Function to get the appropriate icon based on field type
  const getFieldIcon = () => {
    switch (fieldType) {
      case "email":
        return <EmailIcon sx={{ mr: 1, fontSize: '1rem' }} />;
      case "text":
        return <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} />;
      case "password":
        return <LockIcon sx={{ mr: 1, fontSize: '1rem' }} />;
      case "numeric":
        return <PhoneIcon sx={{ mr: 1, fontSize: '1rem' }} />;
      default:
        return null;
    }
  };

  // Create label with icon
  const labelWithIcon = label ? (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {getFieldIcon()}
      {label}
    </Box>
  ) : undefined;

  // Get the appropriate endAdornment based on field type
  const getEndAdornment = () => {
    if (fieldType === "email" && userType !== "vendor") {
      return (
        <InputAdornment
          position="end"
          sx={{
            alignSelf: 'flex-end',
            margin: 0,
            marginBottom: '5px',
            opacity: 0,
            pointerEvents: 'none',
            [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
              opacity: 1,
            },
          }}
        >
          {getEmailDomain()}
        </InputAdornment>
      );
    } else if (fieldType === "password") {
      return (
        <InputAdornment position="end">
          <IconButton
            size="small"
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>
      );
    }
    return undefined;
  };

  // Get the display value for email fields
  const getDisplayValue = () => {
    if (fieldType === "email" && userType !== "vendor") {
      return emailUsername;
    }
    return value;
  };

  return (
    <NeumorphicBox 
      containerType="inwards" 
      padding="16px" 
      borderRadius="12px"
      width="auto"
    >
      <StyledTextField 
        {...props}
        label={labelWithIcon}
        fieldType={fieldType}
        variant="standard"
        type={fieldType === "password" ? (showPassword ? "text" : "password") : props.type}
        value={getDisplayValue()}
        onChange={handleEmailChange}
        onKeyPress={handleKeyPress}
        InputProps={{
          endAdornment: getEndAdornment(),
          ...InputProps,
        }}
      />
    </NeumorphicBox>
  );
};

export default CustomTextField;
