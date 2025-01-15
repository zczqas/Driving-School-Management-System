import React from "react";

// third party libraries
import { Box, Button, Toolbar, Typography, styled } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";

// ==============================|| SUB HEADER ||============================== //

const SubHeader = ({ sortBy, handleSortChange }: any) => {
 
  const DatePicker = styled(MuiDatePicker)(({ theme }) => ({
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
  return (
      <Box
        sx={{
          background: "var(--Base-background-white, #FFF)",
          boxShadow: "0px -1px 0px 0px #F1F1F1 inset",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            <Typography variant="h4">Confirm Appointments for : </Typography>
            <DatePicker
              views={["month"]}
              slots={{ openPickerIcon: KeyboardArrowDownIcon }}
              sx={{ width: "120px" }}
            />
            <DatePicker
              views={["day"]}
              slots={{ openPickerIcon: KeyboardArrowDownIcon }}
              sx={{ width: "93px" }}
            />
            <DatePicker
              views={["year"]}
              slots={{ openPickerIcon: KeyboardArrowDownIcon }}
              sx={{ width: "100px" }}
            />
            <Button
              variant="contained"
              sx={{
                borderRadius: "32px",
                background: "#F37736",
              }}
            >
              Go
            </Button>
          </Box>

          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "32px",
              }}
            >
              Submit
            </Button>
          </Box>
        </Toolbar>
      </Box>
  );
};

export default SubHeader;
