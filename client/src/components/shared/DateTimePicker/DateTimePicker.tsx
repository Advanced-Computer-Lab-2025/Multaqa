import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NeumorphicBox from "../containers/NeumorphicBox";
import { DateTimePickerProps } from "./types";
import {
  formatDateTimeToString,
  getMinDateTime,
  parseStringToDateTime,
} from "./utils";
import { getDateTimePickerStyles } from "./styles";

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error = false,
  errorMessage,
  minDate,
  touched: propTouched = false,
}) => {
  const theme = useTheme();
  const styles = getDateTimePickerStyles(theme);

  // Determine if there's an error
  const fieldError = error || (propTouched && errorMessage);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) onBlur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateTime = e.target.value
      ? parseStringToDateTime(e.target.value)
      : null;
    onChange(dateTime);
  };

  return (
    <div className="w-full" style={styles.container}>
      <NeumorphicBox
        containerType="inwards"
        borderRadius="12px"
        className="mb-2"
        sx={fieldError ? styles.neuBoxError : {}}
      >
        <div className="p-3 relative">
          <label
            htmlFor={id}
            className="block mb-2 text-sm font-medium"
            style={styles.label}
          >
            {label}
          </label>
          <input
            id={id}
            name={name}
            type="datetime-local"
            className="w-full bg-transparent border-none outline-none"
            style={styles.input}
            value={formatDateTimeToString(value)}
            onChange={handleChange}
            onBlur={handleBlur}
            min={getMinDateTime(minDate)}
          />
        </div>
      </NeumorphicBox>

      {fieldError && (
        <Box display="flex" alignItems="center" mt={1} ml={1}>
          <ErrorOutlineIcon sx={styles.errorIcon} />
          <Typography variant="caption" sx={styles.errorText}>
            {errorMessage}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default DateTimePicker;
