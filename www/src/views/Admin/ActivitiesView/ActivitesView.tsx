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
import DriverTrainingEducationTable from "./components/ActivitiesTable";
import IRootState from "@/store/interface";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchAppointments } from "@/store/appointment/appointment.actions";
import { debounce } from "lodash";
import axiosInstance from "@/config/axios.config";
import moment from "moment";
import formatDateToString from "@/utils/formatDateToString";

// ==============================|| ACTIVITIES VIEW ||============================== //
const ActivitiesView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const [currentDate, setCurrentDate] = React.useState<string>("");

  const dispatch = useAppDispatch();

  // Appointment is being fetched below
  // React.useEffect(() => {
  // dispatch(fetchAppointments(0, 30));
  // }, []);

  const { appointmentList, appointmentListLoading, appointmentListError } =
    useAppSelector((state: IRootState) => state.appointment);

  const [searchQuery, setSearchQuery] = React.useState("");

  const [filteredDriverTrainingData, setFilteredDriverTrainingData] =
    React.useState([]);

  React.useEffect(() => {
    if (appointmentList?.appointments) {
      setFilteredDriverTrainingData(
        appointmentList?.appointments.map((item: any) => {
          return {
            id: item?.id,
            student_id: item?.student_id,
            instructor_id: item?.instructor_id,
            studentName: item?.student_name,
            instructorName: item?.instructor_name,
            student: item?.student,
            instructor: item?.instructor,
            package: item?.package?.name ?? "-",
            lesson: item?.lesson?.name,
            classDate: formatDateToString(item?.appointment_date) ?? "-",
            pickup: item?.pickup_location_type?.name ?? "-",
            pickupText: item?.pickup_text,
            timeIn: item?.start_time,
            timeOut: item?.end_time,
            confirmation: "Confirmed",
            status: item?.status?.name ?? "Insterted Appointment",
            transaction : item?.transaction ?? "-",
            addedBy:
              item?.created_by?.first_name +
                item?.created_by?.last_name ?? "Admin",
            createdAt: moment(item?.created_at).format("MM-DD-YYYY LTS") ?? "-",
          };
        })
      );
    }
  }, [appointmentList]);

  function changeDriverTrainingStatus(id: number, status: boolean) {
    // const updatedLesson = filteredDriverTrainingData.map((lesson) => {
    //   if (lesson.id === id) {
    //     lesson.status = !status;
    //   }
    //   return lesson;
    // });
    // setFilteredDriverTrainingData(updatedLesson);
  }

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
        dispatch(fetchAppointments(0, 30, "", searchTerm));
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
          <DriverTrainingEducationTable
            driverTrainingData={filteredDriverTrainingData}
            changeDriverTrainingStatus={changeDriverTrainingStatus}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default ActivitiesView;
