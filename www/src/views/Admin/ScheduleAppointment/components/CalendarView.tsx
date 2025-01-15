import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import CustomFullCalendar from "@/components/CustomFullCalendar";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/store";
import { useRouter } from "next/router";
import {
  fetchInstructorMonthlyAvailability,
  fetchInstructorMonthlySchedule,
} from "@/store/schedule/schedule.actions";

const CalendarView: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const instructorId = router.query.id;

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const { instructorAvailability, instructorSchedule, loading, dayOffList } =
    useAppSelector((state: RootState) => state.schedule);

  const handleMonthChange = (newMonth: number) => {
    setCurrentMonth(newMonth);
  };

  useEffect(() => {
    if (instructorId) {
      const id = Number(instructorId);
      dispatch(fetchInstructorMonthlyAvailability(currentMonth, id));
      dispatch(fetchInstructorMonthlySchedule(currentMonth, id));
    }
  }, [dispatch, currentMonth, instructorId]);

  const events = instructorAvailability ? instructorAvailability : [];
  const bookedEvents = instructorSchedule ? instructorSchedule : [];

  return (
    <Container maxWidth={false}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ backgroundColor: "#fff", padding: "20px 20px 80px 20px" }}>
        <CustomFullCalendar
          events={events}
          bookedEvents={bookedEvents}
          height={700}
          onMonthChange={handleMonthChange}
          dayOffList={dayOffList}
        />
      </Box>
    </Container>
  );
};

export default CalendarView;
