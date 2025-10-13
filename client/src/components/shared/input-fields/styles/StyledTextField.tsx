import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FieldType, StakeholderType } from "../types";
import theme from "@/themes/lightTheme";

export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) =>
    prop !== "fieldType" &&
    prop !== "neumorphicBox" &&
    prop !== "stakeholderType",
})<{
  fieldType: FieldType;
  neumorphicBox?: boolean;
  stakeholderType?: StakeholderType;
}>(({ neumorphicBox, fieldType, stakeholderType, error }) => ({
  "& .MuiInput-root": {
    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  "& .MuiInputLabel-root": {
    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    fontWeight: 500,
    fontSize: "1rem",
    padding: "2px 8px 2px 0",
    width: "fit-content",
    maxWidth: "fit-content",
    display: "inline-flex",
    alignItems: "center",
    gap: "2px",
    whiteSpace: "nowrap",
    color: error ? "#d32f2f" : "#999",
    "& svg": {
      color: error ? "#d32f2f" : "#999",
      transition: "color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
    "&.Mui-focused": {
      color: error ? "#d32f2f" : theme.palette.tertiary.main,
      "& svg": {
        color: error ? "#d32f2f" : theme.palette.tertiary.main,
      },
    },
    "&.MuiFormLabel-filled": {
      color: error ? "#d32f2f" : theme.palette.tertiary.main,
      "& svg": {
        color: error ? "#d32f2f" : theme.palette.tertiary.main,
      },
    },
    "&.Mui-error": {
      color: "#d32f2f",
      "& svg": {
        color: "#d32f2f",
      },
    },
    "& .MuiInputLabel-asterisk": {
      color: "#b81d1d",
      display: "inline",
      marginLeft: "2px",
    },
    ...(neumorphicBox && {
      "&.MuiInputLabel-sizeSmall": {
        background: theme.palette.background.default,
      },
    }),
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    "& fieldset": {
      borderColor: "transparent",
      borderWidth: "2px",
      transition: "border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.tertiary.main,
      borderWidth: "2px",
    },
    "&.Mui-error": {
      "& fieldset": {
        borderColor: "#d32f2f",
        borderWidth: "2px",
      },
      "&:hover fieldset": {
        borderColor: "#d32f2f",
        borderWidth: "2px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#d32f2f",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "12px 0px 12px 18px",
    fontSize: "1rem",
    fontWeight: 500,
    "&::placeholder": {
      color: "#999",
      opacity: 1,
      fontWeight: 500,
      // Keep placeholder left-aligned for email fields
      ...(fieldType === "email" &&
        [
          "student",
          "staff",
          "ta",
          "professor",
          "admin",
          "events-office",
        ].includes(stakeholderType as string) && {
          textAlign: "left",
        }),
    },
    ...(fieldType === "email" &&
      [
        "student",
        "staff",
        "ta",
        "professor",
        "admin",
        "events-office",
      ].includes(stakeholderType as string) && {
        textAlign: "right",
      }),
  },
  "& .MuiInput-input": {
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: 500,
    "&::placeholder": {
      color: "#999",
      opacity: 1,
      fontWeight: 500,
      // Keep placeholder left-aligned for email fields
      ...(fieldType === "email" &&
        [
          "student",
          "staff",
          "ta",
          "professor",
          "admin",
          "events-office",
        ].includes(stakeholderType as string) && {
          textAlign: "left",
        }),
    },
    ...(fieldType === "email" &&
      [
        "student",
        "staff",
        "ta",
        "professor",
        "admin",
        "events-office",
      ].includes(stakeholderType as string) && {
        textAlign: "right",
      }),
  },
  "& .MuiInput-underline:before": {
    transition: "border-bottom-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    borderBottomColor: "rgba(0, 0, 0, 0.42)",
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: "rgba(0, 0, 0, 0.42)",
  },
  "& .MuiInput-underline:after": {
    transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  "& .MuiInput-underline.Mui-error:before": {
    borderBottomColor: "#d32f2f",
  },
  "& .MuiInput-underline.Mui-error:after": {
    borderBottomColor: "#d32f2f",
  },
  "& .MuiTypography-root": {
    color: theme.palette.tertiary.main,
  },
}));
