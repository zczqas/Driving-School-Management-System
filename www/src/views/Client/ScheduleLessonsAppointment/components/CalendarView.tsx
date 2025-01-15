// import React, { useEffect, useState } from "react";
// import { fetchAvailabilityMonthly } from "@/store/schedule/schedule.actions";
// import CustomFullCalendar from "@/components/CustomFullCalendar";
// import IRootState from "@/store/interface";
// import { Backdrop, CircularProgress } from "@mui/material";
// import { useAppDispatch, useAppSelector } from "@/hooks";

// const CalendarView = () => {
//   const dispatch = useAppDispatch();
//   const { availabilityData, loading } = useAppSelector(
//     (state: IRootState) => state.schedule
//   );

//   const [selectedMonth, setSelectedMonth] = useState<number>(
//     new Date().getMonth() + 1
//   );

//   // Fetch availability when the selected month changes
//   useEffect(() => {
//     // Send month as a string
//     dispatch(
//       fetchAvailabilityMonthly(
//         0,
//         10,
//         "DESC",
//         "CREATED_AT",
//         selectedMonth.toString()
//       )
//     );
//   }, [dispatch, selectedMonth]);

//   // Check if availabilityData is an object with an availability array and filter out events that are not booked (is_booked: false)
//   const availableEvents =
//     availabilityData && Array.isArray(availabilityData.availability)
//       ? availabilityData.availability.filter((event: any) => !event.is_booked)
//       : [];

//   // Handle month change from CustomFullCalendar
//   const handleMonthChange = (month: number) => {
//     setSelectedMonth(month);
//   };

//   console.log({ availableEvents });

//   return (
//     <div>
//       <Backdrop
//         sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
//         open={loading}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>

//       <CustomFullCalendar
//         events={availableEvents} // Pass filtered events where is_booked is false
        
//         height={700}
//         onMonthChange={handleMonthChange} // Pass the callback to CustomFullCalendar
//       />
//     </div>
//   );
// };

// export default CalendarView;
