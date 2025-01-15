import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Button,
  Box,
  Popover,
  Typography,
  Divider,
  Alert,
  Container,
  Modal,
  Chip,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import formatTimeToTwelveHours from "@/utils/formattime";
import { styled } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import moment from "moment";

import { dmSans } from "@/themes/typography";
import {
  CalendarMonthOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  MoreVertOutlined,
  PlaceOutlined,
  SortOutlined,
  SquareRounded,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";

interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface EventType {
  available_date: string;
  is_recurring: any;
  available_day: number;
  start_time: string;
  end_time: string;
  city: {
    city_abbreviation: string;
    name: string;
  }[];
  is_booked: boolean;
  user: UserType;
  booking_info?: {
    booked_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
  };
  created_at?: string;
}

interface AppointmentScheduleType {
  city: any;
  id: number;
  availability_id: number;
  availability: {
    vehicle: any;
    user: {
      first_name: string;
      last_name: string;
    };
    city: {
      city_abbreviation: string;
    }[];
    start_time: string;
    end_time: string;
  };
  scheduled_date: string;
  student: {
    first_name: string;
    last_name: string;
    profile: any;
  };
  lesson: {
    lesson_no: any;
    name: string;
  };
  pickup_location_text: string;
  status: string;
  created_by: {
    first_name: string;
    last_name: string;
  };
}

interface BookedEventType {
  total: number;
  appointment_schedule: AppointmentScheduleType[];
}

interface CustomFullCalendarProps {
  events: EventType[];
  bookedEvents?: BookedEventType;
  height?: number | string;
  onMonthChange?: (month: number) => void;
  fullWidth?: boolean;
  dayOffList?: any[];
}

const StyledCalendarContainer = styled(Box)(({ theme }) => ({
  "& .fc .fc-daygrid-day-frame": {
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
  },
  "& .fc .fc-daygrid-day-top": {
    justifyContent: "center",
  },
  "& .fc .fc-daygrid-day-number": {
    width: "100%",
    textAlign: "center",
  },
  "& .fc .fc-day-today": {
    backgroundColor: `${theme.palette.action.hover} !important`,
  },
  "& .fc .fc-event": {
    borderRadius: theme.shape.borderRadius / 2,
  },
  "& .holiday-cell": {
    backgroundColor: "#ffebee !important",
    "& .fc-daygrid-day-number": {
      color: "#d32f2f",
      position: "relative",
      "& .holiday-reason": {
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "0.85em",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }
    },
    cursor: "not-allowed",
    "& .fc-daygrid-day-events": {
      display: "none",
    }
  },
  "& .holiday-cell .fc-daygrid-day-frame": {
    borderColor: "#ef5350",
  },
}));

const CustomFullCalendar: React.FC<CustomFullCalendarProps> = ({
  events,
  bookedEvents,
  height = 800,
  onMonthChange,
  fullWidth = false,
  dayOffList = [],
}) => {
  const [anchorPosition, setAnchorPosition] = useState<
    { top: number; left: number } | undefined
  >(undefined);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
  const [selectedCurrentEvent, setSelectedCurrentEvent] = useState<any>(null);
  const [currentMonthYear, setCurrentMonthYear] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookedModalOpen, setIsBookedModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  const calendarRef = useRef<any>(null);

  const updateMonthYear = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const view = calendarApi.view;
      const monthYear = view.currentStart.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      setCurrentMonthYear(monthYear);

      const currentMonth = view.currentStart.getMonth() + 1;
      if (onMonthChange) {
        onMonthChange(currentMonth);
      }
    }
  };

  useEffect(() => {
    updateMonthYear();
  }, []);

  const handlePrevClick = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    updateMonthYear();
  };

  const handleNextClick = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    updateMonthYear();
  };

  const handleTodayClick = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    updateMonthYear();
  };

  const handleEventClick = (info: any) => {
    console.log("info-->", info);
    const clickedDate = moment(info.event.start);
    const eventsOnDate = info.event.extendedProps.isBookedEvent
      ? [info.event]
      : [...calendarEvents, ...bookedEventsList].filter((event) => {
          const eventDate = moment(event.start);
          console.log("eventDate-->", eventDate);
          return eventDate.isSame(clickedDate, "day");
        });
    console.log("eventsOnDate-->", eventsOnDate);
    setSelectedEvents(eventsOnDate);
    setSelectedCurrentEvent(info.event);
    console.log({ selectedCurrentEvent });
    setSelectedDate(clickedDate);

    if (info.event.extendedProps.isBookedEvent) {
      setIsBookedModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleCloseBookedModal = () => {
    setIsBookedModalOpen(false);
    setSelectedDate(null);
  };

  // regular-events --> Recurring Events
  // calendar-event --> Specific Date Event
  const calendarEvents = events
    .filter((event) => event.created_at)
    .reduce((acc, event) => {
      const startDate = new Date(event.created_at as string)
        .toISOString()
        .slice(0, 10);
      const cityName = event.city?.[0]?.city_abbreviation || "";

      if (event.is_recurring) {
        // Find any specific dates that should break this recurring event
        const specificDates = events
          .filter(
            (e) =>
              e.available_date &&
              !e.is_recurring &&
              moment(e.available_date).day() === event.available_day &&
              e.user.id === event.user.id
          )
          .map((e) => moment(e.available_date).format("YYYY-MM-DD"))
          .sort();

        // For each specific date, we need to create two recurring events
        if (specificDates.length > 0) {
          specificDates.forEach((specificDate) => {
            // Find or create event that ends before specific date
            const beforeEvent = acc.find(
              (e) =>
                e.daysOfWeek &&
                e.daysOfWeek[0] === event.available_day &&
                e.extendedProps.user.id === event.user.id &&
                e.endRecur === specificDate
            );

            if (beforeEvent) {
              // Update existing event before specific date
              beforeEvent.extendedProps.times.push(event.start_time);
              const sortedTimes = [...beforeEvent.extendedProps.times].sort();
              const displayTimes = sortedTimes.map((time) =>
                formatTimeToTwelveHours(time)
              );
              beforeEvent.title = `${cityName} ${displayTimes.join(", ")}`;
            } else {
              // Create new event that ends before specific date
              acc.push({
                title: `${cityName} ${formatTimeToTwelveHours(
                  event.start_time
                )}`,
                startRecur: startDate,
                endRecur: specificDate, // End before specific date
                daysOfWeek: [event.available_day],
                display: "auto",
                extendedProps: {
                  cities: event?.city,
                  isBooked: event.is_booked,
                  bookingInfo: event.booking_info,
                  user: event.user,
                  times: [event.start_time],
                  isCombined: true,
                  isBookedEvent: false,
                },
                classNames: ["regular-event"],
                order: 1,
              });
            }

            // Find or create event that starts after specific date
            const afterEvent = acc.find(
              (e) =>
                e.daysOfWeek &&
                e.daysOfWeek[0] === event.available_day &&
                e.extendedProps.user.id === event.user.id &&
                e.startRecur ===
                  moment(specificDate).add(1, "day").format("YYYY-MM-DD")
            );

            if (afterEvent) {
              // Update existing event after specific date
              afterEvent.extendedProps.times.push(event.start_time);
              const sortedTimes = [...afterEvent.extendedProps.times].sort();
              const displayTimes = sortedTimes.map((time) =>
                formatTimeToTwelveHours(time)
              );
              afterEvent.title = `${cityName} ${displayTimes.join(", ")}`;
            } else {
              // Create new event that starts after specific date
              acc.push({
                title: `${cityName} ${formatTimeToTwelveHours(
                  event.start_time
                )}`,
                startRecur: moment(specificDate)
                  .add(1, "day")
                  .format("YYYY-MM-DD"),
                daysOfWeek: [event.available_day],
                display: "auto",
                extendedProps: {
                  cities: event?.city,
                  isBooked: event.is_booked,
                  bookingInfo: event.booking_info,
                  user: event.user,
                  times: [event.start_time],
                  isCombined: true,
                  isBookedEvent: false,
                },
                classNames: ["regular-event"],
                order: 1,
              });
            }
          });
        } else {
          // Original logic for recurring events with no specific dates
          const existingEvent = acc.find(
            (e) =>
              e.daysOfWeek &&
              e.daysOfWeek[0] === event.available_day &&
              e.extendedProps.user.id === event.user.id
          );

          if (existingEvent) {
            // Update existing event
            existingEvent.extendedProps.times.push(event.start_time);
            const sortedTimes = [...existingEvent.extendedProps.times].sort();
            const displayTimes = sortedTimes.map((time) =>
              formatTimeToTwelveHours(time)
            );
            existingEvent.title = `${cityName} ${displayTimes.join(", ")}`;
          } else {
            // Create new recurring event
            acc.push({
              title: `${cityName} ${formatTimeToTwelveHours(event.start_time)}`,
              startRecur: startDate,
              daysOfWeek: [event.available_day],
              display: "auto",
              extendedProps: {
                cities: event?.city,
                isBooked: event.is_booked,
                bookingInfo: event.booking_info,
                user: event.user,
                times: [event.start_time],
                isCombined: true,
                isBookedEvent: false,
              },
              classNames: ["regular-event"],
              order: 1,
            });
          }
        }
      } else {
        // Original logic for specific date events
        const availableDate = new Date(event.available_date as string)
          .toISOString()
          .slice(0, 10);

        // Remove any recurring events for this specific date
        const dayOfWeek = moment(availableDate).day();
        acc = acc.filter((e) => {
          if (e.daysOfWeek && e.daysOfWeek[0] === dayOfWeek) {
            const eventDate = moment(availableDate);
            const recurStart = moment(e.startRecur);
            return !eventDate.isSameOrAfter(recurStart);
          }
          return true;
        });

        // Find existing event for the same date
        const existingEvent = acc.find(
          (e) =>
            e.start === availableDate &&
            !e.extendedProps.isBookedEvent &&
            e.extendedProps.user.id === event.user.id
        );

        if (existingEvent) {
          // Add time to existing event
          existingEvent.extendedProps.times.push(event.start_time);
          // Sort times and update title
          const sortedTimes = [...existingEvent.extendedProps.times].sort(
            (a, b) => a.localeCompare(b)
          );
          const displayTimes = sortedTimes.map((time) =>
            formatTimeToTwelveHours(time)
          );
          existingEvent.title = `${cityName} ${displayTimes.join(", ")}`;
        } else {
          // Create new event
          acc.push({
            title: `${formatTimeToTwelveHours(event.start_time)} ${cityName}`,
            start: availableDate,
            color: "#39B14D",
            extendedProps: {
              cities: event?.city,
              isBooked: event.is_booked,
              bookingInfo: event.booking_info,
              user: event.user,
              times: [event.start_time],
              isCombined: false,
              isBookedEvent: false,
            },
            classNames: ["calendar-event"],
            order: 1,
          });
        }
      }

      return acc;
    }, [] as any[]);

  const bookedEventsList = bookedEvents?.appointment_schedule
    ? bookedEvents.appointment_schedule.map((event) => ({
        title: `${event?.availability?.user?.first_name} - ${
          event?.city
            ? event?.city?.city_abbreviation
            : event?.student?.profile?.city
        } / #${event?.lesson?.lesson_no} / ${event.student.first_name} ${
          event.student.last_name
        } / ${event.lesson.name} `,
        start: event.scheduled_date,
        display: "list-item",
        classNames: ["calendar-event"],
        order: 2,
        extendedProps: {
          isBooked: true,
          isCombined: false,
          user: event.availability.user,
          student: event.student,
          city: event.pickup_location_text || "",
          isBookedEvent: true,
          availability: event.availability,
          vehicle: event.availability.vehicle,
          appointment_id: event.id,
          created_by: event.created_by,
        },
      }))
    : [];

  // const filteredEvents = [...calendarEvents, ...bookedEventsList].filter(
  //   (event) => {}
  // );

  // Combine holiday events with filtered existing events
  const combinedEvents = [...calendarEvents, ...bookedEventsList];

  // console.log({ bookedEvents, selectedEvents, holidayEvents });

  console.log(
    "events-->",
    events,
    "\nbookedEventsList-->",
    bookedEventsList,
    "\ncalendarEvents-->",
    calendarEvents
  );

  const router = useRouter();

  const isHoliday = (date: Date) => {
    return dayOffList?.some((dayOff) => {
      const start = moment(dayOff.from_);
      const end = moment(dayOff.to_);
      return moment(date).isBetween(start, end, 'day', '[]');
    });
  };

  const getHolidayReason = (date: Date) => {
    const holiday = dayOffList?.find((dayOff) => {
      const start = moment(dayOff.from_);
      const end = moment(dayOff.to_);
      return moment(date).isBetween(start, end, 'day', '[]');
    });
    return holiday?.reason || '';
  };

  const renderDayCellContent = (arg: any) => {
    const date = arg.date;
    const dayNumber = date.getDate();
    
    if (isHoliday(date)) {
      const reason = getHolidayReason(date);
      return (
        <Typography className="fc-daygrid-day-number">
          {dayNumber}
          <Box 
            className="holiday-reason"
            component="span"
          >
            <span role="img" aria-label="holiday">🏖️</span>
            {reason}
          </Box>
        </Typography>
      );
    }

    return <Typography className="fc-daygrid-day-number">{dayNumber}</Typography>;
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        fontFamily: dmSans.style.fontFamily,
      }}
    >
      <Box display="flex" justifyContent="space-between" gap={2} mb={2}>
        <Typography sx={{ fontSize: "30px", fontWeight: 600 }}>
          {currentMonthYear}
        </Typography>

        <Box display="flex" gap={2}>
          <Button variant="outlined" color="primary" onClick={handlePrevClick}>
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: "20px" }} />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTodayClick}
            sx={{ px: 4 }}
          >
            Today
          </Button>
          <Button variant="outlined" color="primary" onClick={handleNextClick}>
            <ArrowForwardIosRoundedIcon sx={{ fontSize: "20px" }} />
          </Button>
        </Box>
      </Box>
      <StyledCalendarContainer>
        <Box
          sx={{
            width: fullWidth ? "100%" : "auto",
            "& .fc-daygrid-day-frame": { borderRadius: "10px" },
            "& .fc-daygrid-day-events": {
              cursor: "pointer",
            },
            "& .calendar-event": {
              backgroundColor: "transparent",
              border: "none",
              color: "inherit",
              padding: "0 0 0 5px",
              fontSize: "0.85em",
              position: "relative",
              ":hover": {
                backgroundColor: "#F5F5F7",
              },
            },
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height={height}
            events={combinedEvents}
            ref={calendarRef}
            headerToolbar={false}
            dayMaxEvents={true}
            eventOrder="order"
            views={{
              dayGridMonth: {
                titleFormat: { year: "numeric", month: "long" },
                dayHeaderFormat: { weekday: "short" },
              },
            }}
            eventClick={handleEventClick}
            firstDay={1}
            dayCellClassNames={(arg) => {
              return isHoliday(arg.date) ? 'holiday-cell' : [];
            }}
            dayCellContent={renderDayCellContent}
            dateClick={(arg) => {
              if (!isHoliday(arg.date)) {
                // Handle regular date click if needed
              }
            }}
          />
        </Box>
      </StyledCalendarContainer>

      {/* ==== Modal for Availablility ==== */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          <Typography
            id="event-modal-title"
            variant="h5"
            component="h2"
            gutterBottom
          >
            Events for {selectedDate && selectedDate.format("MMMM D, YYYY")}
          </Typography>
          {!selectedCurrentEvent?.extendedProps?.isBookedEvent && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography>Available Cities :</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedCurrentEvent?.extendedProps?.cities?.map(
                  (city: any) => (
                    <Chip
                      label={`${city.city_abbreviation} - ${city.name}`}
                      key={city.city_abbreviation}
                    />
                  )
                )}
              </Box>
              {/* ==== Selected Event Time Slots ==== */}
              <Divider sx={{ my: 2 }} />
              <Typography>Time Slots :</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedCurrentEvent?.extendedProps?.times?.map(
                  (time: any) => (
                    <Chip
                      label={formatTimeToTwelveHours(time)}
                      key={formatTimeToTwelveHours(time)}
                    />
                  )
                )}
              </Box>
            </>
          )}

          <Divider sx={{ my: 2 }} />
          {/* <Box
            sx={{
              maxHeight: "320px",
              overflowY: "auto",
              // Update custom scrollbar styles
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
              // Add Firefox scrollbar styles
              scrollbarWidth: "thin",
              scrollbarColor: "#888 #f1f1f1",
            }}
          >
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "background.default",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {event.title}
                  </Typography>

                  {event.extendedProps?.city && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {Array.isArray(event.extendedProps.city)
                          ? event.extendedProps.city[0]?.city_abbreviation ||
                            event.extendedProps.city[0]?.name
                          : event.extendedProps.city}
                      </Typography>
                    </Box>
                  )}
                  {event.extendedProps?.user && (
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {`${event.extendedProps.user.first_name} ${event.extendedProps.user.last_name}`}
                      </Typography>
                    </Box>
                  )}
                  {event.extendedProps?.isBooked && (
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                      Booked
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography>No events scheduled for this day.</Typography>
            )}
          </Box> */}
          <Button
            onClick={handleCloseModal}
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      {/* ==== Modal for Booked Events ==== */}
      <Dialog
        open={isBookedModalOpen}
        onClose={handleCloseBookedModal}
        aria-labelledby="booked-event-modal-title"
        aria-describedby="booked-event-modal-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={() => {
                router.push(
                  `/manage/schedule-lessons?student_id=${selectedCurrentEvent?.extendedProps?.student?.id}&first_name=${selectedCurrentEvent?.extendedProps?.student?.first_name}&last_name=${selectedCurrentEvent?.extendedProps?.student?.last_name}&appointment_id=${selectedCurrentEvent?.extendedProps?.appointment_id}&isEdit=true`
                );
              }}
            >
              <EditOutlined />
            </IconButton>
            {/* <IconButton>
              <DeleteOutlined />
            </IconButton>
            <IconButton>
              <MailOutlined />
            </IconButton>
            <IconButton>
              <MoreVertOutlined />
            </IconButton> */}
            <IconButton onClick={handleCloseBookedModal}>
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <IconButton>
                <SquareRounded color="primary" />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5">
                {selectedCurrentEvent?.title}
              </Typography>
              <Typography variant="h6">
                {moment(selectedCurrentEvent?.start).format("dddd, DD MMMM")}
                {" • "}
                {moment(
                  selectedCurrentEvent?.extendedProps?.availability?.start_time,
                  "HH:mm:ss"
                ).format("h:mm A")}{" "}
                -
                {moment(
                  selectedCurrentEvent?.extendedProps?.availability?.end_time,
                  "HH:mm:ss"
                ).format("h:mm A")}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <IconButton>
                <PlaceOutlined />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="h6">
                {selectedCurrentEvent?.extendedProps?.city}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <IconButton>
                <SortOutlined />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h5">Student Info</Typography>
              <Link
                href={`/manage/profile/${selectedCurrentEvent?.extendedProps?.student?.id}?tabValue=2`}
              >
                <Typography
                  sx={{
                    textTransform: "capitalize",
                    color: "primary.main",
                    textDecoration: "none",
                    lineHeight: "1",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  variant="h6"
                >
                  Name:{" "}
                  {selectedCurrentEvent?.extendedProps?.student?.first_name}{" "}
                  {selectedCurrentEvent?.extendedProps?.student?.last_name}
                </Typography>
              </Link>
              <Link
                href={`mailto:${selectedCurrentEvent?.extendedProps?.student?.email}`}
                passHref
              >
                <Typography
                  variant="h6"
                  component="a"
                  sx={{
                    color: "primary.main",
                    lineHeight: "1",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Email: {selectedCurrentEvent?.extendedProps?.student?.email}
                </Typography>
              </Link>
              {selectedCurrentEvent?.extendedProps?.student?.profile
                ?.contact_information?.length > 0 &&
                selectedCurrentEvent?.extendedProps?.student?.profile?.contact_information.map(
                  (contact: any) => (
                    <>
                      <Typography variant="h6">
                        Parent Cell ({contact?.contact_relationship}):{" "}
                        {contact?.contact_phone}
                      </Typography>
                    </>
                  )
                )}
              <Typography variant="h6">
                Phone:{" "}
                {
                  selectedCurrentEvent?.extendedProps?.student?.profile
                    ?.cell_phone
                }
              </Typography>
              <Typography variant="h6">
                Address:{" "}
                {selectedCurrentEvent?.extendedProps?.student?.profile?.address}
              </Typography>
              <Typography variant="h6">
                City:{" "}
                {selectedCurrentEvent?.extendedProps?.student?.profile?.city}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <IconButton>
                <CalendarMonthOutlined color="primary" />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5">
                {
                  selectedCurrentEvent?.extendedProps?.availability?.vehicle
                    ?.model
                }
              </Typography>
              <Typography variant="h6">
                Created by:{" "}
                {selectedCurrentEvent?.extendedProps?.created_by?.first_name}{" "}
                {selectedCurrentEvent?.extendedProps?.created_by?.last_name}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CustomFullCalendar;
