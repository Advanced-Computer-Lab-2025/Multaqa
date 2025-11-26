import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ButtonProps } from "@mui/material/Button";
import { resolveButtonPalette } from "../../../utils"

// styled wrapper for MUI Button
export const StyledButton = styled(Button)<ButtonProps>(({ theme, color }) => ({
  cursor: "pointer",
  borderRadius: "50px",
  padding: "5px 10px",
  fontSize: "14px",
  height: "40px",
  color: "#fff",
  borderWidth: "2px",
  borderStyle: "solid",
  borderColor: resolveButtonPalette(theme, color).dark,
  "&.MuiButton-outlined": {
    borderWidth: "2px",
    borderStyle: "solid",
  },
  "&.MuiButton-sizeSmall": {
    padding: "3px 8px",
    fontSize: "12px",
    height: "32px",
  },
  "&.MuiButton-sizeLarge": {
    padding: "8px 14px",
    fontSize: "16px",
    height: "48px",
  },
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  textTransform: "none",
  letterSpacing: "0.5px",
  fontWeight: 900,
  boxShadow: `
   -3px -3px 10px 0 #fffff7,
   5px 5px 10px 0 rgba(153, 153, 142, 0.6)
`,

  "&:hover": {
    boxShadow: `
    -5px -5px 8px 0 #fffff7,
    5px 5px 8px 0 rgba(153, 153, 142, 0.6)
  `,
  },

  "&:active": {
    boxShadow: `
    inset -10px -10px 10px 0 #000000 25%,
    inset 10px 10px 10px 0 #FFFFFF 80%
  `,
  },
}));


export const StyledDeleteButton = styled(Button)<ButtonProps>(({ theme }) => ({
  cursor: "pointer",
  padding: "5px 10px",
  fontSize: "14px",
  height: "36px",
  borderRadius: "20px",
  fontWeight: 600,
  textTransform: "none",
  color: "#FFFFFF",
  border: "2px solid #c22121",
  boxShadow: `
    -3px -3px 10px 0 #fffff7,
    5px 5px 10px 0 rgba(153, 153, 142, 0.6)
  `,
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  "&.MuiButton-outlined": {
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: theme.palette.error.dark,
    color: theme.palette.error.main,
  },
  "&&.MuiButton-sizeSmall": {
    padding: "2px 8px !important",
    fontSize: "11px !important",
    height: "28px !important",
    minHeight: "28px !important",
    borderRadius: "16px !important",
  },
  "&&.MuiButton-sizeLarge": {
    padding: "8px 14px !important",
    fontSize: "16px !important",
    height: "44px !important",
    borderRadius: "24px !important",
  },
  "&:hover": {
    background: "#a81818",
    color: theme.palette.primary.contrastText,
    border: "2px solid #a81818",
    boxShadow: `
   -3px -3px 8px 0 #fffff7,
    5px 5px 8px 0 rgba(153, 153, 142, 0.6)
  `,
  },
  "&.MuiButton-outlined:hover": {
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#9e2020",
    background: "transparent",
    color: "#a81818",
  },
  transition: "all 0.2s ease-in-out",
}));

// (Removed incorrect component-typed hook; use resolveButtonPalette instead)
