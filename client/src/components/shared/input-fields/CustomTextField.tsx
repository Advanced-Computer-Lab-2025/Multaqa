"use client";

import React, { useState } from "react";
import NeumorphicBox from "../containers/NeumorphicBox";
import { CustomTextFieldProps } from "./types";
import { StyledTextField } from "./styles/StyledTextField";
import StyledDefaultTextField from "./styles/StyledDefaultTextField";
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
  getEmailDomain,
  NAME_FORMATTING_NOTE,
} from "./utils";

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  label,
  fieldType,
  InputProps,
  stakeholderType = "staff",
  neumorphicBox = false,
  disableDynamicMorphing = true,
  autoCapitalizeName: autoCapitalizeNameProp = true,
  separateLabels = false,
  disableIcon = false,
  value,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isNameField = fieldType === "name";
  const autoCapitalizeName = isNameField ? false : autoCapitalizeNameProp;

  // Sync/normalize email value when stakeholderType or external value changes.
  // This prevents the domain from being accidentally merged into the editable value
  // when the stakeholderType toggles between vendor (no domain) and non-vendor (domain).
  React.useEffect(() => {
    if (fieldType !== "email") return;

    const domain =
      stakeholderType && stakeholderType !== "vendor"
        ? (getEmailDomain(stakeholderType) as string)
        : "";
    const current = String(value || "");

    // If switching to vendor: remove any domain from the stored value and notify parent
    if (stakeholderType === "vendor") {
      // Remove any @ and domain suffix
      const usernameOnly = current.split("@")[0];
      // If parent value still contains a domain, call onChange with cleaned value
      if (current.includes("@")) {
        if (onChange) {
          const syntheticEvent = {
            target: {
              value: usernameOnly,
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }
      setEmailUsername(usernameOnly);
      return;
    }

    // For non-vendor stakeholder types: extract username portion from value so separateLabels shows only username
    if (domain) {
      const username = current.split("@")[0];
      setEmailUsername(username);
    }
  }, [stakeholderType, value, fieldType, onChange]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // Handle input change - email, name capitalization, or regular
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle email fields
    if (fieldType === "email") {
      handleEmailInputChange(
        event,
        fieldType,
        stakeholderType,
        setEmailUsername,
        onChange
      );
    }
    // Handle text fields with name capitalization
    else if (fieldType === "text" && autoCapitalizeName) {
      const inputValue = event.target.value;
      // Preserve spaces during typing (true), normalize on blur (handled in blur handler)
      const capitalizedValue = capitalizeName(inputValue, true);

      if (onChange) {
        // Only create synthetic event if value actually changed to avoid unnecessary updates
        if (inputValue !== capitalizedValue) {
          const syntheticEvent = {
            ...event,
            target: {
              ...event.target,
              value: capitalizedValue,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        } else {
          // Pass through the original event if no capitalization needed
          onChange(event);
        }
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
  const labelWithIcon = createLabelWithIcon(label, fieldType, !disableIcon);

  // Get the appropriate endAdornment based on field type
  const getEndAdornment = () => {
    if (fieldType === "email" && stakeholderType !== "vendor") {
      return getEmailEndAdornment(
        stakeholderType,
        props.error || props.isError
      );
    } else if (fieldType === "password") {
      return getPasswordEndAdornment(
        showPassword,
        handleClickShowPassword,
        handleMouseDownPassword
      );
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
    onChange,
    autoCapitalizeName
  );

  const isErrorState = Boolean(props.error || props.isError);

  const helperTextValue = props.helperText;
  const hasHelperTextContent =
    helperTextValue !== undefined &&
    helperTextValue !== null &&
    !(
      typeof helperTextValue === "string" &&
      helperTextValue.trim().length === 0
    );

  const shouldRenderNameNote = isNameField;

  const helperTextForStandard =
    (hasHelperTextContent || shouldRenderNameNote)
      ? (
          <>
            {hasHelperTextContent && (
              <span
                style={{
                  display: "block",
                  color: isErrorState ? "#d32f2f" : "#6b7280",
                }}
              >
                {helperTextValue}
              </span>
            )}
            {shouldRenderNameNote && (
              <span
                style={{
                  display: "block",
                  color: "#6b7280",
                  marginTop: hasHelperTextContent ? 4 : 0,
                }}
              >
                {NAME_FORMATTING_NOTE}
              </span>
            )}
          </>
        )
      : undefined;

  const mergedInputProps = {
    ...(props.inputProps || {}),
    ...(fieldType === "numeric" && {
      inputMode: "numeric" as const,
    }),
    ...(fieldType === "numeric-float" && {
      inputMode: "decimal" as const,
    }),
    ...(fieldType === "phone" && { inputMode: "tel" as const }),
  } as React.InputHTMLAttributes<HTMLInputElement> &
    Record<string, unknown>;

  if (isNameField) {
    mergedInputProps.autoCapitalize = "off";
  }

  // Get the display value for email fields
  const getDisplayValue = () => {
    return getEmailDisplayValue(
      value,
      fieldType,
      stakeholderType,
      emailUsername
    );
  };

  // Map custom fieldType to HTML input type
  const getInputType = () => {
    if (fieldType === "password") {
      return showPassword ? "text" : "password";
    }
    // Use text type for numeric and phone fields to avoid browser restrictions
    // Validation is handled by pattern attributes and on submit
    if (fieldType === "email") {
      return "email";
    }
    return props.type || "text";
  };

  return (
    <>
      {separateLabels ? (
        <StyledDefaultTextField
          name={name}
          label={!disableIcon ? label : undefined}
          fieldType={fieldType}
          placeholder={props.placeholder}
          value={getDisplayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          type={getInputType()}
          disabled={props.disabled || false}
          autoCapitalizeName={autoCapitalizeName}
          neumorphicBox={neumorphicBox}
          disableDynamicMorphing={disableDynamicMorphing}
          stakeholderType={stakeholderType}
          separateLabels={separateLabels}
          disableIcon={disableIcon}
          error={isErrorState}
        />
      ) : (
        <>
          {neumorphicBox ? (
            <div style={{ width: "100%" }}>
              <NeumorphicBox
                containerType={
                  disableDynamicMorphing
                    ? "outwards"
                    : isFocused
                    ? "inwards"
                    : "outwards"
                }
                padding="2px"
                borderRadius="50px"
                width="100%"
              >
                <StyledTextField
                  name={name}
                  {...props}
                  fullWidth
                  label={!disableIcon ? labelWithIcon : props.placeholder || ""}
                  placeholder={disableIcon ? undefined : props.placeholder}
                  fieldType={fieldType}
                  stakeholderType={stakeholderType}
                  neumorphicBox={neumorphicBox}
                  variant="outlined"
                  size="small"
                  type={getInputType()}
                  value={getDisplayValue()}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  // Don't show helperText inside the box
                  helperText=""
                  error={isErrorState}
                  InputProps={{
                    endAdornment: getEndAdornment(),
                    ...InputProps,
                  }}
                  // Add inputMode attributes for better mobile keyboard support
                  inputProps={mergedInputProps}
                />
              </NeumorphicBox>
              {/* Render error/helperText outside the neumorphic box */}
              {hasHelperTextContent && (
                <div
                  style={{
                    color: isErrorState ? "#d32f2f" : "#6b7280",
                    fontSize: "0.75rem",
                    marginTop: "3px",
                    marginLeft: "14px",
                    marginRight: "14px",
                    fontWeight: 400,
                    lineHeight: 1.66,
                  }}
                >
                  {helperTextValue}
                </div>
              )}
              {shouldRenderNameNote && (
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    marginTop: hasHelperTextContent ? "2px" : "3px",
                    marginLeft: "14px",
                    marginRight: "14px",
                    fontWeight: 400,
                    lineHeight: 1.66,
                  }}
                >
                  {NAME_FORMATTING_NOTE}
                </div>
              )}
            </div>
          ) : (
            <StyledTextField
              name={name}
              {...props}
              fullWidth
              label={!disableIcon ? labelWithIcon : props.placeholder || ""}
              placeholder={disableIcon ? undefined : props.placeholder}
              fieldType={fieldType}
              stakeholderType={stakeholderType}
              variant="standard"
              type={getInputType()}
              value={getDisplayValue()}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              onFocus={handleFocus}
              onBlur={handleBlur}
              helperText={helperTextForStandard}
              error={isErrorState}
              InputProps={{
                endAdornment: getEndAdornment(),
                ...InputProps,
              }}
              // Add inputMode attributes for better mobile keyboard support
              inputProps={mergedInputProps}
            />
          )}
        </>
      )}
    </>
  );
};

export default CustomTextField;
