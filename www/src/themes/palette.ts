import { PaletteOptions } from "@mui/material";

// Augment the palette to include an ochre color
declare module "@mui/material/styles" {
  interface Palette {
    backgroundColor: Palette["primary"];
    dark: Palette["secondary"];
  }

  interface PaletteOptions {
    backgroundColor?: PaletteOptions["primary"];
    dark?: PaletteOptions["primary"];
  }
}

// Update the Button's color options to include an custom palette option
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    backgroundColor: true;
  }
}

const palette: PaletteOptions = {
  primary: {
    main: "#5E38B5",
    light: "#FFFFFF",
    dark: "#09A548",
  },
  secondary: {
    main: "#242D35",
    light: "#EAECEE",
  },
  error: {
    main: "#f44336",
  },
  success: {
    main: "#30D38B",
    dark: "#F37736",
  },
  dark: {
    main: "#0C1116",
  },
  backgroundColor: {
    main: "#FAFAFA",
  },
};

export default palette;
