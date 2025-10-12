import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Field, FieldProps } from "formik";
import NeumorphicBox from "../containers/NeumorphicBox";
import { DatePickerProps } from "./types";
import { formatDateToString, getMinDate, parseStringToDate } from "./utils";
import { getDatePickerStyles } from "./styles";

const DatePicker: React.FC<DatePickerProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  error = false,
  errorMessage,
  minDate,
  containerType = "outwards",
  touched = false,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const styles = getDatePickerStyles(theme);

  // Determine the container type based on the props and state
  const getContainerType = () => {
    // When there's an error and the field has been touched we keep the visual
    // cue by returning the focused look but avoid using a special error type
    // that NeumorphicBox does not support.
    if (touched && error) return "inwards";
    if (isFocused) return "inwards";
    if (containerType) return containerType;
    return "outwards";
  };

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => {
        const fieldError = meta.touched && meta.error;

        const handleFocus = () => {
          setIsFocused(true);
          if (onFocus) onFocus();
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
          field.onBlur(e);
          setIsFocused(false);
          if (onBlur) onBlur();
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const date = e.target.value
            ? parseStringToDate(e.target.value)
            : null;
          field.onChange(e);
          onChange(date);
        };

        return (
          <div className="w-full">
            <NeumorphicBox
              containerType={getContainerType()}
              borderRadius="10px"
              className="mb-2"
              sx={fieldError ? styles.neuBoxError : {}}
            >
              <div className="p-2 relative">
                <label
                  htmlFor={id}
                  className="block mb-1 text-sm font-medium"
                  style={styles.label}
                >
                  {label}
                </label>
                <input
                  id={id}
                  {...field}
                  type="date"
                  className="w-full bg-transparent border-none outline-none px-2 py-1"
                  style={styles.input}
                  value={formatDateToString(value)}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  min={getMinDate(minDate)}
                />
              </div>
            </NeumorphicBox>

            {meta.touched && (meta.error || error) && (
              <Box display="flex" alignItems="center" mt={1}>
                <ErrorOutlineIcon sx={styles.errorIcon} />
                <Typography variant="caption" sx={styles.errorText}>
                  {meta.error || errorMessage}
                </Typography>
              </Box>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default DatePicker;
