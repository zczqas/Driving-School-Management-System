import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  IconButton,
  SelectChangeEvent,
  Chip,
  Divider,
  Grid,
  Fab,
  Zoom,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import CustomTimePicker from "@/components/CustomTimePicker";
import CustomMultipleSelect from "@/components/CustomMultipleSelect";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createScheduleAvailability,
  fetchAvailabilityWeekly,
  deleteAvailability,
} from "@/store/schedule/schedule.actions";
import { openAlert } from "@/store/alert/alert.actions";
import { convertTo24HourFormat } from "@/utils/convertTo24HourFormat";
import convertTo12HourFormat from "@/utils/convertTo12HourFormat";
import IRootState from "@/store/interface";
import CustomDialog from "@/components/CustomDialog";
import { DialogContentText } from "@mui/material";
import { useInView } from "react-intersection-observer";

// Helper function to generate dates for the current week
const getWeekDates = () => {
  // Get today's date
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Calculate start of week by subtracting current day number from today
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  const week = [];
  // Generate 7 days starting from start of week
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    week.push({
      day,
      is_active: false,
      date: date.toISOString().split("T")[0],
      available: false,
      times: [],
      selectedCities: [],
      selectedVehicle: null,
    });
  }
  return week;
};

// Convert day name to numeric day of week (0-6)
const getDayOfWeek = (dayName: string) => {
  const days = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return days[dayName.toLowerCase() as keyof typeof days];
};

const WeeklyScheduleSkeleton = () => {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={200} height={40} />
        <Skeleton width={100} height={40} sx={{ mr: 2 }} />
      </Box>

      <Box my={3}>
        {[...Array(7)].map((_, index) => (
          <Box key={index} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
                <Skeleton width={24} height={24} />
              </Grid>
              <Grid item sx={{ mt: 1, ml: 4 }}>
                <Skeleton width={100} height={24} />
              </Grid>
              <Grid item xs>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={1}
                  gap={1}
                  width="100%"
                >
                  <Skeleton width={120} height={40} />
                  <Skeleton width={20} height={40} />
                  <Skeleton width={120} height={40} />
                  <Skeleton width={40} height={40} />
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minHeight: "280px",
                ml: 8,
              }}
            >
              <Skeleton width="100%" height={56} />
              <Skeleton width="60%" height={32} />
              <Skeleton width="100%" height={56} />
              <Skeleton width="80%" height={32} />
              <Skeleton width={120} height={36} />
            </Box>
            {index < 6 && <Divider sx={{ my: 3 }} />}
          </Box>
        ))}
      </Box>
    </>
  );
};

const WeeklySchedule = ({
  cityList,
  userId,
  vehicleList,
  onUnsavedChanges,
}: any) => {
  const dispatch = useAppDispatch();

  // State for managing weekly schedule data
  const [schedules, setSchedules] = useState<
    {
      day: string;
      date: string;
      available: boolean;
      is_active: boolean;
      times: { start: string; end: string; id: number | null }[];
      selectedCities: number[];
      selectedVehicle: number | null;
      vehicleDetails?: { id: number; model: string } | null;
    }[]
  >(getWeekDates());

  // State for tracking unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // State for confirmation dialogs
  const [clearDayDialog, setClearDayDialog] = useState<{
    open: boolean;
    dayIndex: number | null;
  }>({ open: false, dayIndex: null });

  const [deleteTimeSlotDialog, setDeleteTimeSlotDialog] = useState<{
    open: boolean;
    scheduleIndex: number | null;
    timeIndex: number | null;
  }>({ open: false, scheduleIndex: null, timeIndex: null });

  // State for tracking processing status of operations
  const [isProcessing, setIsProcessing] = useState<{
    type: "checkbox" | "save" | "delete" | null;
    index?: number;
  }>({ type: null });

  // State for tracking initial loading
  const [initialLoading, setInitialLoading] = useState(true);

  // Reset schedule when user ID changes
  useEffect(() => {
    setSchedules(getWeekDates());
    setHasUnsavedChanges(false);
    onUnsavedChanges(false);

    return () => {
      setSchedules(getWeekDates());
      setHasUnsavedChanges(false);
      onUnsavedChanges(false);
    };
  }, [userId]);

  // Get availability data from Redux store
  const { availabilityData, loading: availabilityDataLoading } = useAppSelector(
    (state: IRootState) => state.schedule
  );

  // Update schedules when availability data changes
  useEffect(() => {
    if (Array.isArray(availabilityData) && userId) {
      // Filter data for current instructor
      const instructorData = availabilityData.filter(
        (avail: any) => avail.user_id === parseInt(userId as string)
      );

      // Map availability data to schedule format
      const updatedSchedules = getWeekDates().map((schedule, index) => {
        const availabilityForDay = instructorData?.filter(
          (avail: any) => avail.available_day === index
        );

        if (availabilityForDay && availabilityForDay.length > 0) {
          const vehicle = availabilityForDay[0].vehicle;
          return {
            ...schedule,
            available: true,
            is_active: availabilityForDay[0].is_active,
            times: availabilityForDay.map((avail: any) => ({
              start: convertTo12HourFormat(avail.start_time),
              end: convertTo12HourFormat(avail.end_time),
              id: avail.id,
            })),
            selectedCities: availabilityForDay[0].city.map(
              (city: any) => city.id
            ),
            selectedVehicle: vehicle ? vehicle.id : null,
            vehicleDetails: vehicle
              ? { id: vehicle.id, model: vehicle.model }
              : null,
          };
        }
        return schedule;
      });

      setSchedules(updatedSchedules);
    }
  }, [availabilityData, userId]);

  // Handle checkbox toggle for day availability
  const handleCheckboxChange = async (index: number) => {
    try {
      setIsProcessing({ type: "checkbox", index });
      const newSchedules = [...schedules];
      const schedule = newSchedules[index];
      const dayOfWeek = getDayOfWeek(schedule.day);

      // Toggle available and is_active states based on current state
      if (schedule.available && schedule.selectedVehicle) {
        schedule.is_active = !schedule.is_active;
      } else if (!schedule.selectedVehicle && schedule.available) {
        schedule.available = false;
        schedule.is_active = false;
      } else {
        schedule.available = true;
        schedule.is_active = true;
      }

      // Add default time slot if checking and no times exist
      if (
        newSchedules[index].available &&
        newSchedules[index].times.length === 0
      ) {
        // Set different default times for weekends vs weekdays
        let defaultStart = "11:00 AM";
        let defaultEnd = "01:00 PM";

        if (index === 0 || index === 6) {
          // Weekend days
          defaultStart = "10:00 AM";
          defaultEnd = "12:00 PM";
        }

        newSchedules[index].times.push({
          start: defaultStart,
          end: defaultEnd,
          id: null,
        });
      }

      // Update backend if there are existing time slots
      const hasExistingAvailability = schedule.times.some(
        (time) => time.id !== null
      );

      if (hasExistingAvailability) {
        if (schedule.available && schedule.times.length > 0) {
          // Save updated schedule to backend
          const schedulesToSave = schedule.times.map((time) => ({
            user_id: userId,
            available_day: dayOfWeek,
            start_time: convertTo24HourFormat(time.start),
            end_time: convertTo24HourFormat(time.end),
            city_id: schedule.selectedCities,
            vehicle_id: schedule.selectedVehicle,
            is_active: schedule.is_active,
            id: time.id,
          }));

          await dispatch(createScheduleAvailability(schedulesToSave, false));
          await dispatch(fetchAvailabilityWeekly(userId));
          dispatch(
            openAlert(
              `${schedule.day} has been ${
                schedule.is_active ? "activated" : "deactivated"
              }`,
              "success"
            )
          );
        } else if (!schedule.available) {
          // Delete all time slots for the day
          const deletePromises = schedule.times
            .filter((time) => time.id)
            .map((time) => dispatch(deleteAvailability(time.id as number)));

          await Promise.all(deletePromises);
          await dispatch(fetchAvailabilityWeekly(userId));
          dispatch(
            openAlert(`${schedule.day}'s schedule has been cleared`, "success")
          );
        }
      }

      setSchedules(newSchedules);
    } catch (error) {
      console.error("Error updating schedule:", error);
      dispatch(
        openAlert(`Failed to update schedule. Please try again.`, "error")
      );
    } finally {
      setIsProcessing({ type: null });
    }
  };

  // Add a new time slot to a day's schedule
  const handleAddTimeSlot = (index: number) => {
    const newSchedules = [...schedules];

    if (newSchedules[index].times.length > 0) {
      // Calculate new time slot based on last existing slot
      const lastTimeSlot =
        newSchedules[index].times[newSchedules[index].times.length - 1];
      const lastEndTime24 = convertTo24HourFormat(lastTimeSlot.end);
      const [endHour, endMinute] = lastEndTime24.split(":").map(Number);

      // Calculate new start time (15 minutes after last end time)
      let newStartHour = endHour;
      let newStartMinute = endMinute + 15;

      // Handle minute overflow
      if (newStartMinute >= 60) {
        newStartMinute -= 60;
        newStartHour += 1;
      }

      // Reset to midnight if past 10 PM
      if (newStartHour >= 22) {
        newStartHour = 0;
        newStartMinute = 0;
      }

      // Format times and calculate end time (2 hours after start)
      const formattedNewStartTime24 = `${newStartHour
        .toString()
        .padStart(2, "0")}:${newStartMinute.toString().padStart(2, "0")}`;
      const formattedNewStartTime12 = convertTo12HourFormat(
        formattedNewStartTime24
      );

      let newEndHour = newStartHour + 2;
      let newEndMinute = newStartMinute;

      // Handle day overflow
      if (newEndHour >= 24) {
        newEndHour -= 24;
      }

      // Cap end time at 10 PM
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

      newSchedules[index].times.push({
        start: formattedNewStartTime12,
        end: formattedNewEndTime12,
        id: null,
      });
    } else {
      // Set default time slots based on weekday/weekend
      let defaultStart = "11:00 AM";
      let defaultEnd = "01:00 PM";

      if (index === 0 || index === 6) {
        defaultStart = "10:00 AM";
        defaultEnd = "12:00 PM";
      }

      newSchedules[index].times.push({
        start: defaultStart,
        end: defaultEnd,
        id: null,
      });
    }

    setSchedules(newSchedules);
    setHasUnsavedChanges(true);
    onUnsavedChanges(true);
  };

  // Handle changes to time slots (start or end time)
  const handleTimeChange = (
    scheduleIndex: number,
    timeIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const newSchedules = [...schedules];
    newSchedules[scheduleIndex].times[timeIndex][field] = value;

    if (field === "start") {
      // Automatically adjust end time to be 2 hours after start time
      const startTime24 = convertTo24HourFormat(value);
      const [startHour, startMinute] = startTime24.split(":").map(Number);

      let endHour = startHour + 2;
      let endMinute = startMinute;

      // Handle day overflow
      if (endHour >= 24) {
        endHour -= 24;
      }

      const formattedEndTime24 = `${endHour
        .toString()
        .padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
      const formattedEndTime12 = convertTo12HourFormat(formattedEndTime24);

      newSchedules[scheduleIndex].times[timeIndex]["end"] = formattedEndTime12;
    } else if (field === "end") {
      // Validate time difference between start and end (1-2 hours)
      const startTime24 = convertTo24HourFormat(
        newSchedules[scheduleIndex].times[timeIndex]["start"]
      );
      const endTime24 = convertTo24HourFormat(value);

      const [startHour, startMinute] = startTime24.split(":").map(Number);
      const [endHour, endMinute] = endTime24.split(":").map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      const timeDifference = endTime - startTime;

      // Reset end time if duration is invalid
      if (timeDifference < 60 || timeDifference > 120) {
        dispatch(
          openAlert(
            "The end time must be between 1 and 2 hours after the start time.",
            "error"
          )
        );

        let adjustedEndHour = startHour + 2;
        let adjustedEndMinute = startMinute;

        if (adjustedEndHour >= 24) {
          adjustedEndHour -= 24;
        }

        const adjustedEndTime24 = `${adjustedEndHour
          .toString()
          .padStart(2, "0")}:${adjustedEndMinute.toString().padStart(2, "0")}`;
        const adjustedEndTime12 = convertTo12HourFormat(adjustedEndTime24);

        newSchedules[scheduleIndex].times[timeIndex]["end"] = adjustedEndTime12;
      }
    }

    setSchedules(newSchedules);
    setHasUnsavedChanges(true);
    onUnsavedChanges(true);
  };

  // Handle removal of time slots
  const handleRemoveTimeSlot = (scheduleIndex: number, timeIndex: number) => {
    const schedule = schedules[scheduleIndex];

    // Show confirmation dialog if this is the last time slot
    if (schedule.times.length === 1) {
      setDeleteTimeSlotDialog({
        open: true,
        scheduleIndex,
        timeIndex,
      });
      return;
    }

    // Otherwise proceed with deletion
    handleConfirmTimeSlotDelete(scheduleIndex, timeIndex);
  };

  // Handle confirmation of time slot deletion
  const handleConfirmTimeSlotDelete = async (
    scheduleIndex: number,
    timeIndex: number
  ) => {
    const newSchedules = [...schedules];
    const timeSlot = newSchedules[scheduleIndex].times[timeIndex];

    // Delete existing time slot from the backend
    if (timeSlot.id) {
      try {
        await dispatch(deleteAvailability(timeSlot.id));
      } catch (error) {
        console.error("Error deleting time slot:", error);
        setDeleteTimeSlotDialog({
          open: false,
          scheduleIndex: null,
          timeIndex: null,
        });
        return;
      }
    }

    // Update UI after successful deletion
    newSchedules[scheduleIndex].times.splice(timeIndex, 1);

    // Automatically uncheck availability and clear cities/vehicle if no time slots remain
    if (newSchedules[scheduleIndex].times.length === 0) {
      newSchedules[scheduleIndex].available = false;
      newSchedules[scheduleIndex].is_active = false;
      newSchedules[scheduleIndex].selectedCities = [];
      newSchedules[scheduleIndex].selectedVehicle = null;
      newSchedules[scheduleIndex].vehicleDetails = null;
    }

    setSchedules(newSchedules);
    setHasUnsavedChanges(true);
    onUnsavedChanges(true);
    setDeleteTimeSlotDialog({
      open: false,
      scheduleIndex: null,
      timeIndex: null,
    });
  };

  // Handle changes to city selection
  const handleCityChange = (
    event: SelectChangeEvent<number | number[]>,
    index: number
  ) => {
    const { value } = event.target;
    const newSchedules = schedules.map((schedule, i) =>
      i === index
        ? {
            ...schedule,
            selectedCities: Array.isArray(value)
              ? value.map(Number)
              : [Number(value)],
          }
        : schedule
    );
    setSchedules(newSchedules);
    setHasUnsavedChanges(true);
    onUnsavedChanges(true);
  };

  // Handle changes to vehicle selection
  const handleVehicleChange = (
    event: SelectChangeEvent<number | number[]>,
    index: number
  ) => {
    const { value } = event.target;
    const selectedVehicleId = Array.isArray(value)
      ? Number(value[0])
      : Number(value);

    // Find selected vehicle details
    const selectedVehicle = vehicleList.vehicle.find(
      (vehicle: any) => vehicle.id === selectedVehicleId
    );

    const newSchedules = schedules.map((schedule, i) =>
      i === index
        ? {
            ...schedule,
            selectedVehicle: selectedVehicleId,
            vehicleDetails: selectedVehicle
              ? { id: selectedVehicle.id, model: selectedVehicle.model }
              : null,
          }
        : schedule
    );
    setSchedules(newSchedules);
    setHasUnsavedChanges(true);
    onUnsavedChanges(true);
  };

  const handleDeleteChip = (index: number, cityId: number) => {
    const newSchedules = schedules.map((schedule, i) => {
      if (i === index) {
        const selectedCities = schedule.selectedCities.filter(
          (selectedCity) => selectedCity !== cityId
        );
        return { ...schedule, selectedCities };
      }
      return schedule;
    });
    setSchedules(newSchedules);
    setHasUnsavedChanges(true);
    onUnsavedChanges(true);
  };

  const handleDeleteVehicleChip = (index: number) => {
    const newSchedules = schedules.map((schedule, i) => {
      if (i === index) {
        return { ...schedule, selectedVehicle: null };
      }
      return schedule;
    });
    setSchedules(newSchedules);
    setHasUnsavedChanges(true);
    onUnsavedChanges(true);
  };

  const handleClearDayClick = (index: number) => {
    setClearDayDialog({ open: true, dayIndex: index });
  };

  const handleConfirmClear = async () => {
    if (clearDayDialog.dayIndex === null) return;

    try {
      setIsProcessing({ type: "delete", index: clearDayDialog.dayIndex });
      const index = clearDayDialog.dayIndex;
      const newSchedules = [...schedules];
      const schedule = newSchedules[index];

      const deletePromises = schedule.times
        .filter((time) => time.id)
        .map((time) => dispatch(deleteAvailability(time.id as number)));

      await Promise.all(deletePromises);
      await dispatch(fetchAvailabilityWeekly(userId));

      schedule.times = [];
      schedule.available = false;
      schedule.is_active = false;
      schedule.selectedCities = [];
      schedule.selectedVehicle = null;
      schedule.vehicleDetails = null;

      setSchedules(newSchedules);
      setHasUnsavedChanges(true);
      onUnsavedChanges(true);
    } catch (error) {
      console.error("Error clearing schedule:", error);
      dispatch(openAlert("Error clearing schedule", "error"));
    } finally {
      setIsProcessing({ type: null });
      setClearDayDialog({ open: false, dayIndex: null });
    }
  };

  const saveSchedules = async () => {
    try {
      setIsProcessing({ type: "save" });
      for (const schedule of schedules) {
        if (schedule.available) {
          if (schedule.times.length === 0) {
            dispatch(
              openAlert(
                `Please select at least one time slot for ${schedule.day}.`,
                "error"
              )
            );
            return;
          }

          if (schedule.selectedCities.length === 0) {
            dispatch(
              openAlert(
                `Please select at least one city for ${schedule.day}.`,
                "error"
              )
            );
            return;
          }

          if (!schedule.selectedVehicle) {
            dispatch(
              openAlert(`Please select a vehicle for ${schedule.day}.`, "error")
            );
            return;
          }

          for (const time of schedule.times) {
            const startTime24 = convertTo24HourFormat(time.start);
            const endTime24 = convertTo24HourFormat(time.end);

            const [startHour, startMinute] = startTime24.split(":").map(Number);
            const [endHour, endMinute] = endTime24.split(":").map(Number);

            const startTime = startHour * 60 + startMinute;
            const endTime = endHour * 60 + endMinute;
            const timeDifference = endTime - startTime;

            if (timeDifference < 60 || timeDifference > 120) {
              dispatch(
                openAlert(
                  `The time slot for ${schedule.day} must be between 1 and 2 hours.`,
                  "error"
                )
              );
              return;
            }
          }
        }
      }

      const schedulesToSave = schedules
        .filter((schedule) => schedule.available)
        .flatMap((schedule, index) => {
          // const dayOfWeek = new Date(schedule.date).getDay();
          const dayOfWeek = getDayOfWeek(schedule.day);

          return schedule.times.map((time) => ({
            user_id: userId,
            available_day: dayOfWeek,
            start_time: convertTo24HourFormat(time.start),
            end_time: convertTo24HourFormat(time.end),
            city_id: schedule.selectedCities,
            vehicle_id: schedule.selectedVehicle,
            is_active: schedule.is_active,
            id: time.id,
          }));
        });

      if (schedulesToSave.length > 0) {
        await dispatch(createScheduleAvailability(schedulesToSave));
        await dispatch(fetchAvailabilityWeekly(userId));
        dispatch(openAlert("Schedule saved successfully", "success"));
      } else {
        dispatch(openAlert("No schedules to save", "warning"));
      }
      setHasUnsavedChanges(false);
      onUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving schedule:", error);
      dispatch(openAlert("Error saving schedule", "error"));
    } finally {
      setIsProcessing({ type: null });
    }
  };

  const { ref: saveButtonRef, inView: isSaveButtonVisible } = useInView({
    threshold: 1,
  });

  // Handle initial loading
  useEffect(() => {
    if (Array.isArray(availabilityData)) {
      setInitialLoading(false);
    }
  }, [availabilityData]);

  if (initialLoading) {
    return <WeeklyScheduleSkeleton />;
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "24px" }}>
          Weekly Schedule
        </Typography>

        <Box mr={2} ref={saveButtonRef}>
          <Button
            variant="contained"
            sx={{ px: 6, py: 1.5, borderRadius: "10px" }}
            onClick={saveSchedules}
            disabled={isProcessing.type === "save"}
          >
            {isProcessing.type === "save" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      </Box>

      <Box my={3}>
        {schedules.map((schedule, index) => (
          <Box key={index} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={schedule.is_active && schedule.available}
                  onChange={() => handleCheckboxChange(index)}
                  disabled={
                    isProcessing.type === "checkbox" &&
                    isProcessing.index === index
                  }
                />
                {isProcessing.type === "checkbox" &&
                  isProcessing.index === index && (
                    <CircularProgress size={20} sx={{ ml: 1 }} />
                  )}
              </Grid>
              <Grid item sx={{ mt: 1, ml: 4 }}>
                <Typography variant="body1">{schedule.day}</Typography>
              </Grid>
              <Grid item xs>
                {schedule.is_active ? (
                  schedule.times.map((time, timeIndex) => (
                    <Box
                      key={timeIndex}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mb={1}
                      gap={1}
                      width="100%"
                    >
                      <CustomTimePicker
                        format="12"
                        value={time.start}
                        onChange={(value) =>
                          handleTimeChange(index, timeIndex, "start", value)
                        }
                      />
                      -
                      <CustomTimePicker
                        format="12"
                        value={time.end}
                        minTime={time.start}
                        onChange={(value) =>
                          handleTimeChange(index, timeIndex, "end", value)
                        }
                      />
                      <IconButton
                        onClick={() => handleRemoveTimeSlot(index, timeIndex)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 4,
                    }}
                  >
                    <Typography variant="body2" color="textSecondary" ml={4}>
                      Unavailable
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item>
                {schedule.times.length > 0 && schedule.is_active && (
                  <IconButton
                    onClick={() => handleAddTimeSlot(index)}
                    sx={{ mr: 2 }}
                  >
                    <AddIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
            {schedule.is_active && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minHeight: "280px",
                }}
              >
                <CustomMultipleSelect
                  index={index}
                  selectedItems={
                    schedule.selectedVehicle ? [schedule.selectedVehicle] : []
                  }
                  itemList={vehicleList.vehicle}
                  label="Select Vehicle"
                  handleItemChange={handleVehicleChange}
                  handleDeleteChip={() => handleDeleteVehicleChip(index)}
                  multiple={false}
                  allowDeleteAll={false}
                  allowSelectAll={false}
                />

                {schedule.selectedVehicle && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      minHeight: "32px",
                    }}
                  >
                    <Typography sx={{ mr: 1 }}>Vehicle: </Typography>
                    <Chip
                      key={schedule.selectedVehicle}
                      label={schedule.vehicleDetails?.model}
                      onDelete={() => handleDeleteVehicleChip(index)}
                      sx={{ m: 0.5, fontSize: "12px" }}
                    />
                  </Box>
                )}

                <CustomMultipleSelect
                  index={index}
                  selectedItems={schedule.selectedCities}
                  itemList={cityList.city}
                  label="Select Cities"
                  handleItemChange={handleCityChange}
                  handleDeleteChip={handleDeleteChip}
                />

                {schedule?.selectedCities?.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      minHeight: "32px",
                    }}
                  >
                    <Typography sx={{ mr: 1 }}>Cities: </Typography>
                    {schedule.selectedCities?.map((cityId) => (
                      <Chip
                        key={cityId}
                        label={
                          cityList.city?.find((city: any) => city.id === cityId)
                            ?.name
                        }
                        onDelete={() => handleDeleteChip(index, cityId)}
                        sx={{ m: 0.5, fontSize: "12px" }}
                      />
                    ))}
                  </Box>
                )}

                <Box
                  sx={{ height: "48px", display: "flex", alignItems: "center" }}
                >
                  <Button
                    onClick={() => handleClearDayClick(index)}
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<ClearIcon />}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      height: "36px",
                      "&:hover": {
                        backgroundColor: "error.light",
                        color: "error.contrastText",
                      },
                    }}
                  >
                    Clear Day
                  </Button>
                </Box>
              </Box>
            )}
            {index < schedules.length - 1 && <Divider sx={{ my: 3 }} />}
          </Box>
        ))}
      </Box>

      <CustomDialog
        open={clearDayDialog.open}
        handleClose={() => setClearDayDialog({ open: false, dayIndex: null })}
        handleAccept={handleConfirmClear}
        dialogTitle="Clear Schedule"
        isNotAForm
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <DialogContentText>
            Are you sure you want to clear all schedules for{" "}
            {clearDayDialog.dayIndex !== null
              ? schedules[clearDayDialog.dayIndex].day
              : ""}
            ? This action cannot be undone.
          </DialogContentText>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              disableElevation
              size="large"
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: "100px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "175px",
                width: "100%",
                mr: 2,
              }}
              onClick={() => setClearDayDialog({ open: false, dayIndex: null })}
            >
              Cancel
            </Button>
            <Button
              disableElevation
              size="large"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "100px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "175px",
                width: "100%",
              }}
              onClick={handleConfirmClear}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </CustomDialog>

      <CustomDialog
        open={deleteTimeSlotDialog.open}
        handleClose={() =>
          setDeleteTimeSlotDialog({
            open: false,
            scheduleIndex: null,
            timeIndex: null,
          })
        }
        handleAccept={() => {
          if (
            deleteTimeSlotDialog.scheduleIndex !== null &&
            deleteTimeSlotDialog.timeIndex !== null
          ) {
            handleConfirmTimeSlotDelete(
              deleteTimeSlotDialog.scheduleIndex,
              deleteTimeSlotDialog.timeIndex
            );
          }
        }}
        dialogTitle="Remove Time Slot"
        isNotAForm
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <DialogContentText>
            This is the only time slot for{" "}
            {deleteTimeSlotDialog.scheduleIndex !== null
              ? schedules[deleteTimeSlotDialog.scheduleIndex].day
              : ""}{" "}
            . Removing it will clear the entire day&apos;s schedule. Do you want
            to continue?
          </DialogContentText>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              disableElevation
              size="large"
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: "100px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "175px",
                width: "100%",
                mr: 2,
              }}
              onClick={() =>
                setDeleteTimeSlotDialog({
                  open: false,
                  scheduleIndex: null,
                  timeIndex: null,
                })
              }
            >
              Cancel
            </Button>
            <Button
              disableElevation
              size="large"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "100px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "175px",
                width: "100%",
              }}
              onClick={() => {
                if (
                  deleteTimeSlotDialog.scheduleIndex !== null &&
                  deleteTimeSlotDialog.timeIndex !== null
                ) {
                  handleConfirmTimeSlotDelete(
                    deleteTimeSlotDialog.scheduleIndex,
                    deleteTimeSlotDialog.timeIndex
                  );
                }
              }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </CustomDialog>

      <Zoom in={!isSaveButtonVisible}>
        <Fab
          color="primary"
          onClick={saveSchedules}
          sx={{
            position: "fixed",
            bottom: { xs: 16, md: 26 },
            left: { xs: 10, md: 770 },
            zIndex: 1000,
            transition: "left 0.3s ease",
          }}
        >
          <SaveIcon />
        </Fab>
      </Zoom>
    </>
  );
};

export default WeeklySchedule;
