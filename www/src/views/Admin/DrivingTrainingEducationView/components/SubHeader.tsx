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
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { CustomInput, CustomLabel, DatePicker } from "@/components/CustomInput";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks";
import { useDispatch } from "react-redux";
import { lato } from "@/themes/typography";
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
  sortBy,
  handleSortChange,
  setSearchQuery,
  searchQuery,
  handleChangeDate,
  handleClearDate,
  currentDate,
}: Props) => {
  function calendarIcon() {
    return <img src="/icons/calendarIcon.svg" alt="calendar" />;
  }
  const router = useRouter();
  // const [openDialog, setOpenDialog] = React.useState(false);

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  // const handleAcceptDialog = () => {
  //   setOpenDialog(false);
  // };
  return (
    <>
      {/* <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle="Add an Appointment"
        isFormikForm
        fullWidth
        maxWidth="lg"
      >
        <Formik
          initialValues={{
            // Driver Training Information
            date: "",
            startTime: "",
            endTime: "",
            instructor: "",
            lessons: "",
            vehicle: "",
            pickupLocation: "",
            cityAbbreviation: "",
            pickupLocationText: "",
            note: "",
            status: "active",
          }}
          validationSchema={Yup.object().shape({
            // date: Yup.string().required("Date is required"),
            // startTime: Yup.string().required("Start time is required"),
            // endTime: Yup.string().required("End time is required"),
            // instructor: Yup.string().required("Instructor is required"),
            // lessons: Yup.string().required("Lessons is required"),
            // vehicle: Yup.string().required("Vehicle is required"),
            // pickupLocation: Yup.string().required("Pickup location is required"),
            // cityAbbreviation: Yup.string().required("City abbreviation is required"),
            // pickupLocationText: Yup.string().required("Pickup location text is required"),
            // note: Yup.string().required("Note is required"),
            // status: Yup.string().required("Status is required"),
          })}
          onSubmit={async (
            values,
            { setErrors, setStatus, setSubmitting }
          ) => {}}
        >
          {({
            touched,
            errors,
            values,
            handleBlur,
            handleChange,
            isSubmitting,
            handleSubmit,
            setFieldValue,
          }) => {
            return (
              <Form>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid container spacing={2} maxWidth={"sm"}>
                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.date && errors.date)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"date"}>
                          Date:
                        </CustomLabel>
                        <CustomInput
                          id={"date"}
                          type={"text"}
                          value={values.date}
                          name={"date"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter lesson name"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.startTime && errors.startTime)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"startTime"}>
                          Start Time:
                        </CustomLabel>
                        <CustomInput
                          id={"startTime"}
                          type={"text"}
                          value={values.startTime}
                          name={"startTime"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter lesson name"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.endTime && errors.endTime)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"endTime"}>
                          End Time:
                        </CustomLabel>
                        <CustomInput
                          id={"endTime"}
                          type={"text"}
                          value={values.endTime}
                          name={"endTime"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter lesson name"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.instructor && errors.instructor)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"instructor"}>
                          Instructor:
                        </CustomLabel>
                        <CustomInput
                          id={"instructor"}
                          type={"text"}
                          value={values.instructor}
                          name={"instructor"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter lesson name"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      padding: "12px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "175px",
                      width: "100%",
                      mr: 2,
                    }}
                    onClick={() => handleCloseDialog()}
                  >
                    Cancel
                  </Button>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      padding: "12px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "175px",
                      width: "100%",
                    }}
                    onClick={() => handleSubmit()}
                  >
                    Add
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomDialog> */}
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
