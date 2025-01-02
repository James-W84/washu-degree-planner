import { createTheme } from "@mui/material/styles";

const colorPalette = {
  dark: "#A51416",
  main: "#BB0E2E",
  light: "#D01A1D",
};

const black = "#36454F";
const white = "#FAFAFA";

const fontFamily = "Inter, sans serif";

const theme = createTheme({
  palette: {
    common: {
      black,
      white,
    },
    primary: colorPalette,
  },
  typography: {
    fontFamily: fontFamily,
    h1: {
      fontWeight: 600,
      fontSize: 30,
    },
    h2: {
      fontWeight: 600,
      fontSize: 20,
    },
    h3: {
      fontWeight: 600,
      fontSize: 15,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: 15,
    },
    body1: {
      fontWeight: 400,
      fontSize: 12,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: colorPalette.light,
          color: white,
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: colorPalette.light,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          backgroundColor: white,
          color: black,
          paddingTop: 5,
          paddingBottom: 5,
          fontFamily: fontFamily,
          "&.Mui-selected": {
            backgroundColor: colorPalette.main,
            color: white,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            fontFamily,
            fontWeight: 500,
            fontSize: 15,
          },
        },
      },
    },
  },
});

export default theme;
