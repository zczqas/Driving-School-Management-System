import AutocompleteWithDynamicSearch from "./component/AutoCompleteWithDynamicSearch";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { lato } from "@/themes/typography";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import { Field, FieldProps, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { DatePicker, TimeField, TimePicker } from "@/components/CustomInput";
import { InputFormLabel } from "@/views/Client/ProfileView/components/ProfileInformation/ProfileInformation";
import { useRouter } from "next/router";
import moment from "moment";
import {
  createAppointment,
  fetchAppointmentById,
  updateAppointment,
} from "@/store/appointment/appointment.actions";
import { useAppDispatch, useAppSelector } from "@/hooks";

import tableStyles from "../../../../Client/ProfileView/components/ProfileInformation/tableStyles.module.css";
import AutoCompleteCombobox from "./component/AutoComplete";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import IRootState from "@/store/interface";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

const AddEditDriverTrainingEducation = () => {
  const dispatch = useAppDispatch();
  const { appointmentById, appointmentByIdLoading, appointmentByIdError } =
    useAppSelector((state: IRootState) => state.appointment);
  const [selectedStudent, setSelectedStudent] = React.useState<any>({});
  const router = useRouter();
  const { id, student_id, first_name, last_name, phone, email } = router.query;

  const pathname = router.pathname;
  const pathArr = pathname.split("/");
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [isStudentSelected, setIsStudentSelected] = React.useState(false);

  const [isSubmittingForm, setIsSubmittingForm] = React.useState(false);

  React.useEffect(() => {
    if (id && pathArr[pathArr.length - 2] === "update") {
      setIsUpdate(true);
    }
  }, [id, pathArr]);

  React.useEffect(() => {
    if (isUpdate) {
      dispatch(fetchAppointmentById(id as string));
    }
  }, [isUpdate]);

  const styles = {
    root: {
      display: "flex",
      background: "#fff",
      flexDirection: "column",
      height: "100%",
      minHeight: "90vh",
    },
  };

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Box sx={styles.root}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 18px",
              }}
            >
              <Typography
                id="alert-dialog-title"
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  fontFamily: lato.style.fontFamily,
                }}
              >
                {isUpdate ? "Update" : "Add"} an Appointment
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ padding: "14px 18px" }}>
              <Box>
                <Typography
                  id="alert-dialog-title"
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    fontFamily: lato.style.fontFamily,
                    mb: 3,
                    mt: 4,
                  }}
                >
                  Driver Training Information
                </Typography>
                <Formik
                  initialValues={{
                    // Driver Training Information
                    studentId: null,
                    transaction_id: null,
                    date: "",
                    startTime: "",
                    endTime: "",
                    instructor: null,
                    lessons: { id: "", name: "", duration: "" },
                    selectedPackage: { id: "", lessons: [] },
                    vehicle: null,
                    pickupLocationType: { id: null, name: "" },
                    pickupLocation: "",
                    cityAbbreviation: null,
                    pickupLocationText: "",
                    note: "",
                    status: "active",
                  }}
                  // validationSchema={Yup.object().shape({})}
                  onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      setIsSubmittingForm(true);
                      console.log({ values });

                      const formData = {
                        package_id: values?.selectedPackage?.id ?? "",
                        student_id: values?.studentId
                          ? (values?.studentId as { user: { id: string } })
                              ?.user?.id
                          : "",
                        transaction_id: values?.transaction_id ?? "",
                        instructor_id: values?.instructor
                          ? (values?.instructor as { id: string }).id
                          : "",
                        appointment_date: values.date,
                        start_time: values.startTime,
                        end_time: moment(values.endTime).format("HH:mm"),
                        lesson_id: values.lessons?.id ?? "",
                        vehicle: values.vehicle
                          ? (values.vehicle as { brand: string }).brand
                          : "", // Type assertion
                        vehicle_id: values.vehicle
                          ? (values.vehicle as { id: string }).id
                          : "",
                        pickup_text: values.pickupLocationText,
                        note: values.note,
                        city_id: values.cityAbbreviation
                          ? (values.cityAbbreviation as { id: string }).id
                          : "",
                        status_id: 7,
                        pickup_location_type_id:
                          values.pickupLocationType?.id ?? "",
                      };
                      if (isUpdate) {
                        dispatch(
                          updateAppointment(id as string, formData, () => {
                            router.back();
                            // setSubmitting(false);
                          })
                        );
                      }
                      dispatch(
                        createAppointment(formData, () => {
                          router.back();
                          // setSubmitting(false);
                        })
                      );

                      // setSubmitting(false);
                      // setIsSubmittingForm(false);
                    } catch (error) {
                    } finally {
                      // setIsSubmittingForm(false);
                    }
                  }}
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
                    resetForm,
                  }) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    React.useEffect(() => {
                      if (selectedStudent?.user?.transaction?.length > 0) {
                        console.log(
                          "0th index of transaction",
                          selectedStudent.user.transaction[0]
                        );
                        setFieldValue(
                          "transaction_id",
                          selectedStudent?.user?.transaction[0]?.id
                        );
                      }
                    }, [selectedStudent]);

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    React.useEffect(() => {
                      setSelectedStudent(values.studentId);
                      if (values.studentId) {
                        setIsStudentSelected(true);
                      } else {
                        setIsStudentSelected(false);
                      }
                    }, [values.studentId]);

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    React.useEffect(() => {
                      setSelectedStudent(values.studentId);
                      // setFieldValue("lessons", {
                      //   id: "",
                      //   name: "",
                      //   duration: "",
                      // });
                    }, [values.studentId]);

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    React.useEffect(() => {
                      if (values.lessons?.id && values.startTime) {
                        setFieldValue(
                          "endTime",
                          moment(values.startTime, "HH:mm").add(
                            values.lessons?.duration,
                            "hour"
                          )
                        );
                      }
                    }, [values.lessons, values.startTime]);

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    React.useEffect(() => {
                      setFieldValue("studentId", appointmentById?.student);
                      setFieldValue("instructor", appointmentById?.instructor);
                      setFieldValue("lessons", appointmentById?.lesson);
                      setFieldValue("date", appointmentById?.appointment_date);
                      setFieldValue("startTime", appointmentById?.start_time);
                      setFieldValue("vehicle", appointmentById?.vehicle);
                      setFieldValue(
                        "pickupLocationText",
                        appointmentById?.pickup_text
                      );
                      setFieldValue("note", appointmentById?.note);
                    }, [appointmentById]);

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    React.useEffect(() => {
                      if (!isUpdate) {
                        resetForm();
                      }
                    }, [isUpdate]);

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    React.useEffect(() => {
                      if (selectedStudent?.user?.package?.length === 1) {
                        setFieldValue(
                          "selectedPackage",
                          selectedStudent?.user?.package[0]
                        );
                      } else {
                        setFieldValue("selectedPackage", null);
                      }
                    }, [selectedStudent]);

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    React.useEffect(() => {
                      console.log(values.pickupLocationType);
                      if (
                        values?.pickupLocationType?.id === 1 ||
                        values?.pickupLocationType?.name === "Home" ||
                        values?.pickupLocationType?.name === "home"
                      ) {
                        setFieldValue(
                          "pickupLocationText",
                          selectedStudent?.address
                        );
                      } else if (
                        values?.pickupLocationType?.id === 4 ||
                        values?.pickupLocationType?.name === "Alternate" ||
                        values?.pickupLocationType?.name === "alternate"
                      ) {
                        if (selectedStudent?.pickup_location?.length > 0) {
                          setFieldValue(
                            "pickupLocationText",
                            selectedStudent?.pickup_location[0]?.address ?? ""
                          );
                        } else {
                          setFieldValue("pickupLocationText", "");
                        }
                      } else if (values.pickupLocationType?.name) {
                        setFieldValue(
                          "pickupLocationText",
                          values.pickupLocationType?.name
                        );
                      } else {
                        setFieldValue("pickupLocationText", "");
                      }
                    }, [values.pickupLocationType]);

                    // If the form value changes after error, set isSubmittingForm to false
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    React.useEffect(() => {
                      console.log("isSubmittingForm", isSubmittingForm);
                      console.log("isSubmi", isSubmitting);
                      if (isSubmittingForm) {
                        setIsSubmittingForm(false);
                      }
                    }, [values]);

                    return (
                      <Form>
                        <Box sx={{ display: "flex" }}>
                          <Grid container spacing={2}>
                            <Grid container item xs={12} spacing={2}>
                              <Grid item xs={12} sm={4}>
                                <FormControl
                                  variant="standard"
                                  error={Boolean(
                                    touched.studentId && errors.studentId
                                  )}
                                  sx={{ width: "100%" }}
                                >
                                  <CustomLabel shrink htmlFor={"userId"}>
                                    Student :
                                  </CustomLabel>
                                  <AutocompleteWithDynamicSearch
                                    fieldName="studentId"
                                    endpoint="/profile/get/list"
                                    setFieldValue={setFieldValue}
                                    values={values}
                                    placeholder="Select Student"
                                    fetchedOptionsKey="profiles"
                                    getOptionLabel={(option: any) =>
                                      `${option?.user?.first_name} ${option?.user?.last_name}`
                                    }
                                    userRole="STUDENT"
                                    initialId={student_id as string}
                                    initialSearchTerm={`${first_name} ${last_name}`}
                                    disabled={student_id ? true : false}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <FormControl
                                  variant="standard"
                                  error={Boolean(touched.note && errors.note)}
                                  sx={{ width: "100%" }}
                                >
                                  <CustomLabel shrink htmlFor={"note"}>
                                    Packages of students:
                                  </CustomLabel>
                                  {selectedStudent?.user?.package?.length >
                                  1 ? (
                                    <AutoCompleteCombobox
                                      setFieldValue={setFieldValue}
                                      values={values}
                                      fieldName="selectedPackage"
                                      dataList={
                                        selectedStudent?.user?.package ?? []
                                      }
                                      getOptionLabel={(option: any) => {
                                        return `${option.name}`;
                                      }}
                                      placeholder="Select Packages"
                                    />
                                  ) : (
                                    <CustomInput
                                      value={
                                        selectedStudent?.user?.package?.[0]
                                          ?.name ??
                                        "No Package for this student"
                                      }
                                      // onBlur={handleBlur}
                                      // onChange={handleChange}
                                      rows={2}
                                      name="note"
                                      type="text"
                                      placeholder="Enter Packages"
                                      disabled
                                      sx={{
                                        "& .MuiInputBase-root": {
                                          height: "52px",
                                          borderRadius: "32px",
                                        },
                                        "& .MuiInputBase-input": {
                                          backgroundColor: "#F4F4F4",
                                        },
                                      }}
                                    />
                                  )}
                                </FormControl>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormControl
                                variant="standard"
                                error={Boolean(
                                  touched.lessons && errors.lessons
                                )}
                                sx={{ width: "100%" }}
                                disabled={!isStudentSelected}
                              >
                                <CustomLabel shrink htmlFor={"lessons"}>
                                  Lessons:
                                </CustomLabel>
                                {/* <AutocompleteWithDynamicSearch
                                  fieldName="lessons"
                                  endpoint="/lesson/get"
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  placeholder="Select Lessons"
                                  fetchedOptionsKey="lessons"
                                  getOptionLabel={(option: any) => option.name}
                                /> */}
                                <AutoCompleteCombobox
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  fieldName="lessons"
                                  disabled={!isStudentSelected}
                                  dataList={
                                    values?.selectedPackage?.lessons.filter(
                                      (option: any) =>
                                        !selectedStudent?.lesson_assigned?.includes(
                                          option?.id
                                        )
                                    ) ?? []
                                  }
                                  getOptionLabel={(option: any) => {
                                    if (option?.duration) {
                                      return `${option.name} - ${option.duration} hours`;
                                    } else {
                                      return `${option.name}`;
                                    }
                                  }}
                                  placeholder="Select Lessons"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <FormControl
                                variant="standard"
                                error={Boolean(touched.date && errors.date)}
                                sx={{ width: "100%" }}
                              >
                                <InputFormLabel id="date">Date:</InputFormLabel>
                                <DatePicker
                                  disablePast
                                  disabled={!isStudentSelected}
                                  name="date"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "52px",
                                      borderRadius: "32px",
                                    },
                                  }}
                                  value={
                                    values.date ? moment(values.date) : null
                                  }
                                  format="MM-DD-YYYY"
                                  onChange={(value: any) => {
                                    if (value?._isValid) {
                                      setFieldValue(
                                        "date",
                                        value.format("YYYY-MM-DD")
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <FormControl
                                variant="standard"
                                error={Boolean(
                                  touched.startTime && errors.startTime
                                )}
                                sx={{ width: "100%" }}
                                disabled={!isStudentSelected}
                              >
                                <InputFormLabel id="startTime">
                                  Start Time:
                                </InputFormLabel>
                                {/* <TimeField
                                  format="HH:mm"
                                  disablePast
                                  onChange={(value: any) => {
                                    if (value?._isValid) {
                                      setFieldValue(
                                        "startTime",
                                        value.format("HH:mm")
                                      );
                                    }
                                  }}
                                /> */}
                                <TimePicker
                                  name="startTime"
                                  value={moment(values?.startTime, "HH:mm")}
                                  timeSteps={{ minutes: 15 }}
                                  disabled={!isStudentSelected}
                                  onChange={(value: any) => {
                                    if (value?._isValid) {
                                      setFieldValue(
                                        "startTime",
                                        value.format("HH:mm")
                                      );
                                    }
                                  }}
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "52px",
                                      borderRadius: "32px",
                                    },
                                    "& ::-webkit-scrollbar": {
                                      width: "0.4em",
                                    },
                                    "& ::-webkit-scrollbar-track": {
                                      boxShadow:
                                        "inset 0 0 6px rgba(0,0,0,0.00)",
                                      webkitBoxShadow:
                                        "inset 0 0 6px rgba(0,0,0,0.00)",
                                    },
                                    "& ::-webkit-scrollbar-thumb": {
                                      backgroundColor: "rgba(0,0,0,.1)",
                                      outline: "1px solid slategrey",
                                    },
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <FormControl
                                variant="standard"
                                error={Boolean(
                                  touched.endTime && errors.endTime
                                )}
                                sx={{ width: "100%" }}
                              >
                                {/* <CustomLabel shrink htmlFor={"endTime"}>
                                  End Time:
                                </CustomLabel> */}
                                {/* <CustomInput
                                  value={
                                    values?.endTime? moment(values?.endTime).format("hh:mm A") :
                                    "hh:mm aa"
                                  }
                                  // onBlur={handleBlur}
                                  // onChange={handleChange}
                                  rows={2}
                                  name="note"
                                  type="text"
                                  placeholder="hh:mm aa"
                                  disabled
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      borderRadius: "32px",
                                      height: "52px",
                                    },
                                    "& .MuiInputBase-input": {
                                      backgroundColor: "#F4F4F4",
                                      textAlign: "center",
                                    },
                                  }}
                                /> */}
                                <InputFormLabel id="endTime">
                                  End Time:
                                </InputFormLabel>

                                <TimePicker
                                  name="endTime"
                                  value={moment(values?.endTime, "HH:mm")}
                                  timeSteps={{ minutes: 15 }}
                                  disabled={!isStudentSelected}
                                  onChange={(value: any) => {
                                    if (value?._isValid) {
                                      setFieldValue(
                                        "startTime",
                                        value.format("HH:mm")
                                      );
                                    }
                                  }}
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "52px",
                                      borderRadius: "32px",
                                    },
                                    "& ::-webkit-scrollbar": {
                                      width: "0.4em",
                                    },
                                    "& ::-webkit-scrollbar-track": {
                                      boxShadow:
                                        "inset 0 0 6px rgba(0,0,0,0.00)",
                                      webkitBoxShadow:
                                        "inset 0 0 6px rgba(0,0,0,0.00)",
                                    },
                                    "& ::-webkit-scrollbar-thumb": {
                                      backgroundColor: "rgba(0,0,0,.1)",
                                      outline: "1px solid slategrey",
                                    },
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormControl
                                variant="standard"
                                error={Boolean(
                                  touched.instructor && errors.instructor
                                )}
                                sx={{ width: "100%" }}
                              >
                                <CustomLabel shrink htmlFor={"instructor"}>
                                  Instructor:
                                </CustomLabel>
                                <AutocompleteWithDynamicSearch
                                  fieldName="instructor"
                                  endpoint="/user/get"
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  placeholder="Select Instructor"
                                  disabled={!isStudentSelected}
                                  fetchedOptionsKey="users"
                                  getOptionLabel={(option: any) =>
                                    `${option.first_name} ${option.last_name}`
                                  }
                                  userRole="INSTRUCTOR"
                                />
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <FormControl
                                variant="standard"
                                error={Boolean(
                                  touched.vehicle && errors.vehicle
                                )}
                                sx={{ width: "100%" }}
                              >
                                <CustomLabel shrink htmlFor={"vehicle"}>
                                  Vehicle:
                                </CustomLabel>

                                <AutocompleteWithDynamicSearch
                                  fieldName="vehicle"
                                  endpoint="/vehicle/get"
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  placeholder="Select Vehicle"
                                  disabled={!isStudentSelected}
                                  fetchedOptionsKey="vehicle"
                                  getOptionLabel={(option: any) =>
                                    `${option.brand} / ${option.model} / ${option.plate_number} / ${option.color} / ${option.year}  `
                                  }
                                  userRole="INSTRUCTOR"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormControl
                                variant="standard"
                                error={Boolean(
                                  touched.pickupLocationType &&
                                    errors.pickupLocationType
                                )}
                                sx={{ width: "100%" }}
                              >
                                <CustomLabel
                                  shrink
                                  htmlFor={"pickupLocationType"}
                                >
                                  Pickup Location:
                                </CustomLabel>

                                <AutocompleteWithDynamicSearch
                                  fieldName="pickupLocationType"
                                  endpoint="/pickup_location_type/get"
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  placeholder="Select pickup location"
                                  disabled={!isStudentSelected}
                                  fetchedOptionsKey="pickup_location_types"
                                  getOptionLabel={(option: any) => option.name}
                                  userRole="INSTRUCTOR"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormControl
                                variant="standard"
                                error={Boolean(
                                  touched.cityAbbreviation &&
                                    errors.cityAbbreviation
                                )}
                                sx={{ width: "100%" }}
                              >
                                <CustomLabel
                                  shrink
                                  htmlFor={"cityAbbreviation"}
                                >
                                  City Abbreviation:
                                </CustomLabel>

                                <AutocompleteWithDynamicSearch
                                  fieldName="cityAbbreviation"
                                  endpoint="/city/get"
                                  setFieldValue={setFieldValue}
                                  values={values}
                                  placeholder="Select city abbreviation"
                                  disabled={!isStudentSelected}
                                  fetchedOptionsKey="city"
                                  getOptionLabel={(option: any) =>
                                    `${option.name} ${option.city_abbreviation}`
                                  }
                                  userRole="INSTRUCTOR"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormControl
                                variant="standard"
                                error={Boolean(
                                  touched.pickupLocationText &&
                                    errors.pickupLocationText
                                )}
                                sx={{ width: "100%" }}
                              >
                                <CustomLabel
                                  shrink
                                  htmlFor={"pickupLocationText"}
                                >
                                  Pickup Location Text:
                                </CustomLabel>
                                <CustomInput
                                  value={values.pickupLocationText}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  name="pickupLocationText"
                                  type="text"
                                  placeholder="Enter Pickup Location text"
                                  disabled={!isStudentSelected}
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "52px",
                                      borderRadius: "32px",
                                    },
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                              <FormControl
                                variant="standard"
                                error={Boolean(touched.note && errors.note)}
                                sx={{ width: "100%" }}
                              >
                                <CustomLabel shrink htmlFor={"note"}>
                                  Note:
                                </CustomLabel>
                                <CustomInput
                                  value={values.note}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  rows={2}
                                  name="note"
                                  type="text"
                                  placeholder="Enter Note"
                                  disabled={!isStudentSelected}
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: "52px",
                                      borderRadius: "32px",
                                    },
                                  }}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            marginTop: "40px",
                            alignItems: "center",
                            gap: "20px",
                          }}
                        >
                          {" "}
                          <Button
                            disableElevation
                            disabled={isSubmitting || isSubmittingForm}
                            size="large"
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                              borderRadius: "100px",
                              padding: "12px 0",
                              textTransform: "none",
                              fontSize: "16px",
                              fontWeight: 700,
                              maxWidth: "175px",
                              width: "100%",
                            }}
                          >
                            Submit
                          </Button>
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
                            }}
                            onClick={() => {
                              router.push(
                                "/manage/driver-training-and-education"
                              );
                            }}
                          >
                            Cancel
                          </Button>
                          {/* <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <AddIcon color="primary" />
                            <Link href="#" style={{ fontWeight: "500" }}>
                              Add Another Appointment
                            </Link>
                          </Box> */}
                        </Box>
                      </Form>
                    );
                  }}
                </Formik>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={styles.root}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 18px",
              }}
            >
              <Typography
                id="alert-dialog-title"
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  fontFamily: lato.style.fontFamily,
                }}
              >
                Student Information
              </Typography>
            </Box>
            <Divider />
            <Box
              sx={{
                padding: "14px 18px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <table className={tableStyles.table}>
                <tr>
                  <td>Student Name:</td>
                  <td>
                    {selectedStudent?.user?.first_name ?? "-"}
                    {selectedStudent?.user?.last_name ?? ""}
                  </td>
                </tr>
                <tr>
                  <td>Phone Number:</td>
                  <td>
                    {selectedStudent?.cell_phone
                      ? formatPhoneNumber(selectedStudent?.cell_phone)
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td>Email Address:</td>
                  <td>{selectedStudent?.user?.email ?? "-"}</td>
                </tr>
              </table>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 18px",
              }}
            >
              <Typography
                id="alert-dialog-title"
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  fontFamily: lato.style.fontFamily,
                }}
              >
                Payment Information
              </Typography>
            </Box>
            <Divider />
            <Box
              sx={{
                padding: "14px 18px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid black", padding: "8px" }}>
                      Transaction Type
                    </th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>
                      Payment Amount
                    </th>
                    <th style={{ border: "1px solid black", padding: "8px" }}>
                      Payment Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent?.user?.transaction?.map(
                    (transaction: any) => (
                      <>
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            {transaction.method}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            $ {transaction.amount}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                            }}
                          >
                            {transaction.date_charged}
                          </td>
                        </tr>
                      </>
                    )
                  )}
                </tbody>
              </table>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddEditDriverTrainingEducation;
