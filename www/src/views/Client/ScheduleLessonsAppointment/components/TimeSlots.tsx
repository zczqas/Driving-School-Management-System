import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import moment from "moment";
import Theme from "@/themes";

import {
  createAppointmentSchedule,
  updateAppointmentSchedule,
} from "@/store/schedule/schedule.actions";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useRouter } from "next/router"; // Import useRouter
import IRootState from "@/store/interface";

interface Availability {
  id: number;
  start_time: string;
  end_time: string;
  available_day: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

// Add this interface for grouped slots
interface GroupedSlot {
  startTime: string;
  endTime: string;
  instructors: Array<{
    id: number;
    availabilityId: number;
    name: string;
  }>;
}

const TimeSlots = ({
  selectedDate,
  availabilityData,
  scheduleData,
  appointmentById,
}: {
  selectedDate: moment.Moment | null;
  availabilityData: {
    total: number;
    availability: Array<Availability>;
  } | null;
  scheduleData: any;
  appointmentById?: any;
}) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(
    null
  );
  const [selectedAvailableDay, setSelectedAvailableDay] = useState<
    number | null
  >(null); // State to capture the clicked available day
  const [selectedGroupedSlot, setSelectedGroupedSlot] =
    useState<GroupedSlot | null>(null);
  const [visibleSlots, setVisibleSlots] = useState(4);

  useEffect(() => {
    // reset selected grouped slot when availability data changes
    setSelectedGroupedSlot(null);
  }, [availabilityData]);
  const dispatch = useAppDispatch();
  const router = useRouter(); // Initialize the router
  const { isEdit } = router.query;
  console.log("isEdit", isEdit);

  const user = useAppSelector((state: any) => state.auth?.currentUser?.user);
  const userId = user?.id;

  const formatTime = (time: string) => {
    return moment(time, "HH:mm:ss").format("hh:mm A");
  };

  const formatDate = (date: moment.Moment) => {
    return date.format("dddd, MMMM D");
  };

  const handleSlotClick = (slot: Availability) => {
    setSelectedSlot(slot.id);
    setSelectedInstructor(`${slot.user.first_name} ${slot.user.last_name}`);
    setSelectedAvailableDay(slot.available_day); // Capture the available day

    // Log the available day and the clicked slot
    console.log("Selected Available Day:", slot.available_day);
    console.log("Selected Slot:", slot);
  };

  const { tenantData } = useAppSelector((state) => state.tenant);
  const handleConfirmClick = async () => {
    if (selectedSlot && scheduleData) {
      const appointmentData = {
        scheduled_date: selectedDate?.format("YYYY-MM-DD"),
        availability_id: selectedSlot,
        student_id: scheduleData.student_id,
        lesson_id: scheduleData.lesson_id,
        package_id: scheduleData.package_id,
        pickup_location_type_id: scheduleData.pickup_location_type_id,
        pickup_location_text: scheduleData.pickup_location_text,
        notes: scheduleData.notes,
      };

      const payload = [appointmentData];

      if (isEdit) {
        await dispatch(
          updateAppointmentSchedule(
            appointmentById?.id,
            appointmentData,
            () => {
              if (user?.role === "ADMIN") {
                router.push(
                  `/manage/profile/${scheduleData?.student_id}?tabValue=2`
                );
              } else {
                router.push(`/manage/profile/${userId}?tabValue=2`);
              }
            }
          )
        );
        return;
      } else {
        const payloadWithDrivingSchool = [
          {
            ...appointmentData,
            driving_school_id: tenantData?.id ? tenantData?.id : 1,
          },
        ];
        await dispatch(
          createAppointmentSchedule(payloadWithDrivingSchool, () => {
            if (user?.role === "ADMIN") {
              router.push(
                `/manage/profile/${scheduleData?.student_id}?tabValue=2`
              );
            } else {
              router.push(`/manage/profile/${userId}?tabValue=2`);
            }
          })
        );
      }
    }
  };

  useEffect(() => {
    setSelectedSlot(null);
    setSelectedInstructor(null);
  }, [selectedDate]);

  // Get the day of the week from selectedDate (0 for Sunday, 1 for Monday, etc.)
  const dayOfWeek = selectedDate ? selectedDate.day() : null;

  // Debugging logs
  console.log("Selected Date:", selectedDate?.format("YYYY-MM-DD"));
  console.log("Day of the Week:", dayOfWeek);
  console.log("Availability Data:", availabilityData);

  console.log(
    "Filtered Available Slots:",
    availabilityData?.availability && availabilityData?.availability
  );

  // Add this function to group time slots
  const groupTimeSlots = (availability: Array<Availability>): GroupedSlot[] => {
    const groupedByTime: { [key: string]: GroupedSlot } = {};

    availability.forEach((slot) => {
      const timeKey = `${slot.start_time}-${slot.end_time}`;

      if (!groupedByTime[timeKey]) {
        groupedByTime[timeKey] = {
          startTime: slot.start_time,
          endTime: slot.end_time,
          instructors: [],
        };
      }

      groupedByTime[timeKey].instructors.push({
        id: slot.user.id,
        availabilityId: slot.id,
        name: `${slot.user.first_name} ${slot.user.last_name}`,
      });
    });

    return Object.values(groupedByTime).sort((a, b) =>
      moment(a.startTime, "HH:mm:ss").diff(moment(b.startTime, "HH:mm:ss"))
    );
  };

  const handleShowMore = () => {
    setVisibleSlots((prev) => prev + 4);
  };

  return (
    <Box sx={{ pb: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography sx={{ fontWeight: 600, fontSize: "24px", width: "400px" }}>
        {isEdit === "true" ? "Change" : "Select"} time slots & assign
        Instructor(s)
      </Typography>

      <Typography
        sx={{
          fontWeight: 500,
          fontSize: "17px",
          color: Theme.palette.primary.main,
        }}
      >
        {selectedDate ? formatDate(selectedDate) : null}
      </Typography>

      {isEdit && appointmentById && (
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              color: "rgba(79, 91, 103, 1)",
            }}
          >
            Current Time:{" "}
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              color: "rgba(79, 91, 103, 1)",
            }}
          >
            {`${formatTime(
              appointmentById.availability.start_time
            )} - ${formatTime(appointmentById.availability.end_time)}`}
          </Typography>
        </Box>
      )}

      {selectedDate &&
      availabilityData &&
      availabilityData?.availability?.length > 0 ? (
        <Box>
          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                color: "rgba(79, 91, 103, 1)",
                mb: 2,
              }}
            >
              Time Slots
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, minmax(180px, 1fr))",
                  md: "repeat(4, minmax(180px, 1fr))",
                },
                gap: 2,
                mb: 2,
              }}
            >
              {groupTimeSlots(availabilityData.availability)
                .slice(0, visibleSlots)
                .map((groupedSlot) => (
                  <Box
                    key={`${groupedSlot.startTime}-${groupedSlot.endTime}`}
                    sx={{
                      position: "relative",
                      border:
                        selectedGroupedSlot?.startTime === groupedSlot.startTime
                          ? `1px solid ${Theme.palette.primary.main}`
                          : "1px solid #E0E0E0",
                      borderRadius: "8px",
                      padding: "16px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedGroupedSlot?.startTime === groupedSlot.startTime
                          ? "#f5f5f5"
                          : "white",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.2s ease-in-out",
                      minHeight: "70px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:hover": {
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => {
                      setSelectedGroupedSlot(groupedSlot);
                      setSelectedSlot(null);
                      setSelectedInstructor(null);
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {`${formatTime(groupedSlot.startTime)} - ${formatTime(
                        groupedSlot.endTime
                      )}`}
                    </Typography>
                    <Box
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "#FFD700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000",
                        fontWeight: "500",
                        border: "2px solid #FFF",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {groupedSlot.instructors.length}
                    </Box>
                  </Box>
                ))}
            </Box>

            {groupTimeSlots(availabilityData.availability).length >
              visibleSlots && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  onClick={handleShowMore}
                  variant="outlined"
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 4,
                  }}
                >
                  Show More
                </Button>
              </Box>
            )}
          </Box>

          {selectedGroupedSlot && (
            <Box>
              {selectedGroupedSlot.instructors.map((instructor) => (
                <Box
                  key={instructor.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    padding: "8px",
                    mb: 1,
                  }}
                >
                  <RadioGroup
                    row
                    value={selectedSlot}
                    onChange={() => {
                      setSelectedSlot(instructor.availabilityId);
                      setSelectedInstructor(instructor.name);
                    }}
                  >
                    <FormControlLabel
                      value={instructor.availabilityId}
                      control={<Radio />}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            width: "200px",
                          }}
                        >
                          <Avatar src={`https://via.placeholder.com/150`} />
                          <Box>
                            <Typography>{instructor.name}</Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Box>
              ))}
            </Box>
          )}

          <Box>
            {selectedInstructor && (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 1,
                  mb: 2,
                  height: "55px",
                  width: "250px",
                  borderRadius: "8px",
                  backgroundColor: Theme.palette.primary.main,
                  alignSelf: "flex-end",
                }}
                onClick={handleConfirmClick}
              >
                Confirm
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Typography>No availability for the selected date.</Typography>
      )}
    </Box>
  );
};

export default TimeSlots;
