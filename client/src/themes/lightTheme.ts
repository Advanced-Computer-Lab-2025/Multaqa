"use client";

import { createTheme } from "../../node_modules/@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7851da",
      contrastText: "#ffffff",
    },
    background: {
      default: "#e5e7eb",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#6842C0",
    },
  },
 typography: {
    h1: {
      fontFamily: "var(--font-jost), system-ui, sans-serif",
      fontWeight: 600,
      fontSize: "2.5rem",
    },
  },
   components: {
    MuiButton: {
      styleOverrides: {
        sizeSmall: {
          height: "32px",
          width: "100px",
          fontSize: "0.65rem",
        },
        sizeMedium: {
          height: "40px",
          width: "140px",
          fontSize: "0.875rem",
        },
        sizeLarge: {
          height: "48px",
          width: "180px",
          fontSize: "1rem",
        },
      },
    },
  },
});

export default theme;
