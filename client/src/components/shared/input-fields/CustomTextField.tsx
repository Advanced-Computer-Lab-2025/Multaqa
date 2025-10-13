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
} from "./utils";

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  fieldType,
  InputProps,
  stakeholderType = "staff",
  neumorphicBox = false,
  disableDynamicMorphing = true,
  autoCapitalizeName = true,
  separateLabels = false,
  disableIcon = false,
  value,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailUsername, setEmailUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);

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

  // Get the display value for email fields
  const getDisplayValue = () => {
    return getEmailDisplayValue(
      value,
      fieldType,
      stakeholderType,
      emailUsername
    );
  };

  return (
    <>
      {separateLabels ? (
        <StyledDefaultTextField
          label={!disableIcon ? label : undefined}
          fieldType={fieldType}
          placeholder={props.placeholder}
          value={getDisplayValue()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          type={
            fieldType === "password"
              ? showPassword
                ? "text"
                : "password"
              : props.type
          }
          disabled={props.disabled || false}
          autoCapitalizeName={autoCapitalizeName}
          neumorphicBox={neumorphicBox}
          disableDynamicMorphing={disableDynamicMorphing}
          stakeholderType={stakeholderType}
          separateLabels={separateLabels}
          disableIcon={disableIcon}
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
                  {...props}
                  fullWidth
                  label={!disableIcon ? labelWithIcon : props.placeholder || ""}
                  placeholder={disableIcon ? undefined : props.placeholder}
                  fieldType={fieldType}
                  stakeholderType={stakeholderType}
                  neumorphicBox={neumorphicBox}
                  variant="outlined"
                  size="small"
                  type={
                    fieldType === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : props.type
                  }
                  value={getDisplayValue()}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  // Don't show helperText inside the box
                  helperText=""
                  InputProps={{
                    endAdornment: getEndAdornment(),
                    ...InputProps,
                  }}
                />
              </NeumorphicBox>
              {/* Render error/helperText outside the neumorphic box */}
              {props.error && props.helperText && (
                <p
                  style={{
                    color: "#d32f2f",
                    fontSize: "0.75rem",
                    marginTop: "3px",
                    marginLeft: "14px",
                    marginRight: "14px",
                    fontWeight: 400,
                    lineHeight: 1.66,
                  }}
                >
                  {props.helperText}
                </p>
              )}
            </div>
          ) : (
            <StyledTextField
              {...props}
              fullWidth
              label={!disableIcon ? labelWithIcon : props.placeholder || ""}
              placeholder={disableIcon ? undefined : props.placeholder}
              fieldType={fieldType}
              stakeholderType={stakeholderType}
              variant="standard"
              type={
                fieldType === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : props.type
              }
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
      )}
    </>
  );
};

export default CustomTextField;
