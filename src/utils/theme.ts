/* eslint-disable react-hooks/rules-of-hooks */
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark", //set the default theme mode to dark
    primary: {
      main: "rgb(255,122,0)", //add in a custom color for the toolbar
    },
    info: {
      main: "rgb(255,122,0)", //add in a custom color for the toolbar alert background stuff
    },
    background: {
      default: "#000", //pure black table in dark mode for fun
    },
  },
  typography: {
    button: {
      textTransform: "none", //customize typography styles for all buttons in table by default
      fontSize: "1.2rem",
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1.1rem", //override to make tooltip font size larger
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          color: "pink", //change the color of the switch thumb in the columns show/hide menu to pink
        },
      },
    },
  },
});
