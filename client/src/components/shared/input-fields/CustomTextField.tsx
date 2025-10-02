"use client";

import React from "react";
import { TextField, TextFieldProps, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import { inputBaseClasses } from "@mui/material/InputBase";

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
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ label, children, fieldType, InputProps, ...props }) => {
  return (
    <StyledTextField 
      {...props}
      label={label}
      fieldType={fieldType}
      InputProps={{
        endAdornment: fieldType === "email" ? (
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
            @student.guc.edu.eg
          </InputAdornment>
        ) : undefined,
        ...InputProps,
      }}
    />
  );
};

export default CustomTextField;
