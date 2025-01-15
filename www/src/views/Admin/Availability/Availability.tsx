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
import { fetchInstructorMonthlyAvailability, fetchInstructorMonthlySchedule } from "@/store/schedule/schedule.actions";
import SearchInstructors from "./components/SearchInstructor";

const Availability: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const instructorId = router.query.id;

  const { instructorAvailability, instructorSchedule, loading } =
    useAppSelector((state: RootState) => state.schedule);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    if (instructorId) {
      const id = Number(instructorId);
      dispatch(fetchInstructorMonthlyAvailability(currentMonth, id));
      dispatch(fetchInstructorMonthlySchedule(currentMonth, id));
    }
  }, [dispatch, currentMonth, instructorId]);

  const handleMonthChange = (newMonth: number) => {
    setCurrentMonth(newMonth);
  };

  const events = instructorAvailability ? instructorAvailability : [];
  const bookedEvents = instructorSchedule ? instructorSchedule : [];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "20px 40px",
          gap: 2,
        }}
      >
        <SearchInstructors id={instructorId} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              borderRadius: "50px",
              backgroundColor: (theme) => theme.palette.primary.main,
              height: "10px",
              width: "10px",
            }}
          />
          <Typography sx={{ fontSize: "15px" }}>Booked</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              borderRadius: "50px",
              backgroundColor: "rgba(57, 177, 77, 1)",
              height: "10px",
              width: "10px",
            }}
          />
          <Typography sx={{ fontSize: "15px" }}>Available</Typography>
        </Box>
      </Box>
      <Container maxWidth={false} sx={{ padding: "20px 0" }}>
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
            height={650}
            onMonthChange={handleMonthChange}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Availability;
