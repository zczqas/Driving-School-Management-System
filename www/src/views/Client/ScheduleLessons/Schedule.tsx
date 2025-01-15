import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { lato } from "@/themes/typography";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import {
  CustomInput,
  CustomLabel,
  CustomSelect as Select,
} from "@/components/CustomInput";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useRouter } from "next/router";
import IRootState from "@/store/interface";
import { fetchUserDetailsById } from "@/store/user/user.actions";
import {
  fetchAppointmentByAppointmentId,
  fetchPickupLocationTypes,
} from "@/store/schedule/schedule.actions";
import withEmailVerification from "@/components/WithEmailVerification";
import { decrypt, encrypt } from "@/utils/encryptAndDecrypt";
import axiosInstance from "@/config/axios.config";
import AutocompleteWithDynamicSearch from "./components/AutoComplete";
import { updateAppointmentStatus } from "@/store/appointment/appointment.actions";
import { openAlert } from "@/store/alert/alert.actions";
import useIsMobile from "@/hooks/useIsMobile";
import _ from "lodash";

const Schedule = withEmailVerification(() => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { student_id, first_name, last_name, isEdit, appointment_id, data } =
    router.query;
  const dispatch = useAppDispatch();
  const [filteredLessons, setFilteredLessons] = useState<any[]>([]);

  const { currentUser } = useAppSelector((state: IRootState) => state.auth);
  const {
    userDetailsById: { details: detailsById, loading: loadingById },
  } = useAppSelector((store) => store?.user);
  const { pickupLocationTypes, appointmentById } = useAppSelector(
    (state: IRootState) => state.schedule
  );

  useEffect(() => {
    if (student_id) {
      dispatch(fetchUserDetailsById(student_id as string));
    } else if (currentUser?.user?.role === "STUDENT") {
      dispatch(fetchUserDetailsById(currentUser?.user?.id));
    }

    // Fetch pickup location types when component mounts
    dispatch(fetchPickupLocationTypes());
  }, [student_id, dispatch]);

  useEffect(() => {
    if (Boolean(isEdit) && appointment_id) {
      dispatch(fetchAppointmentByAppointmentId(appointment_id));
    }
  }, [isEdit]);

  console.log({ detailsById, student_id });

  const [parsedData, setParsedData] = useState<any>(null);

  // handle coming back from schedule appointment page
  useEffect(() => {
    if (data) {
      const decryptData = async () => {
        const decryptedData = await decrypt(data as string);
        setParsedData(decryptedData);
      };
      decryptData();
    }
  }, [data]);

  // function to filter out already scheduled lessons
  const filterOutAlreadyScheduledLessons = (lessons: any[]) => {
    return lessons.filter(
      (lesson: any) =>
        !detailsById?.profile?.scheduled_lesson?.includes(lesson.id)
    );
  };

  const [status, setStatus] = useState<any>(null);

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          background: "#fff",
          flexDirection: "column",
          height: "100%",
          minHeight: "90vh",
        }}
      >
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
            {isEdit ? "Edit" : "Add"} Appointment Schedule
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: "14px 18px", display: "flex" }}>
          <Box sx={{ width: "100%", maxWidth: "1000px" }}>
            <Formik
              initialValues={{
                userId:
                  currentUser?.user?.role === "STUDENT" || !!student_id
                    ? {
                        id:
                          currentUser?.user?.role === "STUDENT"
                            ? currentUser?.user?.id
                            : student_id ?? null,
                        first_name:
                          currentUser?.user?.role === "STUDENT"
                            ? currentUser?.user?.first_name
                            : first_name ?? detailsById?.first_name ?? "",
                        last_name:
                          currentUser?.user?.role === "STUDENT"
                            ? currentUser?.user?.last_name
                            : last_name ?? detailsById?.last_name ?? "",
                        package: null,
                      }
                    : {
                        id: null,
                        first_name: "",
                        last_name: "",
                        package: null,
                      },
                lessonId: "",
                packageId: "",
                pickup_location_type_id: "",
                pickupLocationText: "",
                notes: "",
              }}
              validationSchema={Yup.object({
                lessonId: Yup.string().required("Lesson is required"),
                packageId: Yup.string().required("Package is required"),
                pickup_location_type_id: Yup.string().required(
                  "Pickup Location is required"
                ),
                // status: Yup.string().required("Status is required"),
              })}
              onSubmit={async (values, { setSubmitting }) => {
                const handleSubmitForm = async () => {
                  const selectedPickupLocationType = pickupLocationTypes.find(
                    (type: any) => type.id === values.pickup_location_type_id
                  );

                  const formData: any = {
                    student_id: detailsById?.user?.id,
                    lesson_id: values?.lessonId || undefined,
                    package_id: values?.packageId || undefined,
                    pickup_location_type_id:
                      values.pickup_location_type_id || undefined,
                    pickup_location_type_name:
                      selectedPickupLocationType?.name || undefined,
                    pickup_location_text: values.pickupLocationText,
                    notes: values.notes,
                  };

                  // Remove undefined properties
                  Object.keys(formData).forEach((key) => {
                    if (formData[key] === undefined || formData[key] === null) {
                      delete formData[key];
                    }
                  });
                  const formDataToken = await encrypt(formData);
                  const appointmentByIdToken = await encrypt(
                    appointmentById || {}
                  );

                  router.push({
                    pathname: "/manage/schedule-lessons-appointment",
                    query: {
                      data: formDataToken,
                      first_name: first_name,
                      last_name: last_name,
                      ...(appointmentById &&
                        Boolean(isEdit) && {
                          isEdit: true,
                          appointment_id: appointmentById?.id,
                        }),
                    },
                  });
                };

                await handleSubmitForm();
                setSubmitting(false);
              }}
            >
              {({
                touched,
                errors,
                values,
                handleBlur,
                handleChange,
                isSubmitting,
                setFieldValue,
              }) => {
                // Handle Status Change
                useEffect(() => {
                  if (
                    appointmentById &&
                    status?.id &&
                    appointmentById?.status?.id !== status?.id
                  ) {
                    // setFieldValue("status", appointmentById?.status);
                    dispatch(
                      updateAppointmentStatus(
                        appointmentById?.id,
                        status?.id as string,
                        () => {
                          dispatch(
                            openAlert("Status updated successfully", "success")
                          );
                        }
                      )
                    );
                  }
                }, [status]);

                // Auto-select package if there's only one available
                useEffect(() => {
                  const offlinePackages = detailsById?.user?.package?.filter(
                    (pkg: any) => pkg.package_type === "OFFLINE"
                  );

                  if (offlinePackages?.length === 1 && !isEdit) {
                    setFieldValue("packageId", offlinePackages[0].id);
                  }
                }, [detailsById?.user?.package, isEdit, setFieldValue]);

                // handle previous data starts
                useEffect(() => {
                  console.log("parsedData", parsedData);
                  if (parsedData) {
                    // fetchPackageFromPackageId(parsedData?.package_id);
                    setFieldValue("packageId", parsedData?.package_id);
                    setFieldValue("lessonId", parsedData?.lesson_id);
                    setFieldValue(
                      "pickup_location_type_id",
                      parsedData?.pickup_location_type_id
                    );
                    setFieldValue("notes", parsedData?.notes);
                  }
                }, [parsedData]);

                // handle previous data ends

                // handle isEdit
                useEffect(() => {
                  if (appointmentById) {
                    setFieldValue(
                      "pickup_location_type_id",
                      appointmentById?.pickup_location_type_id
                    );
                    setFieldValue("packageId", appointmentById?.package_id);
                    setFieldValue("notes", appointmentById?.notes);
                    setFieldValue("lessonId", appointmentById?.lesson_id);
                    setFilteredLessons(
                      filterOutAlreadyScheduledLessons(
                        appointmentById?.package?.lessons || []
                      )
                    );
                    setStatus(
                      appointmentById?.status ? appointmentById?.status : ""
                    );
                  }
                }, [appointmentById]);

                // Handle package selection and update lessons accordingly
                const handlePackageChange = (e: any) => {
                  const selectedPackageId = e.target.value;
                  setFieldValue("packageId", selectedPackageId);

                  const selectedPackage = detailsById?.user?.package?.find(
                    (pkg: any) => pkg.id === selectedPackageId
                  );
                  setFilteredLessons(
                    filterOutAlreadyScheduledLessons(
                      selectedPackage?.lessons || []
                    )
                  );
                };

                useEffect(() => {
                  if ((values?.packageId, detailsById) && !loadingById) {
                    const selectedPackage = detailsById?.user?.package?.find(
                      (pkg: any) => pkg.id === values?.packageId
                    );
                    setFilteredLessons(
                      filterOutAlreadyScheduledLessons(
                        selectedPackage?.lessons || []
                      )
                    );
                  }
                }, [values?.packageId, detailsById]);

                // handle pickup location type change
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                  const pickupTypeId = values.pickup_location_type_id;
                  if (pickupTypeId && pickupLocationTypes && detailsById) {
                    const selectedType = pickupLocationTypes.find(
                      (type: any) => type.id === pickupTypeId
                    );
                    const typeName = selectedType?.name?.toLowerCase();

                    if (typeName === "home") {
                      setFieldValue(
                        "pickupLocationText",
                        detailsById?.profile?.address || ""
                      );
                      if (!detailsById?.profile?.address) {
                        dispatch(
                          openAlert(
                            "Please update city in student profile to continue",
                            "error"
                          )
                        );
                      }
                    } else if (typeName === "alternate") {
                      if (detailsById?.profile?.pickup_location?.length > 0) {
                        setFieldValue(
                          "pickupLocationText",
                          detailsById?.profile?.pickup_location[0]?.address ||
                            ""
                        );
                      } else {
                        setFieldValue("pickupLocationText", "");
                      }
                    } else if (selectedType) {
                      setFieldValue("pickupLocationText", selectedType.name);
                    } else {
                      setFieldValue("pickupLocationText", "");
                    }
                  }
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [
                  values.pickup_location_type_id,
                  setFieldValue,
                  pickupLocationTypes,
                  detailsById,
                ]);

                return (
                  <Form>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Grid container spacing={2}>
                        {currentUser?.user?.role !== "STUDENT" && (
                          <Grid item xs={12} md={6}>
                            <FormControl
                              variant="standard"
                              sx={{ width: "100%" }}
                            >
                              <CustomLabel shrink htmlFor={"student"}>
                                Student:
                              </CustomLabel>
                              <CustomInput
                                id={"student"}
                                type={"text"}
                                value={`${first_name} ${last_name}`}
                                name={"student"}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                                placeholder="Enter Student Name"
                                disabled
                              />
                            </FormControl>
                          </Grid>
                        )}

                        <Grid item xs={12} md={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(
                              touched.packageId && errors.packageId
                            )}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"packageId"}>
                              Packages of Students:
                            </CustomLabel>

                            <Field
                              fullWidth
                              id="packageId"
                              name="packageId"
                              variant="outlined"
                              color="primary"
                              as={Select}
                              placeholder="Select Package"
                              onChange={handlePackageChange}
                            >
                              <MenuItem value="" disabled>
                                Select Package
                              </MenuItem>
                              {detailsById?.user?.package
                                ?.filter(
                                  (pkg: any) => pkg.package_type === "OFFLINE"
                                )
                                .map((pkg: any) => (
                                  <MenuItem key={pkg.id} value={pkg.id}>
                                    {pkg.name}
                                  </MenuItem>
                                ))}
                            </Field>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(touched.lessonId && errors.lessonId)}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"lessonId"}>
                              Lessons:
                            </CustomLabel>
                            <Field
                              fullWidth
                              id="lessonId"
                              name="lessonId"
                              variant="outlined"
                              color="primary"
                              as={Select}
                              placeholder="Select Lesson"
                              value={values.lessonId}
                              onChange={handleChange}
                            >
                              {_.isNull(filteredLessons) ? (
                                <MenuItem value="" disabled>
                                  No Lessons Available for the package
                                </MenuItem>
                              ) : (
                                <MenuItem value="" disabled>
                                  Select Lesson
                                </MenuItem>
                              )}
                              {filteredLessons?.map((lesson: any) => (
                                <MenuItem key={lesson.id} value={lesson.id}>
                                  {lesson.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(
                              touched.pickup_location_type_id &&
                                errors.pickup_location_type_id
                            )}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel
                              shrink
                              htmlFor={"pickup_location_type_id"}
                            >
                              Pickup Location:
                            </CustomLabel>
                            <Field
                              fullWidth
                              id="pickup_location_type_id"
                              name="pickup_location_type_id"
                              variant="outlined"
                              color="primary"
                              as={Select}
                              placeholder="Select Pickup Location"
                              value={values.pickup_location_type_id}
                              onChange={handleChange}
                            >
                              <MenuItem value="" disabled>
                                Select Pickup Location
                              </MenuItem>
                              {pickupLocationTypes?.map((type: any) => (
                                <MenuItem key={type.id} value={type.id}>
                                  {type.name}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          {(values.pickup_location_type_id !== "alternate" ||
                            currentUser?.profile?.pickup_location?.length >
                              0) && (
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
                                id={"pickupLocationText"}
                                type={"text"}
                                value={values.pickupLocationText}
                                name={"pickupLocationText"}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                                placeholder="Enter Location"
                                // disabled
                              />
                            </FormControl>
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl
                            variant="standard"
                            error={Boolean(touched.notes && errors.notes)}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"notes"}>
                              Notes:
                            </CustomLabel>
                            <CustomInput
                              multiline
                              id={"notes"}
                              type={"text"}
                              value={values.notes}
                              name={"notes"}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              inputProps={{}}
                              placeholder="Enter Notes"
                              rows={4}
                            />
                          </FormControl>
                        </Grid>

                        {isEdit && status && (
                          <Grid item xs={12}>
                            <Typography
                              sx={{
                                fontFamily: lato.style.fontFamily,
                                fontWeight: 500,
                              }}
                            >
                              Change Status:
                            </Typography>
                            <Box sx={{ minWidth: "200px" }}>
                              <AutocompleteWithDynamicSearch
                                endpoint="/appointment_schedule/status/get"
                                status={status}
                                setStatus={setStatus}
                                placeholder="Select Status"
                                fetchedOptionsKey="appointment_schedule_status"
                              />
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        marginTop: isMobile ? "40px" : "140px",
                        marginBottom: "20px",
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
                        onClick={() => {
                          if (student_id) {
                            router.push(
                              `/manage/profile/${student_id}?tabValue=2`
                            );
                          } else {
                            router.push("/manage/profile");
                          }
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
                          maxWidth: "175px",
                          width: "100%",
                        }}
                        type="submit"
                      >
                        Next
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </Box>
    </Container>
  );
});

export default Schedule;
