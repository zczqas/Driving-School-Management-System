import {
  DatePicker as MuiDatePicker,
  TimeField as MuiTimeField,
  TimePicker as MuiTimePicker,
} from "@mui/x-date-pickers";

import { InputBase, InputLabel, Select, styled } from "@mui/material";
import { lato } from "@/themes/typography";

export const DatePicker = styled(MuiDatePicker)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    borderRadius: "32px",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: theme.palette.secondary.light,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.secondary.light,
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: theme.palette.secondary.light,
  },
}));

export const CustomInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 35,
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
  },
  "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
    {
      "-webkit-appearance": "none",
      margin: 0,
    },
}));

export const CustomLabel = styled(InputLabel)(({ theme }) => ({
  color: "#242D35",
  fontSize: "16px",
  fontWeight: 500,
  fontFamily: lato.style.fontFamily,
  transform: "translate(0, 0) scale(1)",
  lineHeight: "22px",
  "&.Mui-focused": {
    color: "#242D35",
  },
}));

export const CustomSelect = styled(Select)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
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
    backgroundColor: "#fff",
    borderRadius: 35,
  },
  "& fieldset": {
    borderRadius: 35,
  },
}));

export const TimeField = styled(MuiTimeField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "52px",
    borderRadius: "32px",
  },
  "& .MuiInputBase-input": {
    textAlign: "center",
    fontFamily: lato.style.fontFamily,
    fontSize: "16px",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: theme.palette.secondary.light,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.secondary.light,
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: theme.palette.secondary.light,
  },
}));

export const TimePicker = styled(MuiTimePicker)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    borderRadius: "32px",
  },
  "& .MuiInputBase-input": {
    textAlign: "center",
    fontFamily: lato.style.fontFamily,
    fontSize: "16px",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: theme.palette.secondary.light,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.secondary.light,
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: theme.palette.secondary.light,
  },
}));
