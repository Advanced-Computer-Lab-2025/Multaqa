"use client";

import React, { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import CustomTextField from "./CustomTextField";

import { PasswordFieldProps } from '@/types/components/input-fields';

const PasswordField: React.FC<PasswordFieldProps> = ({
  label = "Password",
  placeholder, // We'll ignore this since label acts as placeholder
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <CustomTextField
      label={label}
      type={showPassword ? "text" : "password"}
      startIcon={
        <InputAdornment position="start">
          <Lock />
        </InputAdornment>
      }
      endIcon={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleTogglePassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
  );
};

export default PasswordField;