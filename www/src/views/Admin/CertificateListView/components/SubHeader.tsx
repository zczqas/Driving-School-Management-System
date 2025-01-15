import React from "react";

// third party libraries
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";

// ==============================|| SUB HEADER ||============================== //

const SubHeader = ({ days, handleDaysChange, tabValue }: any) => {
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
        {tabValue === 1 ? (
          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            <Typography
              variant="h4"
              sx={{
                color: "var(--Gray-900, #0C1116)",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "100%",
              }}
            >
              Show users who have completed 6 drivers training hours in {" "}
            </Typography>
            <FormControl
              size="small"
              variant="outlined"
              sx={{
                minWidth: "73px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={days}
                onChange={handleDaysChange}
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "dark.main",
                  fontFamily: (theme) => theme.typography.button.fontFamily,
                  borderRadius: "32px",
                }}
              >
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="30">30</MenuItem>
              </Select>
            </FormControl>
            <Typography
              variant="h4"
              sx={{
                color: "var(--Gray-900, #0C1116)",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "100%",
              }}
            >
              {" "}
              days
            </Typography>
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
        ) : null}
      </Toolbar>
    </Box>
  );
};

export default SubHeader;
