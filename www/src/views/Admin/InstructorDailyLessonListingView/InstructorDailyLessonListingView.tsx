import {
  Backdrop,
  Box,
  Button,
  Checkbox as MuiCheckBox,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  Table,
  TableCell,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import React, { Fragment, useEffect } from "react";
import SubHeader from "./components/SubHeader";
import InstructorDailyLessonListingTable from "./components/InstructorDailyLessonListingTable";
import { useRouter } from "next/router";
import { fetchAppointmentsByDate } from "@/store/appointment/appointment.actions";
import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { CustomInput, CustomLabel, DatePicker } from "@/components/CustomInput";
import { CustomInputTime } from "./components/CustomInput";
import { Form, Formik } from "formik";
import CustomDialog from "@/components/CustomDialog";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import { getAllTrainingInstructions } from "@/store/masterlist/masterlist.actions";
import AutocompleteWithDynamicSearch from "@/views/Admin/InstructorView/components/AutoCompleteWithDynamicSearch";

// import chunkArray from "@/utils/chunkarray";
import * as Yup from "yup";
import {
  addInstructorNote,
  createTrainingLogs,
  getInstructorNotesByUserId,
  updateInstructorNotes,
  updateTrainingLogs,
} from "@/store/user/user.actions";
import { fetchTrainingLogsByUserIdAndLessonId } from "@/store/user/user.actions";
import { InputFormLabel } from "@/views/Client/ProfileView/components/ProfileInformation/ProfileInformation";
import moment from "moment";
import InstructorNotes from "@/views/Client/ProfileView/components/InstructorNotes/InstructorNotesView";

const InstructorDailyLessonListingView = () => {
  const router = useRouter();
  const { date, instructor_id, instructor_name } = router.query;

  const firstName = Array.isArray(instructor_name)
    ? instructor_name[0]?.split(" ")[0]
    : instructor_name?.split(" ")[0];
  const lastName = Array.isArray(instructor_name)
    ? instructor_name[0]?.split(" ")[1]
    : instructor_name?.split(" ")[1];

  const selectedInstructor = {
    id: instructor_id,
    first_name: firstName,
    middle_name: null,
    last_name: lastName,
    role: "INSTRUCTOR",
  };

  console.log({ selectedInstructor });

  const [currentDate, setCurrentDate] = React.useState<string>(
    (date as string) ?? new Date().toISOString().split("T")[0]
  );

  const [isTrainingLogsDialogOpen, setIsTrainingLogsDialogOpen] =
    React.useState<boolean>(false);
  const [currentAppointment, setCurrentAppointment] = React.useState<any>(null);

  const [isEditNotesDialogOpen, setIsEditNotesDialogOpen] =
    React.useState<boolean>(false);
  const [editNotesId, setEditNotesId] = React.useState<{
    appointment_id?: string;
    student_id: string;
  } | null>(null);
  const [isEditNotes, setIsEditNotes] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { appointmentByDate, appointmentByDateLoading } = useAppSelector(
    (state: IRootState) => state.appointment
  );

  const { instructorTrainingLogs, instructorTrainingLogsLoading } =
    useAppSelector((state: IRootState) => state.user);

  const { user: currentUser } = useAppSelector(
    (state: IRootState) => state.auth.currentUser
  );

  // ========= Handle Change Date =========
  React.useEffect(() => {
    console.log("date", date, "currentDate", currentDate);
    if (date !== currentDate) {
      router.replace(
        `/manage/instructor-daily-lesson-listing?date=${currentDate}&instructor_id=${instructor_id}&instructor_name=${instructor_name}`,
        undefined,
        { shallow: true }
      );
    }
    console.log("first");
    dispatch(
      fetchAppointmentsByDate(
        moment(currentDate).format("YYYY-MM-DD"),
        instructor_id as string
      )
    );
  }, [date, instructor_id, currentDate]);

  function handleChangeDate(date: string) {
    // console.log(date);
    setCurrentDate(date);
  }

  React.useEffect(() => {
    if ((!date || !instructor_id) && currentUser?.role !== "INSTRUCTOR") {
      router.push("/404");
    }
  }, []);

  // ========= Handle Open Edit Notes Dialog =========
  function handleOpenEditNotesDialog(
    student_id: string,
    appointment_id: string,
    isEditNotes: boolean = false
  ) {
    setEditNotesId({ student_id, appointment_id });
    setIsEditNotesDialogOpen(true);
    if (isEditNotes) {
      setIsEditNotes(true);
    } else if (!isEditNotes) {
      setIsEditNotes(false);
    }
  }

  function handleCloseTrainingLogsDialog() {
    setIsTrainingLogsDialogOpen(false);
    setCurrentAppointment(null);
  }

  // ========= Handle Change Current Appointment =========
  React.useEffect(() => {
    if (currentAppointment) {
      console.log("currentAppointment", currentAppointment);
      const lessons = currentAppointment?.package
        ? currentAppointment?.package?.lessons
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

  // ========= Handle Change Checkbox =========
  const handleCheckboxChange = (lessonId: number, trainingId: number) => {
    console.log("checking li ti", lessonId, trainingId);
    const logsForLesson = instructorTrainingLogs
      ? instructorTrainingLogs[lessonId]
      : [];
    console.log("logsForLesson", logsForLesson);
    if (!logsForLesson.some((log: any) => log.training_id === trainingId)) {
      // If logs for lesson does not exist then create new logs
      dispatch(
        createTrainingLogs(
          trainingId,
          currentAppointment?.student?.id,
          lessonId,
          () => {}
        )
      );
    } else if (
      logsForLesson.some((log: any) => log.training_id === trainingId)
    ) {
      // If logs for lesson exists then update the logs
      const currentTrainingLog = logsForLesson.find(
        (log: any) => log.training_id === trainingId
      );
      dispatch(
        updateTrainingLogs(
          currentTrainingLog?.id,
          trainingId,
          currentAppointment?.student?.id,
          lessonId,
          !currentTrainingLog?.is_completed,
          () => {}
        )
      );
    }
    // console.log(lessonId, trainingId);
  };

  function handleCloseEditNotesDialog() {
    setIsEditNotesDialogOpen(false);
    setEditNotesId(null);
    // ======= Set Timeout as dialog closes after 500ms =======
    setTimeout(() => {
      setIsEditNotes(false);
    }, 500);
  }

  useEffect(() => {
    dispatch(getAllTrainingInstructions());
  }, []);

  const {
    instructions: { instructionsList, instructionsListLoading },
  } = useAppSelector((state: IRootState) => state.masterlist);

  const Checkbox = styled(MuiCheckBox)(({ theme }) => ({
    "& .MuiSvgIcon-root": {
      width: 20,
      height: 20,
    },
  }));

  const [isViewNotesDialogOpen, setIsViewNotesDialogOpen] =
    React.useState<boolean>(false);

  function handleCloseViewNotesDialog() {
    setIsViewNotesDialogOpen(false);
  }

  function handleOpenViewNotesDialog(
    student_id: string,
    appointment_id: string
  ) {
    setIsViewNotesDialogOpen(true);
    dispatch(getInstructorNotesByUserId(student_id));
  }

  const { instructorNotesByUserId, instructorNotesByUserIdLoading } =
    useAppSelector((state: IRootState) => state.user);

  return (
    <Fragment>
      {/* =========loading backdrop========== */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={
          instructionsListLoading ||
          instructorTrainingLogsLoading ||
          appointmentByDateLoading
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
                                    disabled={
                                      lesson?.id !==
                                      currentAppointment?.lesson_id
                                    }
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
                                    onClick={() => {
                                      handleCheckboxChange(
                                        lesson?.id,
                                        instruction?.id
                                      );
                                    }}
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
                                        disabled={
                                          lesson?.id !==
                                          currentAppointment?.lesson_id
                                        }
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
                                        onClick={() => {
                                          handleCheckboxChange(
                                            lesson?.id,
                                            instructionsList?.trainings[
                                              index + 1
                                            ].id
                                          );
                                        }}
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
          {/* {!instructionsListLoading
            ? instructionsList && instructionsList.length > 0
              ? // Chunk Array function will divide the array into chunks of 26 so that we can display 26 instructions in a table
                chunkArray(instructionsList, 26).map((chunk, index) => (
                  <Table
                    sx={{ minWidth: false }}
                    aria-labelledby="tableTitle"
                    key={index}
                  >
                    <StyledTableHead>
                      <TableRow>
                        <TableCell align="left">INSTRUCTIONS</TableCell>
                      </TableRow>
                    </StyledTableHead>
                    {chunk.map((instruction, index) => (
                      <StyledTableRow hover key={index}>
                        <TableCell align="left" >
                          {instruction.name}
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </Table>
                ))
              : null
            : null} */}
        </Box>
      </CustomDialog>

      {/* =============Dialog to view INSTRUCTOR NOTES ============ */}
      <CustomDialog
        open={isViewNotesDialogOpen}
        handleClose={handleCloseViewNotesDialog}
        handleAccept={() => {}}
        dialogTitle={"INSTRUCTOR NOTES"}
        fullWidth={true}
        maxWidth={"md"}
        isFormikForm={true}
        isNotAForm
      >
        <Box sx={{ p: 2 }}>
          <InstructorNotes
            instructorNotesByUserId={instructorNotesByUserId}
            instructorNotesByUserIdLoading={instructorNotesByUserIdLoading}
          />
        </Box>
      </CustomDialog>

      {/* ========Dialog for adding / editing notes============= */}
      <CustomDialog
        open={isEditNotesDialogOpen}
        handleClose={handleCloseEditNotesDialog}
        handleAccept={() => {}}
        dialogTitle={`${isEditNotes ? "Edit" : "Add"} Notes`}
        fullWidth={true}
        maxWidth={"md"}
        isFormikForm
      >
        <Box sx={{ p: 2, display: "flex" }}>
          <Formik
            initialValues={{
              notes_id: "",
              notes: "",
            }}
            validationSchema={Yup.object().shape({
              notes: Yup.string().required("Required"),
            })}
            onSubmit={(values) => {
              console.log(values);
              if (editNotesId?.student_id && editNotesId?.appointment_id) {
                if (isEditNotes) {
                  dispatch(
                    updateInstructorNotes(values.notes, values.notes_id, () => {
                      handleCloseEditNotesDialog();
                      dispatch(
                        fetchAppointmentsByDate(
                          moment(currentDate).format("YYYY-MM-DD"),
                          instructor_id as string
                        )
                      );
                    })
                  );
                  return;
                }
                dispatch(
                  addInstructorNote(
                    values.notes,
                    editNotesId?.student_id,
                    editNotesId?.appointment_id,
                    () => {
                      handleCloseEditNotesDialog();
                      dispatch(
                        fetchAppointmentsByDate(
                          moment(currentDate).format("YYYY-MM-DD"),
                          instructor_id as string
                        )
                      );
                    }
                  )
                );
              }
            }}
          >
            {({
              values,
              handleSubmit,
              touched,
              errors,
              handleChange,
              setFieldValue,
            }) => {
              // ===========  Set the notes if it is Edit Notes Dialog ===========
              // eslint-disable-next-line react-hooks/rules-of-hooks
              React.useEffect(() => {
                console.log(isEditNotes, editNotesId);
                if (editNotesId?.student_id && editNotesId?.appointment_id) {
                  const appointment =
                    appointmentByDate?.appointment_schedule.find(
                      (appointment: any) =>
                        appointment.id === editNotesId?.appointment_id
                    );
                  if (
                    appointment &&
                    appointment.instructor_notes &&
                    appointment.instructor_notes?.length > 0
                  ) {
                    setFieldValue(
                      "notes",
                      appointment.instructor_notes[0].note ?? ""
                    );
                    setFieldValue(
                      "notes_id",
                      appointment.instructor_notes[0].id
                    );
                  }
                }
              }, [editNotesId]);

              return (
                <Form style={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      padding: "20px ",
                      background: "#fff",
                    }}
                  >
                    <Grid container spacing={2} maxWidth={"md"}>
                      <Grid item xs={12}>
                        <FormControl
                          variant="standard"
                          error={Boolean(touched.notes && errors.notes)}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor={"notes"}>
                            Notes:
                          </CustomLabel>
                          <CustomInput
                            id={"notes"}
                            type={"text"}
                            value={values.notes}
                            name={"notes"}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter Notes"
                            multiline
                            rows={4}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleCloseEditNotesDialog}
                        sx={{
                          width: "120px",
                          height: "52px",
                          borderRadius: "32px",
                          fontWeight: "700",
                          fontSize: "16px",
                          marginTop: "20px",
                          mr: 2,
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          width: "120px",
                          height: "52px",
                          borderRadius: "32px",
                          background: "#1E4DB7",
                          color: "#FFFFFF",
                          fontWeight: "700",
                          fontSize: "16px",
                          marginTop: "20px",
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </CustomDialog>
      {currentUser?.role === "INSTRUCTOR" ? null : (
        <Box>
          {/* ======== Change Instructor Filter form ========== */}
          <Formik
            initialValues={{
              lessonDate: "",
              instructor: selectedInstructor,
            }}
            // validationSchema={Yup.object().shape({
            //   lessonDate: Yup.string().required("Required"),
            //   instructor: Yup.object().required("Required"),
            // })}
            onSubmit={(values) => {
              console.log(values);
              router.push(
                `/manage/instructor-daily-lesson-listing/?date=${
                  currentDate ? currentDate : date
                }&instructor_id=${
                  values?.instructor
                    ? (values?.instructor as { id: string })?.id
                    : null
                }&instructor_name=${
                  values?.instructor
                    ? `${
                        (values?.instructor as { first_name: string })
                          ?.first_name
                      } ${
                        (values?.instructor as { last_name: string })?.last_name
                      }`
                    : null
                }`
              );
            }}
          >
            {({ values, handleSubmit, touched, errors, setFieldValue }) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              React.useEffect(() => {
                setFieldValue("instructor", selectedInstructor);
              }, [selectedInstructor]);
              return (
                <Form>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      padding: "20px ",
                      background: "#fff",
                      // justifyContent: "center",
                    }}
                  >
                    {" "}
                    <Box>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.instructor && errors.instructor)}
                        sx={{ width: { md: "400px", sm: "200px" } }}
                      >
                        <CustomLabel shrink htmlFor={"instructor"}>
                          Change Instructor:
                        </CustomLabel>
                        <AutocompleteWithDynamicSearch
                          fieldName="instructor"
                          endpoint="/user/get"
                          setFieldValue={setFieldValue}
                          values={values}
                          placeholder="Search Instructor"
                          fetchedOptionsKey="users"
                          getOptionLabel={(option: any) =>
                            `${option.first_name} ${option.last_name}`
                          }
                          userRole="INSTRUCTOR"
                        />
                      </FormControl>
                    </Box>
                    <Box sx={{ pt: 3.3 }}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.lessonDate && errors.lessonDate)}
                        sx={{ width: "100%" }}
                      >
                        <DatePicker
                          name="lessonDate"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "52px",
                              borderRadius: "32px",
                            } as React.CSSProperties,
                          }}
                          value={
                            currentDate
                              ? moment(currentDate, "MM-DD-YYYY")
                              : null
                          }
                          format="MM-DD-YYYY"
                          onChange={(value: any) => {
                            if (value?._isValid) {
                              // setFieldValue(
                              //   "lessonDate",
                              //   value.format("MM-DD-YYYY")
                              // );
                              setCurrentDate(value.format("MM-DD-YYYY"));
                            }
                          }}
                        />
                      </FormControl>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        width: "100px",
                        height: "48px",
                        borderRadius: "32px",
                        background: "#1E4DB7",
                        color: "#FFFFFF",
                        fontWeight: "700",
                        fontSize: "16px",
                        marginTop: "30px",
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      )}

      <Container
        maxWidth={false}
        sx={{
          p: 0.5,
          transform: "scale(0.75)", // Scales the container to 80%
          transformOrigin: "left", // Sets the origin to scale from the center
          width: "100%", // Ensures it takes the full width
        }}
      >
        {currentUser?.role === "INSTRUCTOR" ? (
          <SubHeader
            subTitle={``}
            title={``}
            handleChangeDate={handleChangeDate}
            isInstructor={currentUser?.role === "INSTRUCTOR"}
          />
        ) : null}

        <Box
          sx={{
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          {/* <Box
            sx={{
              background: "#E5E4E4",
              borderRadius: "8px 8px 0px 0px",
              padding: "22px 12px",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              INSTRUCTOR DAILY LESSON LISTING FOR
            </Typography>
            <Typography
              variant="h4"
              sx={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              {instructor_name}{" "}
            </Typography>
          </Box> */}
          {/* Hide filters in instructor daily lesson listing */}
          {/* <Grid
            container
            rowSpacing={2}
            columnSpacing={2}
            sx={{
              marginBottom: "-40px",
              padding: "25px 300px 0px 300px",
              margin: "auto",
            }}
          >
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomLabel shrink htmlFor={"coupon"}>
                  Temp Time:
                </CustomLabel>
                <CustomInputTime
                  id={"coupon"}
                  type={"text"}
                  // value={}
                  name={"coupon"}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  inputProps={{}}
                  placeholder="Select Time"
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomLabel shrink htmlFor={"coupon"}>
                  Temp Time:
                </CustomLabel>
                <CustomInputTime
                  id={"coupon"}
                  type={"text"}
                  // value={}
                  name={"coupon"}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  inputProps={{}}
                  placeholder="Select Time"
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomLabel shrink htmlFor={"coupon"}>
                  Temp Time:
                </CustomLabel>
                <CustomInputTime
                  id={"coupon"}
                  type={"text"}
                  // value={}
                  name={"coupon"}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  inputProps={{}}
                  placeholder="Select Time"
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomLabel shrink htmlFor={"coupon"}>
                  Temp Time:
                </CustomLabel>
                <CustomInputTime
                  id={"coupon"}
                  type={"text"}
                  // value={}
                  name={"coupon"}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  inputProps={{}}
                  placeholder="Select Time"
                />
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomLabel shrink htmlFor={"coupon"}>
                  Temp Time:
                </CustomLabel>
                <CustomInputTime
                  id={"coupon"}
                  type={"text"}
                  // value={}
                  name={"coupon"}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  inputProps={{}}
                  placeholder="Select Time"
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomLabel shrink htmlFor={"coupon"}>
                  Temp Time:
                </CustomLabel>
                <CustomInputTime
                  id={"coupon"}
                  type={"text"}
                  // value={}
                  name={"coupon"}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  inputProps={{}}
                  placeholder="Select Time"
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomLabel shrink htmlFor={"coupon"}>
                  Temp Time:
                </CustomLabel>
                <CustomInputTime
                  id={"coupon"}
                  type={"text"}
                  // value={}
                  name={"coupon"}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  inputProps={{}}
                  placeholder="Select Time"
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomLabel shrink htmlFor={"coupon"}>
                  Temp Time:
                </CustomLabel>
                <CustomInputTime
                  id={"coupon"}
                  type={"text"}
                  // value={}
                  name={"coupon"}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  inputProps={{}}
                  placeholder="Select Time"
                />
              </Box>
            </Grid>
          </Grid> */}
          <Box
            sx={{
              padding: "20px",
            }}
          >
            <InstructorDailyLessonListingTable
              setIsTrainingLogsDialogOpen={setIsTrainingLogsDialogOpen}
              setCurrentAppointment={setCurrentAppointment}
              instructorData={appointmentByDate?.appointment_schedule ?? []}
              setIsEditNotesDialogOpen={setIsEditNotesDialogOpen}
              handleOpenEditNotesDialog={handleOpenEditNotesDialog}
              currentDate={currentDate}
              instructorId={instructor_id as string}
              handleOpenViewNotesDialog={handleOpenViewNotesDialog}
            />
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default InstructorDailyLessonListingView;
