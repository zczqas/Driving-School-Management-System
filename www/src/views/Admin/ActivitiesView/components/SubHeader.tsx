import React from "react";

// style + assets
import SearchIcon from "@mui/icons-material/Search";

// third party libraries
import {
  Box,
  Button,
  InputAdornment,
  SelectChangeEvent,
  TextField,
  Toolbar,
} from "@mui/material";

import { DatePicker } from "@/components/CustomInput";
import { useRouter } from "next/router";
import moment from "moment";

// ==============================|| SUB HEADER ||============================== //

interface Props {
  sortBy: string;
  handleSortChange: (event: SelectChangeEvent) => void;
  setSearchQuery: (value: string) => void;
  searchQuery: string;
  handleChangeDate: (date: string) => void;
  handleClearDate: () => void;
  currentDate: string;
}

const SubHeader = ({
  setSearchQuery,
  searchQuery,
  handleChangeDate,
  handleClearDate,
  currentDate,
}: Props) => {
  function calendarIcon() {
    return <img src="/icons/calendarIcon.svg" alt="calendar" />;
  }

  return (
    <>
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
            <TextField
              size="small"
              placeholder="Name or Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "32px",
                },
              }}
            />
            {/* Filters will be implemented later */}
            {/* <TextField
              size="small"
              placeholder="City"
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: "32px",
                  maxWidth: "130px",
                },
              }}
            />
            <TextField
              size="small"
              placeholder="State"
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: "32px",
                  maxWidth: "135px",
                },
              }}
            />

            <Button
              variant="outlined"
              size="small"
              sx={{
                minHeight: 38,
                borderRadius: "32px",
                borderColor: "secondary.light",
                color: "var(--Gray-900, #0C1116)",
                minWidth: 122,
              }}
              endIcon={<FilterListRoundedIcon />}
            >
              More filter
            </Button>

            <Button
              variant="contained"
              color="backgroundColor"
              sx={{
                background: "primary.light",
                border: "1px solid #EAECEE",
                boxShadow: "none",
                color: "#111",
                borderRadius: "32px",
                "&.Mui-disabled": {
                  background: "var(--Gray-50, #FAFAFA)",
                },
              }}
              disabled
            >
              Clear All Filter
            </Button> */}
            <Box>
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
                value={currentDate ? moment(currentDate, "YYYY-MM-DD") : null}
              />
              <Button variant="text" onClick={handleClearDate}>
                Clear Date
              </Button>
            </Box>
          </Box>

          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            {/* <FormControl
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                minWidth: "131px",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sortBy}
                onChange={handleSortChange}
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "dark.main",
                  fontFamily: (theme) => theme.typography.button.fontFamily,
                  borderRadius: "32px",
                }}
              >
                <MenuItem value="Sort by Date">Sort by date</MenuItem>
                <MenuItem value="Sort by Name">Sort by name</MenuItem>
              </Select>
            </FormControl> */}
            {/* <Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: "32px",
                }}
                endIcon={<AddRoundedIcon />}
                onClick={() =>
                  router.push("/manage/driver-training-and-education/create")
                }
              >
                Add an Appointment
              </Button>
            </Box> */}
          </Box>
        </Toolbar>
      </Box>
    </>
  );
};

export default SubHeader;
