import React, { Fragment, useEffect, useState } from "react";
import {
  Backdrop,
  CircularProgress,
  Box,
  Grid,
  Tabs,
  Tab,
  Container,
  Divider,
  Button,
  DialogContentText,
} from "@mui/material";
import ScheduleInfo from "./components/ScheduleInfo";
import WeeklySchedule from "./components/WeeklySchedule";
import DateSpecificScheduling from "./components/DateSpecificScheduling";
import AddDateSpecificScheduling from "./components/AddDateSpecificScheduling";
import {
  fetchCities,
  fetchVehicles,
} from "@/store/masterlist/masterlist.actions";
import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";

import { useRouter } from "next/router";
import {
  fetchAvailabilityMonthly,
  fetchAvailabilityWeekly,
  fetchDateSpecificAvailability,
  fetchDayOffList,
} from "@/store/schedule/schedule.actions";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import CalendarView from "./components/CalendarView";
import CustomDialog from "@/components/CustomDialog";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import DayOffs from "./components/DayOffs";

const Schedule = () => {
  const dispatch = useAppDispatch<any>();
  const router = useRouter();
  const { id, name } = router.query;

  const [viewMode, setViewMode] = useState("list");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);

  useEffect(() => {
    dispatch(fetchCities(0, 100));
    dispatch(fetchVehicles(0, 100));
    if (id) {
      dispatch(fetchAvailabilityWeekly(parseInt(id as string)));
      // dispatch(fetchDateSpecificAvailability(parseInt(id as string)));
    }
  }, [dispatch, id]);

  const { cityList } = useAppSelector(
    (state: IRootState) => state?.masterlist?.city
  );

  const { vehicleList } = useAppSelector(
    (state: IRootState) => state?.masterlist?.vehicle
  );

  const { availabilityData, dateSpecificAvailability, loading } =
    useAppSelector((state: IRootState) => state?.schedule);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    day: "",
    date: "",
    times: [{ start: "", end: "" }],
    available: true,
    selectedCities: [],
  });

  const resetNewSchedule = () => {
    setNewSchedule({
      day: "",
      date: "",
      times: [{ start: "", end: "" }],
      available: true,
      selectedCities: [],
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (hasUnsavedChanges && newValue === "calendar") {
      setShowUnsavedChangesDialog(true);
    } else {
      setViewMode(newValue);
    }
  };

  const [refreshDateSpecific, setRefreshDateSpecific] = useState<number>(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    dispatch(fetchDateSpecificAvailability(parseInt(id as string)));
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRefreshDateSpecific((prev) => prev + 1);
    dispatch(fetchDateSpecificAvailability(parseInt(id as string)));
  };

  const handleNewTimeChange = (
    timeIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    const updatedTimes = Array.isArray(newSchedule?.times)
      ? [...newSchedule.times]
      : [];

    if (!updatedTimes[timeIndex]) {
      updatedTimes[timeIndex] = { start: "", end: "" };
    }

    if (field in updatedTimes[timeIndex]) {
      updatedTimes[timeIndex][field] = value;
    } else {
      console.error(`Invalid field: ${field}`);
      return;
    }

    setNewSchedule({ ...newSchedule, times: updatedTimes });
  };

  const handleAddNewTimeSlot = () => {
    setNewSchedule({
      ...newSchedule,
      times: [...newSchedule.times, { start: "", end: "" }],
    });
  };

  const handleRemoveNewTimeSlot = (index: number) => {
    const updatedTimes = [...newSchedule.times];
    updatedTimes.splice(index, 1);
    setNewSchedule({ ...newSchedule, times: updatedTimes });
  };

  const handleUnsavedChanges = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
  };

  const handleConfirmSwitch = () => {
    setShowUnsavedChangesDialog(false);
    setViewMode("calendar");
    setHasUnsavedChanges(false);
  };

  const handleCancelSwitch = () => {
    setShowUnsavedChangesDialog(false);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchDayOffList(id as string));
    }
  }, [dispatch, id]);

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
          <ScheduleInfo name={name} />

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: "flex", justifyContent: "start", px: 3 }}>
            <Tabs
              value={viewMode}
              onChange={handleTabChange}
              centered
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                backgroundColor: "#F5F5F5",
                borderRadius: "8px",
                display: "inline-flex",
                p: "6px",
              }}
            >
              <Tab
                value="list"
                label="List view"
                icon={<FormatListBulletedRoundedIcon />}
                sx={tabStyle(viewMode === "list")}
              />
              <Tab
                value="calendar"
                label="Calendar view"
                icon={<CalendarIcon />}
                sx={tabStyle(viewMode === "calendar")}
              />
              <Tab
                value="dayoffs"
                label="Day Offs"
                icon={<EventBusyIcon />}
                sx={tabStyle(viewMode === "dayoffs")}
              />
            </Tabs>
          </Box>

          {viewMode === "list" && (
            <Grid container spacing={2} sx={{ px: 3, py: 6 }}>
              <Grid item xs={6} sx={{ borderRight: "1px solid #E0E0E0", p: 0 }}>
                <WeeklySchedule
                  userId={parseInt(id as string)}
                  cityList={cityList}
                  vehicleList={vehicleList}
                  onUnsavedChanges={handleUnsavedChanges}
                />
              </Grid>
              <Grid item xs={6}>
                <DateSpecificScheduling
                  handleOpenModal={handleOpenModal}
                  userId={parseInt(id as string)}
                  refreshTrigger={refreshDateSpecific}
                />
              </Grid>
            </Grid>
          )}

          {viewMode === "calendar" && (
            <Box sx={{ px: 3, py: 6 }}>
              <CalendarView />
            </Box>
          )}

          {viewMode === "dayoffs" && (
            <Box sx={{ px: 3, py: 6 }}>
              <DayOffs userId={parseInt(id as string)} />
            </Box>
          )}
        </Box>

        <AddDateSpecificScheduling
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          newSchedule={newSchedule}
          handleAddNewTimeSlot={handleAddNewTimeSlot}
          handleNewTimeChange={handleNewTimeChange}
          handleRemoveNewTimeSlot={handleRemoveNewTimeSlot}
          userId={parseInt(id as string)}
          instructorAvailability={availabilityData}
          dateSpecificAvailability={dateSpecificAvailability}
          cityList={cityList}
          vehicleList={vehicleList}
          isLoading={loading}
        />

        <CustomDialog
          open={showUnsavedChangesDialog}
          handleClose={handleCancelSwitch}
          handleAccept={handleConfirmSwitch}
          dialogTitle="Unsaved Changes"
          isNotAForm
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <DialogContentText>
              You have unsaved changes. Are you sure you want to switch to the
              calendar view without saving?
            </DialogContentText>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
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
                onClick={handleCancelSwitch}
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
                onClick={handleConfirmSwitch}
              >
                Switch Anyway
              </Button>
            </Box>
          </Box>
        </CustomDialog>
      </Container>
    </Fragment>
  );
};

const tabStyle = (isActive: boolean) => ({
  textTransform: "none",
  fontWeight: 600,
  minWidth: 160,
  color: isActive ? "#000" : "#6E6E6E",
  backgroundColor: isActive ? "#fff" : "transparent",
  borderRadius: "8px",
  boxShadow: isActive ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
  "&:hover": {
    backgroundColor: isActive ? "#fff" : "#E0E0E0",
  },
});

export default Schedule;
