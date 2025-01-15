import { InputBase, InputLabel, Select, styled } from "@mui/material";
import { lato } from "@/themes/typography";

export const CustomInputTime = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 8,
    backgroundColor: "Input Box Stroke Thin",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    padding: "16px 27px",

    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    fontFamily: lato.style.fontFamily,
    fontSize: "16px",
    fontWeight: 500,
    width: "100px",
  },
  "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
    {
      "-webkit-appearance": "none",
      margin: 0,
    },
}));
