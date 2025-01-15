import { createTheme } from "@mui/material";
import palette from "./palette";
import typography from "./typography";
import componentStyleOverrides from "./compStyleOverride";
import { BreakpointOverrides } from "@mui/system";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true; // keep existing breakpoints
    sm: true;
    md: true;
    lg: true;
    xl: true;
    bigMd: true; // add your custom breakpoint
  }
}

// Create a theme instance.
const Theme = createTheme({
  palette,
  typography,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      bigMd: 1090,
      lg: 1280,
      xl: 1920,
    },
  },
  // components: {

  // },
});

Theme.components = componentStyleOverrides(Theme);

export default Theme;
