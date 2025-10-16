import { Theme } from "@mui/material";

export const getDatePickerStyles = (theme: Theme) => ({
  label: {
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
    fontWeight: 500,
    display: "block",
    marginBottom: "0.25rem",
  },
  input: {
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    padding: "0.25rem 0.5rem",
    color: theme.palette.text.primary,
  },
  neuBoxError: {
    border: `2px solid ${theme.palette.error.main}`,
    borderRadius: "10px",
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 1,
    color: theme.palette.error.main,
  },
  errorText: {
    color: theme.palette.error.main,
  },
});
