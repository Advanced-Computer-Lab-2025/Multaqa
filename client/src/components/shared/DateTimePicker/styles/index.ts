import { Theme } from "@mui/material";

export const getDateTimePickerStyles = (theme: Theme) => ({
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
    borderRadius: "12px",
    fontSize: "0.875rem",
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
    "&::-webkit-calendar-picker-indicator": {
      filter: "invert(0.5)",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "6px",
      backgroundColor: theme.palette.primary.light,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        filter: "invert(1)",
      },
    },
    "&:focus": {
      backgroundColor: theme.palette.primary.light + "10",
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "2px",
    },
  },
  neuBoxError: {
    border: `2px solid ${theme.palette.error.main}`,
    borderRadius: "48px",
    boxShadow: `inset 0 0 0 1px ${theme.palette.error.main}20`,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 1,
    color: theme.palette.error.main,
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: "0.75rem",
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
  },
  container: {
    borderRadius: "12px",
    overflow: "hidden",
  },
});
