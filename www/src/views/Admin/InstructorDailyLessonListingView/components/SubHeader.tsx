import React from "react";

// style + assets

// third party libraries
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { DatePicker } from "@/components/CustomInput";

// ==============================|| SUB HEADER ||============================== //

const styles = {
  tabsContainer: {
    minWidth: "645px",
    display: "flex",
    alignItems: "center",
  },
};

interface Props {
  title: string;
  subTitle: string;
  handleChangeDate: (date: string) => void;
  isInstructor: boolean; // checks if the user is an instructor
}

function calendarIcon() {
  return <img src="/icons/calendarIcon.svg" alt="calendar" />;
}

const SubHeader = ({
  title,
  subTitle,
  handleChangeDate,
  isInstructor = false,
}: Props) => {
  return (
    <Box
      sx={{
        background: "var(--Base-background-white, #FFF)",
        boxShadow: "0px -1px 0px 0px #F1F1F1 inset",
        padding: "20px 0",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        {/* <Box
          display={"flex"}
          flexDirection={"column"}
          minWidth={"330px"}
          sx={{ flex: 1 }}
        >
          <Typography sx={{ fontWeight: "600", fontSize: "24px" }}>
            {title}
          </Typography>
          <Typography
            sx={{ fontWeight: "400", fontSize: "14px", color: "#64748B" }}
          >
            {subTitle}
          </Typography>
        </Box> */}

        <Box display={"flex"} gap={"20px"} alignItems={"center"}>
          {isInstructor ? (
            <Box sx={{ display: "flex", gap: "2px", alignItems: "center" }}>
              <Typography sx={{ fontWeight: "600" }}>
                Appointment Date :{" "}
              </Typography>
              <DatePicker
                name="select-date"
                slots={{
                  openPickerIcon: calendarIcon,
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "32px",
                    backgroundColor: (theme) => theme.palette.common.white,
                    width: "150px",
                  },
                }}
                format="MM/DD/YYYY"
                onChange={(value: any) => {
                  if (value?._isValid) {
                    handleChangeDate(value.format("YYYY-MM-DD"));
                  }
                }}
              />
            </Box>
          ) : null}

          {/* <Box>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "32px",
                fontWeight: 600,
              }}
            >
              Go
            </Button>
          </Box> */}
          {/* <Box>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "32px",
                background: "#1E293B",
                fontWeight: 600,
              }}
              startIcon={
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/icons/downloadicon.svg"
                  alt="printer"
                  style={{ width: "14px" }}
                />
              }
            >
              Print Record
            </Button>
          </Box> */}
        </Box>
      </Toolbar>
    </Box>
  );
};

export default SubHeader;
