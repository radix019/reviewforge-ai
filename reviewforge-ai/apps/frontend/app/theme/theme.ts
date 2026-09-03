"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563EB",
    },

    secondary: {
      main: "#7C3AED",
    },

    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    fontSize: 18,

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 8,
  },
});
