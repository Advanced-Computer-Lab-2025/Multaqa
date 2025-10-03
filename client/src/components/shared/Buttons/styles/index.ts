import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled wrapper for MUI Button
export const StyledButton = styled(Button)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "50px",
  padding: "5px 10px",
  "&.MuiButton-outlined": {
    borderWidth: "2px",
    borderStyle: "solid",
  },
  "&.MuiButton-contained": {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: `
    -5px -5px 8px 0 #FAFBFF,
     5px 5px 8px 0 rgba(107, 79, 150, 0.6)
     `,
  },
   
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
  textTransform: "none",
  letterSpacing: "0.5px",
  fontWeight: 900,
  boxShadow: `
   -5px -5px 10px 0 #FAFBFF,
   5px 5px 10px 0 rgba(22, 27, 29, 0.25)
`,

"&:hover": {
  boxShadow: `
   -5px -5px 10px 0 #FAFBFF,
   5px 5px 10px 0 rgba(22, 27, 29, 0.25)
  `,
},

"&.MuiButton-contained:hover": {
    background: theme.palette.primary.dark,
    boxShadow: `
   -5px -5px 8px 0 #FAFBFF,
   5px 5px 8px 0 rgba(22, 27, 29, 0.25)
`,
  },

"&:active": {
  boxShadow: `
    inset -10px -10px 10px 0 #000000 25%,
    inset 10px 10px 10px 0 #FFFFFF 80%
  `,
},
}));


export const StyledDeleteButton = styled(Button)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "20px",
  padding: "5px 10px",
  fontWeight: 600,
  textTransform: "none",
  color: "#FFFFFF",
  border: "2px solid #c22121",
  boxShadow: `
    -5px -5px 8px 0 #FAFBFF,
    5px 5px 8px 0 rgba(150, 43, 43, 0.4)
  `,
  fontFamily: "var(--font-poppins), system-ui, sans-serif",
 "&.MuiButton-outlined": {
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: theme.palette.error.light,
    color: theme.palette.error.main,
  },
"&:hover": {
    background: "#a81818",
    color: theme.palette.primary.contrastText,
    border: "2px solid #a81818",
    boxShadow: `
    -5px -5px 8px 0 #FAFBFF,
    5px 5px 8px 0 rgba(150, 43, 43, 0.4)
  `,
  },
  "&.MuiButton-outlined:hover": {
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "#9e2020",
    background: "transparent",
    color: theme.palette.error.dark,
  },

  transition: "all 0.2s ease-in-out",
}));

