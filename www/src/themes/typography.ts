import { TypographyOptions } from "@mui/material/styles/createTypography";
import { Open_Sans, Lato, Cedarville_Cursive, DM_Sans, Gothic_A1, Nunito, Inter,  } from "next/font/google";

export const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const gothicA1 = Gothic_A1({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
})

export const cedarvilleCursive = Cedarville_Cursive({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900",],
  subsets: ["latin"],
  display: "swap"
})

export const nunito = Nunito(
  {
    weight: ["200", "400"],
    subsets: ["latin"],
    display: "swap"
  }
)

const typography: TypographyOptions = {
  fontFamily: openSans.style.fontFamily,
  h6: {
    fontSize: "1rem", // 16px
    lineHeight: "12px",
    fontWeight: "normal",
  },
  h5: {
    fontSize: "1.125rem", // 18px
    lineHeight: "20px",
    fontWeight: "600",
  },
  h4: {
    fontSize: "1.25rem", // 20px
    fontWeight: "bold",
    lineHeight: "25px",
  },
  h3: {
    fontSize: "1.5rem", // 24px
    fontWeight: 600,
    lineHeight: "36px",
  },
  h2: {
    fontSize: "2.5rem", // 40px
    lineHeight: "45px",
    fontWeight: "normal",
  },
  h1: {
    fontSize: "90px",
    fontWeight: 700,
  },
  subtitle1: {
    fontSize: "0.875rem",
    fontWeight: 400,
  },
  body1: {
    fontSize: "0.875rem", // 14px
    fontWeight: 400,
    lineHeight: "normal",
    color: "#242D35",
  },
  body2: {
    letterSpacing: "0em",
    fontWeight: 400,
    lineHeight: "1.5em",
  },
  button: {
    fontFamily: lato.style.fontFamily,
    fontWeight: 500,
    fontSize: "0.875rem",
    textTransform: "none",
  },
};
export default typography;
