import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// third party libraries
import {
  Box,
  TextField,
  InputAdornment,
  Grid,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomDialog from "@/components/CustomDialog";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "@/hooks";
import {
  createUser,
  fetchUsers,
  updateInstructor,
  fetchInstructor,
  clearInstructor,
} from "@/store/user/user.actions";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import IRootState from "@/store/interface";

// ==============================|| SUB HEADER ||============================== //

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  selectedInstructor: any | null;
  setSelectedInstructor: (instructor: any | null) => void;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

const SubHeader = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedInstructor,
  setSelectedInstructor,
  openDialog,
  setOpenDialog,
}: Props) => {
  const dispatch = useAppDispatch();
  const { selectedInstructor: instructorData, selectedInstructorLoading } =
    useSelector((state: IRootState) => state.user);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInstructor(null);
    dispatch(clearInstructor());
  };

  useEffect(() => {
    if (selectedInstructor?.id && openDialog) {
      dispatch(fetchInstructor(selectedInstructor.id));
    }
  }, [selectedInstructor?.id, openDialog, dispatch]);

  return (
    <>
      {/* Add New Instructor Dialog */}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleCloseDialog}
        open={openDialog}
        dialogTitle={
          selectedInstructor ? "Update Instructor" : "Add New Instructor"
        }
        isFormikForm
      >
        {selectedInstructorLoading ? (
          <CircularProgress />
        ) : (
          <Formik
            enableReinitialize
            initialValues={{
              firstName: instructorData?.user?.first_name || "",
              lastName: instructorData?.user?.last_name || "",
              email: instructorData?.user?.email || "",
              password: "",
              confirmPassword: "",
              phoneNumber: instructorData?.profile?.cell_phone || "",
              role: instructorData?.user?.role || "INSTRUCTOR",
              school: [],
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              password: selectedInstructor
                ? Yup.string().max(255)
                : Yup.string().max(255).required("Password is required"),
              confirmPassword: selectedInstructor
                ? Yup.string()
                    .oneOf([Yup.ref("password")], "Passwords must match")
                    .max(255)
                : Yup.string()
                    .oneOf([Yup.ref("password")], "Passwords must match")
                    .max(255)
                    .required("Confirm Password is required"),
              firstName: Yup.string()
                .max(255)
                .required("First Name is required"),
              lastName: Yup.string().max(255).required("Last Name is required"),
              phoneNumber: Yup.string()
                .matches(
                  /^\d{3}-\d{3}-\d{4}$/,
                  "Phone number must be in the format 123-456-7890"
                )
                .required("Phone Number is required"),
              role: Yup.string()
                .oneOf(["INSTRUCTOR", "CSR", "STUDENT"], "Invalid role")
                .required("Role is required"),
            })}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              try {
                const formData = {
                  first_name: values.firstName,
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
                  address: "string",
                };

                if (selectedInstructor) {
                  dispatch(
                    updateInstructor(selectedInstructor.id, formData, () => {
                      setOpenDialog(false);
                      setSelectedInstructor(null);
                      dispatch(
                        fetchUsers(
                          "INSTRUCTOR",
                          0,
                          10,
                          searchQuery,
                          undefined,
                          undefined,
                          statusFilter === "active"
                        )
                      );
                    })
                  );
                } else {
                  dispatch(
                    createUser(formData, () => {
                      setOpenDialog(false);
                      dispatch(fetchUsers("INSTRUCTOR"));
                    })
                  );
                }
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
                        error={Boolean(
                          touched.phoneNumber && errors.phoneNumber
                        )}
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
                        error={Boolean(touched.role && errors.role)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel
                          shrink
                          htmlFor="role-select"
                          variant="standard"
                        >
                          Role*
                        </CustomLabel>
                        <Select
                          id="role-select"
                          value={values.role}
                          label="Role"
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
                          <MenuItem value={"STUDENT"}>Student</MenuItem>
                        </Select>
                        {touched.role && errors.role && (
                          <FormHelperText error>{errors.role as string}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {!selectedInstructor && (
                      <>
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
                            <CustomLabel
                              shrink
                              htmlFor="confirmPassword-signup"
                            >
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
                      </>
                    )}
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
                      onClick={handleCloseDialog}
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
                      {selectedInstructor ? "Update" : "Create"}
                    </Button>
                  </Box>
                </form>
              );
            }}
          </Formik>
        )}
      </CustomDialog>
      <Box
        sx={{
          background: "var(--Base-background-white, #FFF)",
          boxShadow: "0px -1px 0px 0px #F1F1F1 inset",
          padding: "20px 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: "24px",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search by Name or Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "32px",
                  width: "300px",
                },
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500, ml: 2 }}>
              Status :
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
          <Button
            disableElevation
            size="large"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "100px",
              padding: "12px 0",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 700,
              maxWidth: "190px",
              width: "100%",
            }}
            onClick={() => setOpenDialog(true)}
          >
            Add New Instructor
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SubHeader;
