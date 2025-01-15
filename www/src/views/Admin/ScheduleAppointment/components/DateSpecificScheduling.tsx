import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Chip, Divider } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import axiosInstance from "@/config/axios.config";
import moment from "moment";

import { Clear as ClearIcon } from "@mui/icons-material";
import { useAppDispatch } from "@/hooks";
import { deleteAvailability } from "@/store/schedule/schedule.actions";
import CustomDialog from "@/components/CustomDialog";
import { DialogContentText } from "@mui/material";

interface Availability {
  id: number;
  user_id: number;
  available_date: string;
  start_time: string;
  end_time: string;
  city: {
    id: number;
    name: string;
  }[];
}

const DateSpecificScheduling = ({
  handleOpenModal,
  userId,
  refreshTrigger,
}: any) => {
  const dispatch = useAppDispatch();
  const [availabilityData, setAvailabilityData] = useState<Availability[]>([]);
  const [showMore, setShowMore] = useState<Record<number, boolean>>({});
  const [clearDayDialog, setClearDayDialog] = useState<{
    open: boolean;
    scheduleId: number | null;
    date: string | null;
  }>({ open: false, scheduleId: null, date: null });

  const fetchDateSpecificAvailability = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/availability/get/date/${userId}`
      );
      setAvailabilityData(data);
    } catch (error) {
      console.error("Error fetching date-specific availability", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchDateSpecificAvailability();
    }
  }, [userId, refreshTrigger]);

  const groupedAvailability = availabilityData
    .sort((a, b) => {
      const dateA = new Date(a.available_date);
      const dateB = new Date(b.available_date);
      return dateA.getTime() - dateB.getTime();
    })
    .reduce((acc, availability) => {
      const date = availability.available_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(availability);
      acc[date].sort((a, b) => {
        const timeA = moment(`${a.available_date} ${a.start_time}`);
        const timeB = moment(`${b.available_date} ${b.start_time}`);
        return timeA.valueOf() - timeB.valueOf();
      });
      return acc;
    }, {} as Record<string, Availability[]>);

  const sortedDates = Object.entries(groupedAvailability).sort(([dateA], [dateB]) => {
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });

  const toggleShowMore = (id: number) => {
    setShowMore((prevShowMore) => ({
      ...prevShowMore,
      [id]: !prevShowMore[id],
    }));
  };

  const handleClearDayClick = (scheduleId: number, date: string) => {
    setClearDayDialog({ open: true, scheduleId, date });
  };

  const handleConfirmClear = () => {
    if (clearDayDialog.scheduleId) {
      dispatch(deleteAvailability(clearDayDialog.scheduleId))
        .then(() => {
          fetchDateSpecificAvailability();
          setClearDayDialog({ open: false, scheduleId: null, date: null });
        })
        .catch((error) => {
          console.error("Error clearing schedule:", error);
        });
    }
  };

  return (
    <Box sx={{ px: 5 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "24px" }}>
          Date-specific scheduling
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "16px",
            fontStyle: "italic",
            color: "rgba(79, 91, 103, 1)",
            textTransform: "capitalize",
          }}
        >
          Update your availability for specific dates when both your hours and
          assigned instructor differ from your regular weekly schedule.
        </Typography>
      </Box>
      <Button
        variant="outlined"
        sx={{
          borderRadius: "20px",
          px: 3,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 7,
        }}
        onClick={handleOpenModal}
      >
        Add Date-specific scheduling
        <AddIcon style={{ width: "15px", height: "15px" }} />
      </Button>

      <Box sx={{ mt: 5 }}>
        {sortedDates.map(([date, availabilities]) => (
          <Box key={date} sx={{ mb: 4 }}>
            {/* Display Date */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: 2 }}>
                {new Date(date).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })}
              </Typography>
              <Button
                onClick={() => handleClearDayClick(availabilities[0].id, date)}
                size="small"
                title="Clear day"
                sx={{ ml: 2, mb: 2 }}
              >
                <ClearIcon /> Clear
              </Button>
            </Box>

            {availabilities.map((availability, index) => (
              <Box key={availability.id}>
                {/* Display Time */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography>
                      {moment(
                        `${availability.available_date} ${availability.start_time}`
                      ).format("h:mm A")}
                    </Typography>
                    -
                    <Typography>
                      {moment(
                        `${availability.available_date} ${availability.end_time}`
                      ).format("h:mm A")}
                    </Typography>
                  </Box>

                  {availability.city.length > 0 && (
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Typography sx={{ fontWeight: 500, pt: 1 }}>
                        Cities:
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            maxWidth: "100%",
                          }}
                        >
                          {availability.city
                            .slice(0, showMore[availability.id] ? undefined : 5)
                            .map((city) => (
                              <Chip
                                key={city.id}
                                label={city.name}
                                sx={{ margin: "2px" }}
                              />
                            ))}
                        </Box>
                        {availability.city.length > 5 && (
                          <Button
                            onClick={() => toggleShowMore(availability.id)}
                            sx={{ mt: 1, p: 0 }}
                          >
                            {showMore[availability.id]
                              ? "Show Less"
                              : `+${availability.city.length - 5} More`}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>

                {index < availabilities.length - 1 && (
                  <Divider sx={{ mb: 3 }} />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <CustomDialog
        open={clearDayDialog.open}
        handleClose={() => setClearDayDialog({ open: false, scheduleId: null, date: null })}
        handleAccept={handleConfirmClear}
        dialogTitle="Clear Schedule"
        isNotAForm
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <DialogContentText>
            Are you sure you want to clear all schedules for {clearDayDialog.date ? new Date(clearDayDialog.date).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            }) : ''}? This action cannot be undone.
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
              onClick={() => setClearDayDialog({ open: false, scheduleId: null, date: null })}
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
    </Box>
  );
};

export default DateSpecificScheduling;
