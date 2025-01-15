import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, IconButton, Chip } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import CustomTimePicker from "@/components/CustomTimePicker";
import CustomDialog from "@/components/CustomDialog";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import PublicIcon from "@mui/icons-material/Public";
import convertTo12HourFormat from "@/utils/convertTo12HourFormat";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createScheduleAvailability,
  updateScheduleAvailability,
  deleteAvailability,
  fetchDayOffList,
} from "@/store/schedule/schedule.actions";
import { convertTo24HourFormat } from "@/utils/convertTo24HourFormat";
import CustomMultipleSelect from "@/components/CustomMultipleSelect";
import { openAlert } from "@/store/alert/alert.actions"; // Import the alert action
import moment from "moment";
import { RootState } from "@/store";
import { styled } from "@mui/material/styles";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

interface City {
  id: number;
  name: string;
}

interface Availability {
  is_active: boolean;
  available_day: number;
  available_date: string;
  start_time: string;
  end_time: string;
  city: City[];
  id: number;
}

interface DayOff {
  user_id: number;
  from_: string;
  to_: string;
  day_: number | null;
  reason: string;
  id: number;
}

interface Props {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  newSchedule: any;
  handleAddNewTimeSlot: () => void;
  handleNewTimeChange: (
    index: number,
    field: "start" | "end",
    value: string
  ) => void;
  handleRemoveNewTimeSlot: (index: number) => void;
  instructorAvailability: Availability[];
  dateSpecificAvailability: Availability[];
  userId: number;
  cityList: { city: City[] };
  vehicleList: { vehicle: any[] };
  isLoading?: boolean;
}

const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
  width: "100%",
  maxWidth: "360px",
  margin: "20px auto",

  // Style for the month switching buttons
  "& .MuiPickersCalendarHeader-root": {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,

    "& .MuiPickersArrowSwitcher-root": {
      button: {
        color: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      },
    },
  },

  // Style for the day names (Mon, Tue, etc.)
  "& .MuiDayCalendar-weekDayLabel": {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    width: 36,
    height: 36,
  },

  // Style for all day buttons
  "& .MuiPickersDay-root": {
    width: 36,
    height: 36,
    fontSize: "0.875rem",
    margin: "2px",

    "&:not(.Mui-selected):not(.Mui-disabled):hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },

    // Style for the selected date
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },

    // Style for disabled dates (past dates)
    "&.Mui-disabled": {
      color: theme.palette.text.disabled,
      // textDecoration: 'line-through',
      backgroundColor: "#f5f5f5",
      opacity: 0.7,

      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    },

    // Style for day-off dates
    "&.day-off": {
      backgroundColor: "#fff4f4",
      border: "1px solid #ffa4a4",
      color: "#d32f2f",
      // textDecoration: 'line-through',
      position: "relative",

      "&:hover": {
        backgroundColor: "#ffe6e6",
      },

      // Add a small dot indicator
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 2,
        left: "50%",
        transform: "translateX(-50%)",
        width: 4,
        height: 4,
        borderRadius: "50%",
        backgroundColor: "#d32f2f",
      },
    },

    // Today's date
    "&.MuiPickersDay-today": {
      border: `1px solid ${theme.palette.primary.main}`,
      backgroundColor: "transparent",
      color: theme.palette.primary.main,
      fontWeight: 600,

      "&:not(.Mui-selected):hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
    },
  },

  // Style for the month/year selection
  "& .MuiPickersCalendarHeader-label": {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

const AddDateSpecificScheduling: React.FC<Props> = ({
  isModalOpen,
  handleCloseModal,
  newSchedule,
  handleAddNewTimeSlot,
  handleNewTimeChange,
  handleRemoveNewTimeSlot,
  instructorAvailability,
  dateSpecificAvailability,
  userId,
  cityList,
  vehicleList,
  isLoading = false,
}) => {
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<
    { start: string; end: string }[]
  >([]);
  const [dateSpecificSchedule, setDateSpecificSchedule] = useState(newSchedule);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [initialTimes, setInitialTimes] = useState(newSchedule.times);
  const [initialCities, setInitialCities] = useState<number[]>([]);
  const [initialVehicle, setInitialVehicle] = useState<number | null>(null);

  const getCaliforniaTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date());
  };

  // Old Logic where we take data from weekly availability
  // useEffect(() => {
  //   if (selectedDate) {
  //     const dayOfWeek = new Date(selectedDate).getDay();

  //     if (Array.isArray(instructorAvailability)) {
  //       const availabilityForDay = instructorAvailability.filter(
  //         (avail) => avail.available_day === dayOfWeek
  //       );

  //       if (availabilityForDay?.length > 0) {
  //         setAvailableTimes(
  //           availabilityForDay.map((avail) => ({
  //             start: convertTo12HourFormat(avail.start_time),
  //             end: convertTo12HourFormat(avail.end_time),
  //           }))
  //         );

  //         const citiesForDay = Array.from(
  //           new Set(
  //             availabilityForDay.flatMap(
  //               (avail) => avail.city?.map((city) => city.id) || []
  //             )
  //           )
  //         );
  //         setSelectedCities(citiesForDay);

  //         setDateSpecificSchedule({
  //           ...dateSpecificSchedule,
  //           times: availabilityForDay.map((avail) => ({
  //             start: convertTo12HourFormat(avail.start_time),
  //             end: convertTo12HourFormat(avail.end_time),
  //           })),
  //         });

  //         setInitialTimes(
  //           availabilityForDay.map((avail) => ({
  //             start: convertTo12HourFormat(avail.start_time),
  //             end: convertTo12HourFormat(avail.end_time),
  //           }))
  //         );
  //         setInitialCities(citiesForDay);

  //         if ((availabilityForDay[0] as any)?.vehicle) {
  //           setSelectedVehicle((availabilityForDay[0] as any).vehicle.id);
  //           setInitialVehicle((availabilityForDay[0] as any).vehicle.id);
  //         }
  //       } else {
  //         setAvailableTimes([]);
  //         setSelectedCities([]);
  //         setSelectedVehicle(null);
  //         setDateSpecificSchedule({ ...dateSpecificSchedule, times: [] });
  //       }
  //     } else {
  //       setAvailableTimes([]);
  //       setSelectedCities([]);
  //       setSelectedVehicle(null);
  //     }
  //   }
  // }, [selectedDate, instructorAvailability]);

  // useEffect(() => {
  //   dispatch(fetchDayOffList(userId.toString()));
  // }, []);

  const dayOffList = useAppSelector(
    (state: RootState) => state.schedule.dayOffList
  );

  // function to merge instructorAvailability and dateSpecificAvailability
  const mergeAvailability = (
    instructorAvailability: Availability[],
    dateSpecificAvailability: Availability[]
  ) => {
    return [...instructorAvailability, ...dateSpecificAvailability];
  };

  // New Logic where we take data from date specific availability
  useEffect(() => {
    if (selectedDate) {
      const parsedSelectedDate = moment(selectedDate).format("YYYY-MM-DD");
      const dayOfWeek = moment(selectedDate).day();

      if (
        Array.isArray(instructorAvailability) &&
        Array.isArray(dateSpecificAvailability)
      ) {
        // First check if there's a date-specific schedule for this date
        const dateSpecificForDay = dateSpecificAvailability.filter(
          (avail) => avail.available_date === parsedSelectedDate
        );

        // If date-specific schedule exists, only use that
        if (dateSpecificForDay.length > 0) {
          const availabilityForDay = dateSpecificForDay;

          if (availabilityForDay?.length > 0) {
            setAvailableTimes(
              availabilityForDay.map((avail) => ({
                start: convertTo12HourFormat(avail.start_time),
                end: convertTo12HourFormat(avail.end_time),
              }))
            );

            const citiesForDay = Array.from(
              new Set(
                availabilityForDay.flatMap(
                  (avail) => avail.city?.map((city) => city.id) || []
                )
              )
            );
            setSelectedCities(citiesForDay);

            setDateSpecificSchedule({
              ...dateSpecificSchedule,
              times: availabilityForDay.map((avail) => ({
                start: convertTo12HourFormat(avail.start_time),
                end: convertTo12HourFormat(avail.end_time),
                id: avail.id,
              })),
              available_date: parsedSelectedDate,
            });

            setInitialTimes(
              availabilityForDay.map((avail) => ({
                start: convertTo12HourFormat(avail.start_time),
                end: convertTo12HourFormat(avail.end_time),
              }))
            );
            setInitialCities(citiesForDay);

            if ((availabilityForDay[0] as any)?.vehicle) {
              setSelectedVehicle((availabilityForDay[0] as any).vehicle.id);
              setInitialVehicle((availabilityForDay[0] as any).vehicle.id);
            }
          }
        } else {
          // If no date-specific schedule, use active weekly schedule
          const activeWeeklyAvailability = instructorAvailability.filter(
            (avail) => avail.is_active && avail.available_day === dayOfWeek
          );

          if (activeWeeklyAvailability.length > 0) {
            setAvailableTimes(
              activeWeeklyAvailability.map((avail) => ({
                start: convertTo12HourFormat(avail.start_time),
                end: convertTo12HourFormat(avail.end_time),
              }))
            );

            const citiesForDay = Array.from(
              new Set(
                activeWeeklyAvailability.flatMap(
                  (avail) => avail.city?.map((city) => city.id) || []
                )
              )
            );
            setSelectedCities(citiesForDay);

            setDateSpecificSchedule({
              ...dateSpecificSchedule,
              times: activeWeeklyAvailability.map((avail) => ({
                start: convertTo12HourFormat(avail.start_time),
                end: convertTo12HourFormat(avail.end_time),
              })),
            });

            setInitialTimes(
              activeWeeklyAvailability.map((avail) => ({
                start: convertTo12HourFormat(avail.start_time),
                end: convertTo12HourFormat(avail.end_time),
              }))
            );
            setInitialCities(citiesForDay);

            if ((activeWeeklyAvailability[0] as any)?.vehicle) {
              setSelectedVehicle(
                (activeWeeklyAvailability[0] as any).vehicle.id
              );
              setInitialVehicle(
                (activeWeeklyAvailability[0] as any).vehicle.id
              );
            }
          } else {
            // No schedules found
            setAvailableTimes([]);
            setSelectedCities([]);
            setSelectedVehicle(null);
            setDateSpecificSchedule({ ...dateSpecificSchedule, times: [] });
          }
        }
      } else {
        setAvailableTimes([]);
        setSelectedCities([]);
        setSelectedVehicle(null);
        setDateSpecificSchedule({ ...dateSpecificSchedule, times: [] });
      }
    }
  }, [selectedDate, dateSpecificAvailability, instructorAvailability]);

  const resetState = () => {
    // Don't reset selectedDate, as we want to maintain the context
    setAvailableTimes([]);
    setDateSpecificSchedule({ times: [] });
    setSelectedCities([]);
    setSelectedVehicle(null);
    setInitialTimes([]);
    setInitialCities([]);
    setInitialVehicle(null);

    // Trigger a re-fetch of data for the selected date
    if (selectedDate) {
      const parsedSelectedDate = moment(selectedDate).format("YYYY-MM-DD");
      const dayOfWeek = moment(selectedDate).day();

      if (
        Array.isArray(instructorAvailability) &&
        Array.isArray(dateSpecificAvailability)
      ) {
        const mergedAvailability = mergeAvailability(
          instructorAvailability,
          dateSpecificAvailability
        );
        const availabilityForDay = mergedAvailability.filter(
          (avail) =>
            avail.available_date === parsedSelectedDate ||
            avail.available_day === dayOfWeek
        );

        if (availabilityForDay?.length > 0) {
          // Update the state with the fetched data
          setAvailableTimes(
            availabilityForDay.map((avail) => ({
              start: convertTo12HourFormat(avail.start_time),
              end: convertTo12HourFormat(avail.end_time),
            }))
          );

          const citiesForDay = Array.from(
            new Set(
              availabilityForDay.flatMap(
                (avail) => avail.city?.map((city) => city.id) || []
              )
            )
          );
          setSelectedCities(citiesForDay);
          setInitialCities(citiesForDay);

          setDateSpecificSchedule({
            times: availabilityForDay.map((avail) => ({
              start: convertTo12HourFormat(avail.start_time),
              end: convertTo12HourFormat(avail.end_time),
            })),
            id: availabilityForDay[0].id,
          });

          if ((availabilityForDay[0] as any)?.vehicle) {
            setSelectedVehicle((availabilityForDay[0] as any).vehicle.id);
            setInitialVehicle((availabilityForDay[0] as any).vehicle.id);
          }
        }
      }
    }

    handleCloseModal();
  };

  const saveSchedules = () => {
    if (!selectedDate) {
      dispatch(openAlert("Please select a date.", "error"));
      return;
    }

    const newTimes = dateSpecificSchedule.times.filter(
      (time: any) => time.start && time.end
    );

    if (newTimes.length === 0) {
      dispatch(openAlert("Please select at least one time slot.", "error"));
      return;
    }

    if (selectedCities.length === 0) {
      dispatch(openAlert("Please select at least one city.", "error"));
      return;
    }

    if (!selectedVehicle) {
      dispatch(openAlert("Please select a vehicle.", "error"));
      return;
    }

    // Check for time slot overlaps
    const sortedTimes = [...newTimes].sort((a, b) => {
      const startA = convertTo24HourFormat(a.start);
      const startB = convertTo24HourFormat(b.start);
      return startA.localeCompare(startB);
    });

    for (let i = 0; i < sortedTimes.length - 1; i++) {
      const currentEndTime = convertTo24HourFormat(sortedTimes[i].end);
      const nextStartTime = convertTo24HourFormat(sortedTimes[i + 1].start);

      const [currentEndHour, currentEndMinute] = currentEndTime
        .split(":")
        .map(Number);
      const [nextStartHour, nextStartMinute] = nextStartTime
        .split(":")
        .map(Number);

      const currentEndMinutes = currentEndHour * 60 + currentEndMinute;
      const nextStartMinutes = nextStartHour * 60 + nextStartMinute;

      if (currentEndMinutes >= nextStartMinutes) {
        dispatch(
          openAlert(
            "Time slots cannot overlap. Please adjust the times.",
            "error"
          )
        );
        return;
      }
    }

    // Validate time slots duration (1-2 hours)
    for (const time of newTimes) {
      const startTime24 = convertTo24HourFormat(time.start);
      const endTime24 = convertTo24HourFormat(time.end);

      const [startHour, startMinute] = startTime24.split(":").map(Number);
      const [endHour, endMinute] = endTime24.split(":").map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      const timeDifference = endTime - startTime;

      if (timeDifference < 60 || timeDifference > 120) {
        dispatch(
          openAlert("Each time slot must be between 1 and 2 hours.", "error")
        );
        return;
      }
    }

    // Prepare schedules to save - all slots will be new date-specific entries
    const schedulesToSave = newTimes.map((time: any) => ({
      user_id: userId,
      available_date: moment(selectedDate).format("YYYY-MM-DD"),
      start_time: convertTo24HourFormat(time.start),
      end_time: convertTo24HourFormat(time.end),
      city_id: selectedCities,
      vehicle_id: selectedVehicle,
      is_active: true,
    }));

    if (schedulesToSave.length > 0) {
      dispatch(createScheduleAvailability(schedulesToSave))
        .then(() => {
          dispatch(
            openAlert("Date-specific schedule saved successfully!", "success")
          );
          resetState();
        })
        .catch((error) => {
          dispatch(
            openAlert(`Error saving schedule: ${error.message}`, "error")
          );
        });
    } else {
      dispatch(openAlert("No schedules to save", "warning"));
    }
  };

  const handleDateChange = (date: Date | null) => {
    console.log({ date });
    setSelectedDate(date);
  };

  const handleAddTimeSlotInternal = () => {
    const newTimes = [...dateSpecificSchedule.times];

    if (newTimes.length > 0) {
      // Get the last time slot
      const lastTimeSlot = newTimes[newTimes.length - 1];
      const lastEndTime24 = convertTo24HourFormat(lastTimeSlot.end);
      const [endHour, endMinute] = lastEndTime24.split(":").map(Number);

      // Add 15 minutes to the last end time for the new start time
      let newStartHour = endHour;
      let newStartMinute = endMinute + 15;

      if (newStartMinute >= 60) {
        newStartMinute -= 60;
        newStartHour += 1;
      }

      // If the new start time is after 10:00 PM, default to 12:00 AM
      if (newStartHour >= 22) {
        newStartHour = 0;
        newStartMinute = 0;
      }

      const formattedNewStartTime24 = `${newStartHour
        .toString()
        .padStart(2, "0")}:${newStartMinute.toString().padStart(2, "0")}`;
      const formattedNewStartTime12 = convertTo12HourFormat(
        formattedNewStartTime24
      );

      // Set end time to 2 hours after start time
      let newEndHour = newStartHour + 2;
      let newEndMinute = newStartMinute;

      if (newEndHour >= 24) {
        newEndHour -= 24;
      }

      // Ensure the new end time does not exceed 10:00 PM
      if (newEndHour >= 22) {
        newEndHour = 22;
        newEndMinute = 0;
      }

      const formattedNewEndTime24 = `${newEndHour
        .toString()
        .padStart(2, "0")}:${newEndMinute.toString().padStart(2, "0")}`;
      const formattedNewEndTime12 = convertTo12HourFormat(
        formattedNewEndTime24
      );

      newTimes.push({
        start: formattedNewStartTime12,
        end: formattedNewEndTime12,
        id: null,
      });
    } else {
      // Set default time slots
      const defaultStart = "11:00 AM";
      const defaultEnd = "01:00 PM";

      newTimes.push({
        start: defaultStart,
        end: defaultEnd,
        id: null,
      });
    }

    setDateSpecificSchedule({
      ...dateSpecificSchedule,
      times: newTimes,
    });
  };

  const handleTimeChangeInternal = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    handleNewTimeChange(index, field, value);
    const newTimes = [...dateSpecificSchedule.times];
    newTimes[index][field] = value;

    if (field === "start") {
      const startTime24 = convertTo24HourFormat(value);
      const [startHour, startMinute] = startTime24.split(":").map(Number);

      let endHour = startHour + 2;
      let endMinute = startMinute;

      if (endHour >= 24) {
        endHour -= 24;
      }

      const formattedEndTime24 = `${endHour
        .toString()
        .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
      const formattedEndTime12 = convertTo12HourFormat(formattedEndTime24);

      newTimes[index]["end"] = formattedEndTime12;
    }

    setDateSpecificSchedule({
      ...dateSpecificSchedule,
      times: newTimes,
    });
  };

  const handleRemoveTimeSlotInternal = async (index: number) => {
    const newTimes = [...dateSpecificSchedule.times];
    const timeSlot = newTimes[index];

    // Only delete from backend if it's a date-specific schedule (not weekly)
    if (timeSlot.id && dateSpecificSchedule.available_date) {
      try {
        await dispatch(deleteAvailability(timeSlot.id));
        dispatch(openAlert("Time slot deleted successfully", "success"));
      } catch (error) {
        console.error("Error deleting time slot:", error);
        dispatch(openAlert("Error deleting time slot", "error"));
        return;
      }
    }

    // Remove the time slot from local state
    newTimes.splice(index, 1);

    // Update the state
    setDateSpecificSchedule({
      ...dateSpecificSchedule,
      times: newTimes,
    });

    // If no time slots left, reset cities and vehicle
    if (newTimes.length === 0) {
      setSelectedCities([]);
      setSelectedVehicle(null);
    }
  };

  const handleCityChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedCities(
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  };

  const handleVehicleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedVehicle(Number(value));
  };

  const handleDeleteChip = (cityId: number) => {
    setSelectedCities((prev) => prev.filter((id) => id !== cityId));
  };

  const handleDeleteVehicleChip = () => {
    setSelectedVehicle(null);
  };

  // Helper function to compare arrays
  const arraysEqual = (a: number[], b: number[]) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  // Add a cleanup function to the component
  useEffect(() => {
    return () => {
      // This will run when the component unmounts
      setSelectedDate(null);
      setAvailableTimes([]);
      setDateSpecificSchedule({ times: [] });
      setSelectedCities([]);
      setSelectedVehicle(null);
      setInitialTimes([]);
      setInitialCities([]);
      setInitialVehicle(null);
    };
  }, []);

  const shouldDisableDate = (date: unknown): boolean => {
    const dateObj = date as Date;
    // First check if date is in the past
    if (dateObj < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true;
    }

    // Then check if date is in day offs
    const dateStr = moment(dateObj).format("YYYY-MM-DD");

    return dayOffList.some((dayOff: DayOff) => {
      const fromDate = moment(dayOff.from_);
      const toDate = moment(dayOff.to_);
      const currentDate = moment(dateStr);
      return currentDate.isBetween(fromDate, toDate, "day", "[]");
    });
  };

  return (
    <CustomDialog
      open={isModalOpen}
      handleClose={handleCloseModal}
      handleAccept={saveSchedules}
      dialogTitle="Add Date-specific Schedule"
      maxWidth={"lg"}
      fullWidth
      loading={isLoading}
    >
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "20px",
                color: "rgba(26, 26, 26, 1)",
              }}
            >
              Select the date(s) you want to assign instructor(s)
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StyledDateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                shouldDisableDate={shouldDisableDate}
                slots={{
                  day: (props) => {
                    const isDayOff = dayOffList.some((dayOff: DayOff) => {
                      const date = props.day;
                      const fromDate = moment(dayOff.from_);
                      const toDate = moment(dayOff.to_);
                      return moment(date as Date).isBetween(
                        fromDate,
                        toDate,
                        "day",
                        "[]"
                      );
                    });

                    return (
                      <PickersDay
                        {...props}
                        className={`${props.className} ${
                          isDayOff ? "day-off" : ""
                        }`}
                      />
                    );
                  },
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
              Time zone
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PublicIcon />
              Pacific Time (California): {getCaliforniaTime()}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={7} sx={{ borderLeft: "1px solid #E0E0E0" }}>
          <Box sx={{ pl: 5, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "20px",
                color: "rgba(26, 26, 26, 1)",
              }}
            >
              Select time slots & assign instructor(s)
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <IconButton
                sx={{
                  borderRadius: "5px",
                  background: "#E9E3F7",
                }}
                onClick={handleAddTimeSlotInternal}
              >
                <AddIcon color="primary" />
              </IconButton>
            </Box>

            <Grid container>
              <Grid item xs={12}>
                {dateSpecificSchedule?.times?.length > 0 ? (
                  <>
                    <Typography>Select time slots</Typography>
                    {dateSpecificSchedule?.times?.map(
                      (time: any, index: number) => (
                        <Box
                          key={index}
                          display="flex"
                          flexDirection="column"
                          mb={1}
                          gap={1}
                          width="100%"
                        >
                          <Box display="flex" gap={1} alignItems={"center"}>
                            <CustomTimePicker
                              format="12"
                              value={time.start}
                              onChange={(value) =>
                                handleTimeChangeInternal(index, "start", value)
                              }
                            />
                            -
                            <CustomTimePicker
                              format="12"
                              value={time.end}
                              minTime={time.start}
                              onChange={(value) =>
                                handleTimeChangeInternal(index, "end", value)
                              }
                            />
                            <IconButton
                              onClick={() =>
                                handleRemoveTimeSlotInternal(index)
                              }
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      )
                    )}
                  </>
                ) : (
                  <Typography>Unavailable for selected date</Typography>
                )}
              </Grid>
            </Grid>

            {dateSpecificSchedule?.times?.length > 0 && (
              <>
                <CustomMultipleSelect
                  selectedItems={selectedCities}
                  itemList={cityList.city?.map((city) => ({
                    id: city.id,
                    name: city.name,
                    model: "",
                  }))}
                  label="Select Cities"
                  handleItemChange={handleCityChange}
                  handleDeleteChip={handleDeleteChip}
                />

                <CustomMultipleSelect
                  selectedItems={selectedVehicle ? [selectedVehicle] : []}
                  itemList={vehicleList.vehicle}
                  label="Select Vehicle"
                  handleItemChange={handleVehicleChange}
                  handleDeleteChip={handleDeleteVehicleChip}
                  multiple={false}
                  allowDeleteAll={false}
                  allowSelectAll={false}
                />
              </>
            )}

            <Box sx={{ mt: 1 }}>
              {selectedCities.length > 0 && <Typography>Cities: </Typography>}
              {selectedCities.map((cityId: number) => (
                <Chip
                  key={cityId}
                  label={cityList.city.find((city) => city.id === cityId)?.name}
                  onDelete={() => handleDeleteChip(cityId)}
                  sx={{ m: 0.5 }}
                />
              ))}

              {selectedVehicle && (
                <Box sx={{ mt: 2 }}>
                  <Typography>Vehicle: </Typography>
                  <Chip
                    label={
                      vehicleList.vehicle.find(
                        (vehicle) => vehicle.id === selectedVehicle
                      )?.model
                    }
                    onDelete={handleDeleteVehicleChip}
                    sx={{ m: 0.5 }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </CustomDialog>
  );
};

export default AddDateSpecificScheduling;
