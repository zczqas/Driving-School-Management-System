import React from "react";

// style + assets
import SearchIcon from "@mui/icons-material/Search";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// third party libraries
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CustomDialog from "./Dialog";
import { Formik } from "formik";
import * as Yup from "yup";
import { CustomInput, CustomLabel } from "@/views/Auth/components";
import { register } from "@/store/auth/auth.actions";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks";
import { useDispatch } from "react-redux";
import { fetchUsers } from "@/store/user/user.actions";

// ==============================|| SUB HEADER ||============================== //

const SubHeader = ({
  sortBy,
  handleSortChange,
  setSearchQuery,
  searchQuery,
  drivingSchools,
  statusFilter,
  setStatusFilter,
}: any) => {
  const router = useRouter();

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
                  minWidth: "200px",
                },
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Status:
            </Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "dark.main",
                  fontFamily: (theme) => theme.typography.button.fontFamily,
                  borderRadius: "32px",
                }}
                labelId="status-label"
                id="status-select"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FormControl
                fullWidth
                size="small"
                variant="outlined"
                sx={{
                  minWidth: "131px",
                }}
              >
                <CustomLabel id="driving-school-label">School: </CustomLabel>
                <Select
                  labelId="driving-school-label"
                  id="driving-school-select"
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
                  <MenuItem value="ALL" defaultChecked>
                    All
                  </MenuItem>
                  {drivingSchools?.drivingSchoolList?.length > 0 &&
                    drivingSchools?.drivingSchoolList?.map((school: any) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
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
              onClick={() => router.push("/manage/add-new-student")}
            >
              New Student
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </>
  );
};

export default SubHeader;
