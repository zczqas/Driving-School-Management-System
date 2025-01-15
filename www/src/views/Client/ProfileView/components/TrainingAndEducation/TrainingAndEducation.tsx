import React, { Fragment, useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableRow,
  TableCell,
  Checkbox,
  TableContainer,
  TableBody,
} from "@mui/material";
import DriverTrainingEducationTable from "./components/DriverTrainingEducationTable";
import CustomDialog from "@/components/CustomDialog";
import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { fetchScheduleAppointmentList } from "@/store/schedule/schedule.actions"; // Import the action
import DriversEd from "./components/DriversEd";
import Theme from "@/themes";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import { fetchTrainingLogsByUserIdAndLessonId } from "@/store/user/user.actions";
import { getAllTrainingInstructions } from "@/store/masterlist/masterlist.actions";
import moment from "moment";

const TrainingAndEducation = ({ userId, drivingSchoolName }: any) => {
  const dispatch = useAppDispatch();

  // Getting current logged in user role
  const userRole = useAppSelector(
    (state: IRootState) => state.auth.currentUser?.user?.role
  );

  // Accessing schedule appointment data from Redux store
  const { appointmentScheduleData, loading } = useAppSelector(
    (state: IRootState) => state.schedule
  );

  const [isTrainingLogsDialogOpen, setIsTrainingLogsDialogOpen] =
    useState<boolean>(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [tabIndex, setTabIndex] = useState(0);

  // Fetch schedule appointments on component mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchScheduleAppointmentList(userId));
    }
  }, [dispatch, userId]);

  const handleCloseTrainingLogsDialog = () => {
    setIsTrainingLogsDialogOpen(false);
    setCurrentAppointment(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const {
    instructions: { instructionsList, instructionsListLoading },
  } = useAppSelector((state: IRootState) => state.masterlist);

  const { instructorTrainingLogs, instructorTrainingLogsLoading } =
    useAppSelector((state: IRootState) => state.user);

  // ========= Handle Checkbox is checked or not =========
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

  // ========= Handle Change Current Appointment =========
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
  }, [currentAppointment]);

  React.useEffect(() => {
    dispatch(getAllTrainingInstructions());
  }, []);

  const [isViewNotesDialogOpen, setIsViewNotesDialogOpen] =
    useState<boolean>(false);

  const handleCloseViewNotesDialog = () => {
    setIsViewNotesDialogOpen(false);
  };

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const handleOpenViewNotesDialog = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsViewNotesDialogOpen(true);
  };

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={loading}
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

      {/* =========== Dialog to view Notes =========== */}
      <CustomDialog
        open={isViewNotesDialogOpen}
        handleClose={handleCloseViewNotesDialog}
        handleAccept={() => {}}
        dialogTitle={"Instructor Notes"}
        isNotAForm
      >
        <Box
          sx={{
            p: 2,
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <StyledTableHead>
                <TableRow>
                  <TableCell align="left">NOTE</TableCell>
                  <TableCell align="left">CREATED BY</TableCell>
                  <TableCell align="left">CREATED AT</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {selectedAppointment?.instructor_notes?.length > 0 ? (
                  <StyledTableRow
                    key={selectedAppointment?.instructor_notes[0]?.id}
                  >
                    <TableCell align="left">
                      {selectedAppointment?.instructor_notes[0]?.note ?? "-"}
                    </TableCell>
                    <TableCell align="left">
                      {selectedAppointment?.instructor_notes[0]?.createdBy ??
                        "-"}
                    </TableCell>
                    <TableCell align="left">
                      {moment(
                        selectedAppointment?.instructor_notes[0]?.created_at
                      ).format("MM-DD-YYYY ") ?? "-"}
                    </TableCell>
                  </StyledTableRow>
                ) : (
                  <StyledTableRow>
                    <TableCell align="center" colSpan={4}>
                      No notes found.
                    </TableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CustomDialog>

      <Box
        p={3}
        sx={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="Driving Training & Education"
          sx={{
            "& .MuiTab-root": {
              fontSize: "16px",
              lineHeight: "26px",
              fontWeight: 600,
              color: Theme.palette.common.black,
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#F37736",
            },
          }}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "#F37736",
            },
          }}
        >
          <Tab label="Driving Training" sx={{ width: "100%", padding: 3 }} />
          <Tab label="Drivers Ed" sx={{ width: "100%", padding: 3 }} />
        </Tabs>

        <Box
          sx={{
            mt: 2,
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
          }}
        >
          {tabIndex === 0 && (
            <DriverTrainingEducationTable
              drivingSchoolName={drivingSchoolName}
              setIsTrainingLogsDialogOpen={setIsTrainingLogsDialogOpen}
              setCurrentAppointment={setCurrentAppointment}
              driverTrainingData={appointmentScheduleData || []} // Passing the fetched data here
              userRole={userRole}
              handleOpenViewNotesDialog={handleOpenViewNotesDialog}
            />
          )}
          {tabIndex === 1 && <DriversEd userId={userId} />}
        </Box>
      </Box>
    </Fragment>
  );
};

export default TrainingAndEducation;
