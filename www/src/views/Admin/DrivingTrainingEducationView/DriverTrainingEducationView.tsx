import React, { Fragment, useCallback, useState } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  Checkbox,
  CircularProgress,
  Container,
  SelectChangeEvent,
  Table,
  TableCell,
  TableRow,
} from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import DriverTrainingEducationTable from "./components/DriverTrainingEducationTable";
import IRootState from "@/store/interface";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchAppointments } from "@/store/appointment/appointment.actions";
import { debounce } from "lodash";
import moment from "moment";
import formatTimeToTwelveHours from "@/utils/formattime";
import CustomDialog from "@/components/CustomDialog";
import { getAllTrainingInstructions } from "@/store/masterlist/masterlist.actions";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import { fetchTrainingLogsByUserIdAndLessonId } from "@/store/user/user.actions";

// ==============================|| DRIVING TRAINING EDUCATION VIEW ||============================== //
const DrivingTrainingEducationView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");
  const [currentDate, setCurrentDate] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filteredDriverTrainingData, setFilteredDriverTrainingData] = React.useState([]);
  const [isTrainingLogsDialogOpen, setIsTrainingLogsDialogOpen] = React.useState<boolean>(false);
  const [currentAppointment, setCurrentAppointment] = React.useState<any>(null);

  const dispatch = useAppDispatch();

  const { appointmentList, appointmentListLoading, appointmentListError } =
    useAppSelector((state: IRootState) => state.appointment);

  const {
    instructions: { instructionsList, instructionsListLoading },
  } = useAppSelector((state: IRootState) => state.masterlist);

  const { instructorTrainingLogs, instructorTrainingLogsLoading } =
    useAppSelector((state: IRootState) => state.user);

  // Handlers
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const handleChangeDate = (date: string) => {
    setCurrentDate(date);
    dispatch(fetchAppointments(offset, limit, date, searchQuery));
  };

  const handleClearDate = () => {
    if (currentDate === "") return;
    setCurrentDate("");
    dispatch(fetchAppointments(offset, limit, "", searchQuery));
  };

  const handleCloseTrainingLogsDialog = () => {
    setIsTrainingLogsDialogOpen(false);
    setCurrentAppointment(null);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
    setOffset(newPage * rowsPerPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setLimit(newRowsPerPage);
    setPage(0);
    setOffset(0);
  };

  // Fetch options with debounce
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      try {
        dispatch(fetchAppointments(offset, limit, currentDate, searchTerm));
      } catch (error: any) {
        console.log("error", error);
      }
    }, 300),
    [dispatch, offset, limit, currentDate]
  );

  // Effects
  React.useEffect(() => {
    dispatch(fetchAppointments(offset, limit, currentDate, searchQuery));
  }, [dispatch, offset, limit, currentDate]);

  React.useEffect(() => {
    fetchOptions(searchQuery);
  }, [fetchOptions, searchQuery]);

  React.useEffect(() => {
    if (appointmentList?.appointment_schedule) {
      setFilteredDriverTrainingData(
        appointmentList?.appointment_schedule.map((item: any) => ({
          id: item?.id,
          student_id: item?.student_id,
          instructor_id: item?.instructor_id,
          studentName: item?.student_name,
          instructorName: item?.instructor_name,
          student: item?.student,
          instructor: item?.instructor,
          package: item?.package?.name ?? "-",
          lesson: item?.lesson?.name,
          classDate: moment(item?.appointment_date).format("MM-DD-YYYY") ?? "-",
          pickup: item?.pickup_location_type?.name ?? "-",
          pickupText: item?.pickup_text,
          timeIn: formatTimeToTwelveHours(item?.start_time),
          timeOut: formatTimeToTwelveHours(item?.end_time),
          confirmation: "Confirmed",
          status: item?.status?.name ?? "CONFIRMED",
          addedBy: item?.created_by?.first_name ?? "Admin",
          createdAt: moment(item?.created_at).format("MM-DD-YYYY") ?? "-",
          drivingSchool: item?.transaction?.driving_school ?? "-",
        }))
      );
    }
  }, [appointmentList]);

  React.useEffect(() => {
    if (currentAppointment) {
      const lessons = currentAppointment.student?.package
        ? currentAppointment.student?.package[0]?.lessons
        : [];
      const lessonIdList = lessons.map((lesson: any) => lesson.id);
      dispatch(
        fetchTrainingLogsByUserIdAndLessonId(
          currentAppointment.student.id,
          lessonIdList
        )
      );
    }
  }, [currentAppointment, dispatch]);

  React.useEffect(() => {
    dispatch(getAllTrainingInstructions());
  }, [dispatch]);

  // Utility functions
  const isCheckboxChecked = (
    trainingLogs: Record<number, any[]>,
    lessonId: number,
    trainingId: number
  ): boolean => {
    const logsForLesson = trainingLogs[lessonId];
    if (!logsForLesson) {
      return false;
    }
    return logsForLesson.some(
      (log: any) => log.training_id === trainingId && log.is_completed
    );
  };

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={
          appointmentListLoading ||
          instructionsListLoading ||
          instructorTrainingLogsLoading
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* =========Dialog to view Training Logs============= */}
      <CustomDialog
        open={isTrainingLogsDialogOpen}
        handleClose={handleCloseTrainingLogsDialog}
        handleAccept={() => {}}
        dialogTitle={"Training Logs"}
        fullWidth={true}
        // isSubmitOnTop={true}
        isFormikForm
        maxWidth={false}
        fullscreen={false}
      >
        <Box sx={{ p: 2 }}>
          {!instructionsListLoading ? (
            instructionsList && instructionsList.total_count > 0 ? (
              <Table aria-labelledby="tableTitle">
                <StyledTableHead>
                  <TableRow
                    sx={{
                      "& .MuiTableCell-root": {
                        padding: "4px 8px",
                        fontSize: "12px",
                      },
                    }}
                  >
                    <TableCell align="left">INSTRUCTIONS</TableCell>

                    {currentAppointment?.package?.lessons?.length > 0
                      ? currentAppointment?.package?.lessons?.map(
                          (lesson: any, index: number) => (
                            <TableCell
                              align="left"
                              key={index}
                              sx={{ fontSize: "12px", width: "35px" }}
                            >
                              {lesson.name}
                            </TableCell>
                          )
                        )
                      : null}
                    <TableCell align="left">INSTRUCTIONS</TableCell>
                    {currentAppointment?.package?.lessons?.length > 0
                      ? currentAppointment?.package?.lessons?.map(
                          (lesson: any, index: number) => (
                            <TableCell
                              align="left"
                              key={index}
                              sx={{ fontSize: "12px", width: "35px" }}
                            >
                              {lesson.name}
                            </TableCell>
                          )
                        )
                      : null}
                  </TableRow>
                </StyledTableHead>
                {instructionsList?.trainings.map(
                  (instruction: any, index: number) =>
                    // ===== to List the odd number on left side and even number on right side =====
                    index % 2 === 0 ? (
                      <StyledTableRow
                        hover
                        key={index}
                        sx={{
                          "& .MuiTableCell-root": {
                            padding: "4px 8px",
                            fontSize: "12px",
                          },
                        }}
                      >
                        <TableCell align="left">{instruction.name}</TableCell>
                        {currentAppointment?.package?.lessons?.length > 0
                          ? currentAppointment?.package?.lessons?.map(
                              (lesson: any, index: number) => (
                                <TableCell
                                  align="left"
                                  key={index}
                                  sx={{ fontSize: "12px", width: "35px" }}
                                >
                                  <Checkbox
                                    disabled
                                    checked={
                                      instructorTrainingLogs &&
                                      !instructorTrainingLogsLoading
                                        ? isCheckboxChecked(
                                            instructorTrainingLogs,
                                            lesson?.id,
                                            instruction?.id
                                          )
                                        : false
                                    }
                                  />
                                </TableCell>
                              )
                            )
                          : null}
                        {instructionsList?.trainings[index + 1] ? (
                          <Fragment>
                            <TableCell align="left">
                              {instructionsList?.trainings[index + 1].name}
                            </TableCell>

                            {currentAppointment?.package?.lessons?.length > 0
                              ? currentAppointment?.package?.lessons?.map(
                                  (lesson: any, i: number) => (
                                    <TableCell
                                      align="left"
                                      key={i}
                                      sx={{ fontSize: "12px", width: "35px" }}
                                    >
                                      <Checkbox
                                        disabled
                                        checked={
                                          instructorTrainingLogs &&
                                          !instructorTrainingLogsLoading
                                            ? isCheckboxChecked(
                                                instructorTrainingLogs,
                                                lesson?.id,
                                                instructionsList?.trainings[
                                                  index + 1
                                                ].id
                                              )
                                            : false
                                        }
                                      />
                                    </TableCell>
                                  )
                                )
                              : null}
                          </Fragment>
                        ) : null}
                      </StyledTableRow>
                    ) : null
                )}
              </Table>
            ) : null
          ) : null}
        </Box>
      </CustomDialog>
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
            setIsTrainingLogsDialogOpen={setIsTrainingLogsDialogOpen}
            setCurrentAppointment={setCurrentAppointment}
            driverTrainingData={appointmentList?.appointment_schedule}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={appointmentList?.total || 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            loading={appointmentListLoading}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default DrivingTrainingEducationView;
