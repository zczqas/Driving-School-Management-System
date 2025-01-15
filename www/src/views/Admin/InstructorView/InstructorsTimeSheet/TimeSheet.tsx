import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  MenuItem,
  Typography,
} from "@mui/material";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchAppointmentOfPayPeriod } from "@/store/appointment/appointment.actions";
import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { CustomLabel, CustomSelect } from "@/components/CustomInput";
import SubHeader from "../components/SubHeader";

import { Field, Form, Formik } from "formik";
import AutocompleteWithDynamicSearch from "./components/AutoCompleteWithDynamicSearch";
import * as Yup from "yup";
import InstructorTimeSheetTable from "./components/InstructorTimeSheetTable";
import getBiweeklyMondays from "@/utils/getBiweeklyMondays";
import formatTimeToTwelveHours from "@/utils/formattime";
import moment from "moment";
import formatDateToString from "@/utils/formatDateToString";

const InstructorTimeSheet = () => {
  const [state, setState] = useState({
    instructorId: null as string | null,
    currentDate: null as string | null,
    displayDate: null as string | null,
    dateChanged: false,
  });

  const biweeklyDates = useMemo(() => getBiweeklyMondays(), []);
  const dispatch = useAppDispatch();

  const { appointmentByPayPeriod, appointmentByPayPeriodLoading } =
    useAppSelector((state: IRootState) => state.appointment);

  const { user: currentUser } = useAppSelector(
    (state: IRootState) => state.auth.currentUser
  );

  useEffect(() => {
    if (state.instructorId && state.currentDate) {
      const formattedDate = moment(state.currentDate).format("YYYY-MM-DD");
      dispatch(
        fetchAppointmentOfPayPeriod(formattedDate, state.instructorId, 0, 100)
      );
    }
  }, [state.instructorId, state.currentDate, dispatch]);

  useEffect(() => {
    if (currentUser?.role === "INSTRUCTOR") {
      setState((prevState) => ({
        ...prevState,
        instructorId: currentUser?.id,
      }));
    }
  }, [currentUser]);

  const handleDateChange = useCallback(
    (date: string) => {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const displayFormattedDate = moment(date).format("MM-DD-YYYY");

      setState((prevState) => ({
        ...prevState,
        currentDate: formattedDate,
        displayDate: displayFormattedDate,
        dateChanged: true,
      }));
    },
    [setState]
  );

  const handleInstructorChange = useCallback(
    (instructor: { id: string } | null) => {
      setState((prevState) => ({
        ...prevState,
        instructorId: instructor ? instructor.id : null,
      }));
    },
    [setState]
  );

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={appointmentByPayPeriodLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box>
        <Formik
          initialValues={{
            paymentPeriodStartDate: "",
            instructor: null,
          }}
          onSubmit={(values) => {
            handleInstructorChange(values?.instructor as { id: string } | null);
          }}
        >
          {({ values, handleSubmit, touched, errors, setFieldValue }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  padding: "20px",
                  background: "#fff",
                }}
              >
                {currentUser?.role !== "INSTRUCTOR" && (
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
                )}
                <Box sx={{ width: "250px" }}>
                  <FormControl
                    variant="standard"
                    error={Boolean(
                      touched.paymentPeriodStartDate &&
                        errors.paymentPeriodStartDate
                    )}
                    sx={{ width: "100%" }}
                    size="small"
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
                      onChange={(e: any) => handleDateChange(e.target.value)}
                      value={state.displayDate || ""}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 400,
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select 2 Week Pay Period Starting on :
                      </MenuItem>
                      {biweeklyDates?.map((item) => (
                        <MenuItem value={item} key={item}>
                          {moment(item).format("MM-DD-YYYY")}
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
          )}
        </Formik>
      </Box>

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

          <InstructorTimeSheetTable
            appointments={appointmentByPayPeriod?.appointment_schedule?.map(
              (appointment: any) => ({
                studentId: appointment?.student?.id,
                studentName: `${appointment?.student?.first_name} ${appointment?.student?.last_name}`,
                classDate: formatDateToString(appointment?.scheduled_date),
                timeStart: appointment?.availability?.start_time
                  ? formatTimeToTwelveHours(
                      appointment?.availability?.start_time
                    )
                  : "To be filled",
                timeEnd: appointment?.availability?.end_time
                  ? formatTimeToTwelveHours(
                      appointment?.availability?.end_time
                    )
                  : "To be filled",
                status: appointment?.status?.name ?? "CONFIRMED",
                instructorTimeIn: appointment?.time_in
                  ? formatTimeToTwelveHours(appointment?.time_in)
                  : "To be filled",
                instructorTimeOut: appointment?.time_out
                  ? formatTimeToTwelveHours(appointment?.time_out)
                  : "To be filled",
                mileageIn: appointment?.start_mileage ?? "To be filled",
                mileageOut: appointment?.end_mileage ?? "To be filled",
                type: appointment?.package?.name,
              })
            )}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default InstructorTimeSheet;
