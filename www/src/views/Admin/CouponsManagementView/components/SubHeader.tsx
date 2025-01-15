import React, { useEffect } from "react";

// style + assets
import SearchIcon from "@mui/icons-material/Search";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// third party libraries
import { Box, Button, InputAdornment, TextField, Toolbar } from "@mui/material";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks";

// ==============================|| SUB HEADER ||============================== //

const SubHeader = ({
  sortBy,
  handleSortChange,
  setSearchQuery,
  searchQuery,
  setOpenDialog,
}: any) => {
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
            {/* <TextField
              size="small"
              placeholder="Code"
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
            /> */}
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
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "32px",
              }}
              endIcon={<AddRoundedIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Coupon
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </>
  );
};

export default SubHeader;
