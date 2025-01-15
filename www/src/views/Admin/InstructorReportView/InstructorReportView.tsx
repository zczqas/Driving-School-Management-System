import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";
import { useRouter } from "next/router";
import {
  fetchAppointmentOfPayPeriod,
  fetchAppointmentsByDate,
} from "@/store/appointment/appointment.actions";
import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import {
  CustomLabel,
  CustomSelect,
  DatePicker,
} from "@/components/CustomInput";

import { Field, Form, Formik } from "formik";
import AutocompleteWithDynamicSearch from "./components/AutoCompleteWithDynamicSearch";

// import chunkArray from "@/utils/chunkarray";
import * as Yup from "yup";

import { fetchTrainingLogsByUserIdAndLessonId } from "@/store/user/user.actions";
import moment from "moment";
import InstructorReportTable from "./components/InstructorReportTable";
import getBiweeklyMondays from "@/utils/getBiweeklyMondays";
import formatTimeToTwelveHours from "@/utils/formattime";

/**
 *
 * @returns - It is a view for Instructor Report / Schedule
 */

const InstructorReportView = () => {
  const router = useRouter();
  const { date, instructor_id, instructor_name } = router.query;
  const [currentDate, setCurrentDate] = React.useState<string>(
    (date as string) ?? new Date().toISOString().split("T")[0]
  );
  const biweeklyDates = getBiweeklyMondays();
  const [dateChanged, setDateChanged] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { appointmentByPayPeriod, appointmentByPayPeriodLoading } =
    useAppSelector((state: IRootState) => state.appointment);

  const { user: currentUser } = useAppSelector(
    (state: IRootState) => state.auth.currentUser
  );

  React.useEffect(() => {
    if (date !== currentDate) {
      router.replace(
        `/manage/instructor-report?date=${currentDate}&instructor_id=${instructor_id}&instructor_name=${instructor_name}`,
        undefined,
        { shallow: true }
      );
    }
  }, [currentDate, instructor_id]);

  React.useEffect(() => {
    if (currentDate && instructor_id) {
      dispatch(
        fetchAppointmentOfPayPeriod(
          currentDate,
          instructor_id as string,
          0,
          100
        )
      );
    }
  }, [date, instructor_id]);

  React.useEffect(() => {
    if ((!date || !instructor_id) && currentUser?.role !== "INSTRUCTOR") {
      // router.push("/404");
    }
  }, []);

  // // To handle the case when user is instructor and he is redirected to his own page
  React.useEffect(() => {
    console.log("currentUser", currentUser);
    if (currentUser?.role === "INSTRUCTOR") {
      router.replace(
        `/manage/instructor-report?date=${currentDate}&instructor_id=${currentUser?.id}&instructor_name=${currentUser?.first_name} ${currentUser?.last_name}`,
        undefined,
        { shallow: true }
      );
    }
  }, []);

  return (
    <Fragment>
      {/* =========loading backdrop========== */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={appointmentByPayPeriodLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {currentUser?.role === "INSTRUCTOR" ? null : (
        <Box>
          {/* ======== Change Instructor Filter form ========== */}
          <Formik
            initialValues={{
              paymentPeriodStartDate: "",
              instructor: null,
            }}
            // validationSchema={Yup.object().shape({
            //   lessonDate: Yup.string().required("Required"),
            //   instructor: Yup.object().required("Required"),
            // })}
            onSubmit={(values) => {
              console.log(values);
              router.push(
                `/manage/instructor-report/?date=${
                  currentDate ? currentDate : date
                }&instructor_id=${
                  values?.instructor
                    ? (values?.instructor as { id: string })?.id
                    : null
                }&instructor_name=${
                  values?.instructor
                    ? `${
                        (values?.instructor as { first_name: string })
                          ?.first_name
                      } ${
                        (values?.instructor as { last_name: string })?.last_name
                      }`
                    : null
                }`
              );
            }}
          >
            {({ values, handleSubmit, touched, errors, setFieldValue }) => {
              return (
                <Form>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      padding: "20px ",
                      background: "#fff",
                      // justifyContent: "center",
                    }}
                  >
                    {" "}
                    <Box>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.instructor && errors.instructor)}
                        sx={{ width: { md: "400px", sm: "200px" } }}
                      >
                        <CustomLabel shrink htmlFor={"instructor"}>
                          Change Instructor:
                        </CustomLabel>
                        <AutocompleteWithDynamicSearch
                          fieldName="instructor"
                          endpoint="/user/get"
                          setFieldValue={setFieldValue}
                          values={values}
                          placeholder="Search Instructor"
                          fetchedOptionsKey="users"
                          getOptionLabel={(option: any) =>
                            `${option.first_name} ${option.last_name}`
                          }
                          userRole="INSTRUCTOR"
                        />
                      </FormControl>
                    </Box>
                    <Box sx={{ width: "250px" }}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.paymentPeriodStartDate &&
                            errors.paymentPeriodStartDate
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"paymentPeriodStartDate"}>
                          2 Week Pay Period Starting on :
                        </CustomLabel>
                        <Field
                          fullWidth
                          id="paymentPeriodStartDate"
                          name="paymentPeriodStartDate"
                          variant="outlined"
                          color="primary"
                          as={CustomSelect}
                          placeholder="Select Payment Period Start Date"
                          onChange={(e: any) => {
                            setFieldValue(
                              "paymentPeriodStartDate",
                              e.target.value
                            );
                            setCurrentDate(e.target.value);
                            setDateChanged(true);
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select 2 Week Pay Period Starting on :
                          </MenuItem>
                          {biweeklyDates?.length > 0 &&
                            biweeklyDates?.map((item, index) => (
                              <MenuItem value={item} key={item}>
                                {item}
                              </MenuItem>
                            ))}
                        </Field>
                      </FormControl>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        width: "100px",
                        height: "48px",
                        borderRadius: "32px",
                        background: "#1E4DB7",
                        color: "#FFFFFF",
                        fontWeight: "700",
                        fontSize: "16px",
                        marginTop: "30px",
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      )}

      <Container
        maxWidth={false}
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          <Box
            sx={{
              background: "#E5E4E4",
              borderRadius: "8px 8px 0px 0px",
              padding: "22px 12px",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "18px",
                textAlign: "left",
              }}
            >
              Drivers Training Appointment
            </Typography>
          </Box>
          {/* Hide filters in instructor daily lesson listing */}

          <InstructorReportTable
            appointments={appointmentByPayPeriod?.appointments?.map(
              (appointment: any) => {
                return {
                  studentId: appointment?.student?.id,
                  studentName:
                    appointment?.student?.first_name +
                    " " +
                    appointment?.student?.last_name,
                  classDate: appointment?.appointment_date,
                  timeStart: formatTimeToTwelveHours(appointment?.start_time),
                  timeEnd: formatTimeToTwelveHours(appointment?.end_time),
                  status: appointment?.status?.name ?? "CONFIRMED",
                  instructorTimeIn:
                    formatTimeToTwelveHours(appointment?.actual_start_time) ??
                    "To be filled",
                  instructorTimeOut:
                    formatTimeToTwelveHours(appointment?.actual_end_time) ??
                    "To be filled",
                  mileageIn: appointment?.start_mileage ?? "To be filled",
                  mileageOut: appointment?.end_mileage ?? "To be filled",
                  type: appointment?.package?.name,
                };
              }
            )}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default InstructorReportView;
