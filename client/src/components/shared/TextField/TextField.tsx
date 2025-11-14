"use client";
import * as React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useField, FieldHookConfig } from "formik";
import { RichTextFieldProps } from "./types";
import {
  containerStyles,
  contentAreaStyles,
  headerLabelStyles,
  headerTitleContainerStyles,
} from "./styles";

const RichTextField: React.FC<RichTextFieldProps> = (props) => {
  const theme = useTheme();

  // Determine if using Formik
  const isFormik =
    "name" in props && props.name !== undefined && "value" in props === false;

  let field: any = { value: "" };
  let helpers: any = { setValue: () => {}, setTouched: () => {} };

  if (isFormik) {
    const [f, , h] = useField<string>(props as FieldHookConfig<string>);
    field = f;
    helpers = h;
  } else {
    field = { value: (props as any).value ?? "" };
    helpers = {
      setValue: (props as any).onChange,
      setTouched: () => {},
    };
  }

  const value = field.value ?? "";
  const setValue = helpers.setValue;
  const setTouched = helpers.setTouched;

  const contentRef = React.useRef<HTMLDivElement>(null);

const [internalValue, setInternalValue] = React.useState(""); // always start empty

// Sync external value into the editor
React.useEffect(() => {
  if (value !== undefined && value !== null && value !== internalValue) {
    setInternalValue(value);
    if (contentRef.current) {
      contentRef.current.innerHTML = value;
    }
  }
}, [value, internalValue]);

  // Handle typing/input
  const handleInput = () => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML;
      setInternalValue(html);
      setValue(html); // update Formik or parent
    }
  };

  const handleFocus = () => setTouched(true);
  const handleBlur = () => {
    setTouched(true);
    handleInput();
  };

  return (
    <Box sx={containerStyles(theme)}>
      {props.label && (
        <Box sx={headerTitleContainerStyles(theme)}>
          <Typography sx={headerLabelStyles(theme)}>{props.label}</Typography>
        </Box>
      )}

      <Box
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        dir="ltr" // enforce left-to-right typing
        data-placeholder={props.placeholder ?? "Enter text..."}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        sx={{
          ...contentAreaStyles(theme),
          minHeight: "120px",
          outline: "none",
          textAlign: "left",
          whiteSpace: "pre-wrap",
        }}
      />
    </Box>
  );
};

export default RichTextField;
