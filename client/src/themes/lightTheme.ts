"use client";

import { createTheme, PaletteColor, PaletteColorOptions } from "@mui/material/styles";
import '@mui/material/styles'; // Import this to augment the correct module

// 1. Augment the Palette interface to include 'tertiary'
declare module '@mui/material/styles' {
  interface Palette {
    tertiary: PaletteColor;
  }
  interface PaletteOptions {
    tertiary?: PaletteColorOptions;
  }
}

// 2. Augment the components' color prop to accept 'tertiary'
// This lets components like Button, Chip, etc., use the new color prop.
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}

// You must do this for any component you want to accept the new color prop,
// e.g., for IconButton, Chip, Fab, etc.
declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    tertiary: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#6299d0",
      light: "#b2cee2",
      dark: "#598bbd",
      contrastText: "#e6e6da",
    },
    secondary: {
      main: "#e5ed6f",
      dark: "#d5de57",
      contrastText: "#13233d",
    },
    tertiary: {
      light: "#6e8ae6",
      main: "#3a4f99",  // The main shade
      dark: "#25346b",
      contrastText: '#fff', // Important for text readability
    },
    error: {
      main: "#db3030",
      dark: "#c72c2c",
    },
    warning: {
      main: "#ff9800",
      dark: "#ff8a00",
      contrastText: "#fff",
    },
    success: {
      main: "#4caf50",
      dark: "#45a049",
      contrastText: "#fff",
    },
    background: {
      default: "#fff",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#6299d0",
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
