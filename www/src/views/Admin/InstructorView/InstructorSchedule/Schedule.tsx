import React, { Fragment, useCallback } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  SelectChangeEvent,
} from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import ScheduleTable from "./components/ScheduleTable";
import IRootState from "@/store/interface";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchAppointments } from "@/store/appointment/appointment.actions";
import { debounce } from "lodash";
import SubHeaderMain from "../components/SubHeader";

// import axiosInstance from "@/config/axios.config";
import moment from "moment";
import formatDateToString from "@/utils/formatDateToString";
import formatTimeToTwelveHours from "@/utils/formattime";

// Schedule are just a list of appointments
// ==============================|| Schedule VIEW ||============================== //
const ScheduleView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const [currentDate, setCurrentDate] = React.useState<string>(
    moment().format("YYYY-MM-DD")
  );

  const dispatch = useAppDispatch();

  // React.useEffect(() => {
  //   dispatch(fetchAppointments(0, 30));
  // }, []);

  const { appointmentList, appointmentListLoading, appointmentListError } =
    useAppSelector((state: IRootState) => state.appointment);

  const { user: currentUser } = useAppSelector(
    (state: IRootState) => state.auth.currentUser
  );

  const [searchQuery, setSearchQuery] = React.useState("");

  const [filteredDriverTrainingData, setFilteredDriverTrainingData] =
    React.useState([]);

  React.useEffect(() => {
    if (appointmentList?.appointment_schedule) {
      setFilteredDriverTrainingData(
        appointmentList?.appointment_schedule.map((item: any) => {
          return {
            id: item?.id,
            schoolName: item?.driving_school?.name
              ? item?.driving_school?.name
              : "-",
            student_id: item?.student?.id,
            instructor_id: item?.availability?.user?.id,
            studentName: item?.student?.name,
            instructorName: item?.availability?.user?.name,
            student: item?.student,
            instructor: item?.availability?.user,
            package: item?.package?.name ?? "-",
            lesson: item?.lesson?.name,
            classDate: formatDateToString(item?.scheduled_date),
            pickup: item?.pickup_location_type_id ?? "-",
            pickupText: item?.pickup_location_text,
            timeIn: formatTimeToTwelveHours(item?.time_in),
            timeOut: formatTimeToTwelveHours(item?.time_out),
            confirmation: "Confirmed",
            status: item?.status?.name ?? "Confirmed",
            addedBy: "Admin",
            vehicle: item?.availability?.vehicle.id
              ? `${item?.availability?.vehicle.color} ${item?.availability?.vehicle.brand} ${item?.availability?.vehicle.model} ${item?.availability?.vehicle.year} ${item?.availability?.vehicle.plate_number}`
              : "-",
            created_at: moment(item?.created_at).format("YYYY-MM-DD HH:mm:ss"),
            note: item?.note,
          };
        })
      );
    }
  }, [appointmentList]);

  function handleChangeDate(date: string) {
    console.log(date);
    setCurrentDate(date);
    dispatch(fetchAppointments(0, 30, date));
  }

  function handleClearDate() {
    if (currentDate === "") return;
    setCurrentDate("");
    dispatch(fetchAppointments(0, 30));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      // setSearching(true);
      try {
        dispatch(
          fetchAppointments(
            0,
            30,
            currentDate,
            searchTerm,
            currentUser?.role === "INSTRUCTOR" ? currentUser?.id : null
          )
        );
      } catch (error: any) {
        console.log("error", error);
      } finally {
        // setSearching(false);
      }
    }, 300),
    [dispatch]
  );

  React.useEffect(() => {
    console.log(searchQuery);
    fetchOptions(searchQuery);
  }, [fetchOptions, searchQuery]);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={appointmentListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SubHeader
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        handleChangeDate={handleChangeDate}
        handleClearDate={handleClearDate}
        currentDate={currentDate}
      />
      <Container maxWidth={false}>
        <Box py={3}>
          <ScheduleTable
            driverTrainingData={filteredDriverTrainingData}
            currentDate={currentDate}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default ScheduleView;
