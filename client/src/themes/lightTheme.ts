"use client";

import { createTheme } from "../../node_modules/@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7851da",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f6f5f9",
    },
    text: {
      primary: "#222222",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});

export default theme;
