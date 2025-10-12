import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useField } from "formik";
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
  touched: propTouched = false,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const styles = getDatePickerStyles(theme);

  // Use Formik's useField hook
  const [field, meta] = useField(name);

  // Determine if there's an error
  const fieldError = (meta.touched && meta.error) || (propTouched && error);

  // Determine the container type based on the props and state
  const getContainerType = () => {
    if (fieldError) return "inwards";
    if (isFocused) return "inwards";
    if (containerType) return containerType;
    return "outwards";
  };

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
    const date = e.target.value ? parseStringToDate(e.target.value) : null;
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

      {fieldError && (
        <Box display="flex" alignItems="center" mt={1}>
          <ErrorOutlineIcon sx={styles.errorIcon} />
          <Typography variant="caption" sx={styles.errorText}>
            {meta.error || errorMessage}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default DatePicker;
