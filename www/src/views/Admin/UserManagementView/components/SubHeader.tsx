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
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CustomDialog from "@/components/CustomDialog";
import { Formik } from "formik";
import * as Yup from "yup";
import { CustomInput, CustomLabel } from "@/views/Auth/components";
import { register } from "@/store/auth/auth.actions";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks";
import { useDispatch } from "react-redux";
import { createUser, fetchUsers } from "@/store/user/user.actions";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

// ==============================|| SUB HEADER ||============================== //

interface Props {
  sortBy: string;
  handleSortChange: (event: SelectChangeEvent) => void;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const SubHeader = ({
  sortBy,
  handleSortChange,
  setSearchQuery,
  // setFieldValue,
  searchQuery,
  statusFilter,
  setStatusFilter,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle="Add New User"
        isFormikForm
      >
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            role: "INSTRUCTOR",
            school: [],
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Must be a valid email")
              .max(255)
              .required("Email is required"),
            password: Yup.string().max(255).required("Password is required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password")], "Passwords must match")
              .max(255)
              .required("Confirm Password is required"),
            firstName: Yup.string().max(255).required("First Name is required"),
            lastName: Yup.string().max(255).required("Last Name is required"),
            phoneNumber: Yup.string()
              .matches(
                /^\d{3}-\d{3}-\d{4}$/,
                "Phone number must be in the format 123-456-7890"
              )
              .required("Phone Number is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              const formData = {
                first_name: values.firstName,
                // middle_name: "string",
                last_name: values.lastName,
                email: values.email,
                password: values.password,
                role: values.role,
                cell_phone: values.phoneNumber,
                apartment: "string",
                city: "string",
                state: "string",
                gender: "MALE",
                dob: "2024-02-28",
                // school: [localStorage.getItem("selectedSchool")],
                address: "string",
              };
              dispatch(
                createUser(formData, () => {
                  setOpenDialog(false);
                  dispatch(fetchUsers("ALL"));
                })
              );
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setSubmitting(false);
            }
          }}
        >
          {({
            touched,
            errors,
            values,
            handleBlur,
            handleChange,
            setFieldValue,
            isSubmitting,
            handleSubmit,
          }) => {
            const handlePhoneNumberChange =
              (setFieldValue: any, fieldName: any) => (event: any) => {
                const cleaned = event.target.value.replace(/\D/g, "");

                if (cleaned.length <= 10) {
                  const formattedPhoneNumber = formatPhoneNumber(cleaned);
                  setFieldValue(fieldName, formattedPhoneNumber);
                }
              };

            const handlePhoneNumberBlur =
              (setFieldValue: any, fieldName: any) => (event: any) => {
                const cleaned = event.target.value.replace(/\D/g, "");
                if (cleaned.length !== 10) {
                  setFieldValue(fieldName, cleaned);
                }
              };
            return (
              <form>
                {" "}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.firstName && errors.firstName)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="firstName-signup">
                        First Name *
                      </CustomLabel>
                      <CustomInput
                        id="firstName-signup"
                        type="text"
                        value={values.firstName}
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.lastName && errors.lastName)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="lastName-signup">
                        Last Name *
                      </CustomLabel>
                      <CustomInput
                        id="lastName-signup"
                        type="text"
                        value={values.lastName}
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.email && errors.email)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="email-signup">
                        Email *
                      </CustomLabel>
                      <CustomInput
                        id="email-signup"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="phoneNumber-signup">
                        Phone Number *
                      </CustomLabel>
                      <CustomInput
                        id="phoneNumber-signup"
                        type="text"
                        value={values.phoneNumber}
                        name="phoneNumber"
                        onBlur={handlePhoneNumberBlur(
                          setFieldValue,
                          "phoneNumber"
                        )}
                        onChange={handlePhoneNumberChange(
                          setFieldValue,
                          "phoneNumber"
                        )}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.password && errors.password)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="password-signup">
                        Password *
                      </CustomLabel>
                      <CustomInput
                        id="password-signup"
                        type="password"
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="confirmPassword-signup">
                        Confirm Password *
                      </CustomLabel>
                      <CustomInput
                        id="confirmPassword-signup"
                        type="password"
                        value={values.confirmPassword}
                        name="confirmPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.role && errors.role)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel
                        shrink
                        htmlFor="confirmPassword-signup"
                        variant="standard"
                      >
                        Role*
                      </CustomLabel>
                      <Select
                        id="role-select"
                        value={values.role}
                        label="Age"
                        fullWidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="role"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "dark.main",
                          fontFamily: (theme) =>
                            theme.typography.button.fontFamily,
                          borderRadius: "32px",
                          height: "43px",
                        }}
                      >
                        <MenuItem value={"INSTRUCTOR"}>Instructor</MenuItem>
                        <MenuItem value={"CSR"}>CSR</MenuItem>
                      </Select>
                      {touched.role && errors.role && (
                        <FormHelperText>{errors.role}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "40px",
                    gap: 2,
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
                      maxWidth: "120px",
                      width: "100%",
                    }}
                    onClick={() => {
                      setOpenDialog(false);
                    }}
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
                      maxWidth: "120px",
                      width: "100%",
                    }}
                    onClick={() => handleSubmit()}
                  >
                    Create
                  </Button>
                </Box>
              </form>
            );
          }}
        </Formik>
      </CustomDialog>
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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            </Box>
          </Box>

          <Box display={"flex"} gap={"20px"} alignItems={"center"}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "32px",
              }}
              endIcon={<AddRoundedIcon />}
              onClick={() => setOpenDialog(true)}
            >
              New User
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </>
  );
};

export default SubHeader;
