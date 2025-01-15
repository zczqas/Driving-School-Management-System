import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  Container,
  Grid,
  Divider,
  Backdrop,
  CircularProgress,
  Button,
} from "@mui/material";
import moment, { Moment } from "moment";
import ScheduleInfo from "./components/ScheduleInfo";
import DateTime from "./components/DateTime";
import TimeSlots from "./components/TimeSlots";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointmentByAppointmentId,
  fetchAvailabilityWithParams,
} from "@/store/schedule/schedule.actions";
import { fetchUserDetailsById } from "@/store/user/user.actions";
import IRootState from "@/store/interface";
import { AppDispatch } from "@/store";
import { useAppSelector } from "@/hooks";
import { decrypt } from "@/utils/encryptAndDecrypt";

// Define the type for your schedule data
interface ScheduleData {
  // Add the properties you expect in your schedule data
  student_id: string;
  package_id : string;
  // ... other properties
}

const Appointment = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const { availabilityData, loading, appointmentById } = useAppSelector(
    (state: IRootState) => ({
      availabilityData: state.schedule.availabilityData,
      loading: state.schedule.loading,
      appointmentById: state.schedule.appointmentById,
    })
  );
  const {
    userDetailsById: { details },
  } = useAppSelector((store: IRootState) => store?.user);

  const router = useRouter();
  const isEdit = router.query.isEdit === "true";
  const { appointment_id } = router.query;

  useEffect(() => {
    if (router.query.data && typeof router.query.data === "string") {
      const decryptData = async () => {
        try {
          console.log("router.query.data", router.query.data);
          const parsedData = await decrypt<ScheduleData>(
            router.query.data as string
          );
          console.log("parsedData", parsedData);
          setScheduleData(parsedData);
        } catch (error) {
          console.error("Failed to parse query data:", error);
        }
      };

      decryptData();
    }
  }, [router.query.data]);

  useEffect(() => {
    if (Boolean(isEdit) && appointment_id) {
      dispatch(fetchAppointmentByAppointmentId(appointment_id));
    }
  }, [isEdit, appointment_id]);

  useEffect(() => {
    if (appointmentById?.scheduled_date && isEdit) {
      console.log("appointmentById", appointmentById);
      const scheduledDate = moment(appointmentById.scheduled_date);
      setSelectedDate(scheduledDate);
    }
  }, [appointmentById, isEdit]);

  const student_id = scheduleData?.student_id;

  useEffect(() => {
    if (student_id) {
      dispatch(fetchUserDetailsById(student_id));
    }
  }, [student_id, dispatch]);

  useEffect(() => {
    if (selectedDate && student_id) {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      const availableDay = selectedDate.day();

      dispatch(
        fetchAvailabilityWithParams(
          0, // offset
          10, // limit
          formattedDate, // availableDate
          "DESC", // order
          "CREATED_AT", // sort
          availableDay, // available_day
          parseInt(student_id as string), // student_id,
          false // isBooked
        )
      );
    }
  }, [selectedDate, student_id, dispatch]);

  const handleCancel = async () => {
    const { data } = router.query;
    if (data && typeof data === "string") {
      try {
        router.push({
          pathname: "/manage/schedule-lessons",
          query: {
            student_id: scheduleData?.student_id,
            first_name: router.query.first_name,
            last_name: router.query.last_name,
            data: data,
            ...(router.query.isEdit === "true" && { isEdit: true }),
            ...(router.query.appointment_id && {
              appointment_id: router.query.appointment_id,
            }),
          },
        });
      } catch (error) {
        console.error("Failed to parse query data:", error);
        router.push("/manage/schedule-lessons");
      }
    } else {
      router.push("/manage/schedule-lessons");
    }
  };

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Container maxWidth={false} sx={{ py: 3 }}>
        <Box sx={{ backgroundColor: "#fff" }}>
          <ScheduleInfo scheduleData={scheduleData} details={details} />

          <Divider
            sx={{
              background: "rgba(255, 255, 255, 0.60)",
              my: 4,
            }}
          />

          <Grid container spacing={2} sx={{ px: 3, py: 3 }}>
            <Grid
              item
              xs={3}
              sx={{ borderRight: "1px solid #E0E0E0", p: 0, minWidth: "370px" }}
            >
              <DateTime
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  sx={{ px: 6, py: 1.5, borderRadius: "10px" }}
                  onClick={handleCancel}
                >
                  Back
                </Button>
              </Box>
            </Grid>

            <Grid item xs={7}>
              <TimeSlots
                selectedDate={selectedDate}
                availabilityData={availabilityData}
                scheduleData={scheduleData}
                appointmentById={appointmentById}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Fragment>
  );
};

export default Appointment;
