import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import moment from "moment";
import Image from "next/image";
import React, { Fragment } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { TimePicker } from "@mui/x-date-pickers";
// import { MobileTimePicker as TimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import formatTimeToTwelveHours from "@/utils/formattime";
import { useAppDispatch } from "@/hooks";
import {
  fetchAppointmentsByDate,
  updateAppointmentStatus,
  updateAppointmentTime,
  updateVehicleMileage,
} from "@/store/appointment/appointment.actions";
import AutocompleteWithDynamicSearch from "./AutoCompleteWithDynamicSearch";
import { Save } from "@mui/icons-material";

interface Props {
  instructorData: any;
  setIsTrainingLogsDialogOpen: (value: boolean) => void;
  setCurrentAppointment: (value: any) => void;
  setIsEditNotesDialogOpen: (value: boolean) => void;
  handleOpenEditNotesDialog: (
    student_id: string,
    appointment_id: string,
    isEditNotes: boolean
  ) => void;
  currentDate: string;
  instructorId: string;
  handleOpenViewNotesDialog: (
    student_id: string,
    appointment_id: string
  ) => void;
}

const InstructorDailyLessonListingTable = ({
  currentDate,
  instructorId,
  instructorData,
  setIsTrainingLogsDialogOpen,
  setCurrentAppointment,
  setIsEditNotesDialogOpen,
  handleOpenEditNotesDialog,
  handleOpenViewNotesDialog,
}: Props) => {
  const styles = {
    subTitles: {
      fontSize: "12px",
      color: "#7E84A3",
    },
    tableCell: {
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      padding: "8px",
      fontSize: "13px",
      "&:last-child": {
        borderRight: "none",
      },
      "&:first-of-type": {
        paddingLeft: "16px",
      },
      "&:last-of-type": {
        paddingRight: "16px",
      },
    },
    tableCellContent: {
      "& .MuiTypography-root": {
        margin: "4px 0",
      },
    },
  };

  const dispatch = useAppDispatch();
  // ========== To not keep updating the time and mileage on every click without any changes ==========
  const [isUpdated, setIsUpdated] = React.useState(false);

  const [isDataMapped, setIsDataMapped] = React.useState(false);

  return (
    <Fragment>
      <TableContainer>
        <Formik
          initialValues={{
            currentInstructor: "",
            instructorSchedule: instructorData?.map(() => ({
              previous_time_in: "",
              previous_time_out: "",
              time_in: "",
              time_out: "",
              previous_start_mileage: "",
              previous_end_mileage: "",
              start_mileage: "",
              end_mileage: "",
              total_actual_time: "",
              status: "",
              previous_status: "",
            })),
          }}
          onSubmit={(values) => {
            console.log("values", values);
            if (
              values.currentInstructor &&
              values.instructorSchedule[values.currentInstructor].time_in &&
              values.instructorSchedule[values.currentInstructor].time_out &&
              (values.instructorSchedule[values.currentInstructor]
                .previous_time_in !==
                values.instructorSchedule[values.currentInstructor].time_in ||
                values.instructorSchedule[values.currentInstructor]
                  .previous_time_out !==
                  values.instructorSchedule[values.currentInstructor].time_out)
            ) {
              dispatch(
                updateAppointmentTime(
                  values.currentInstructor,
                  values.instructorSchedule[values.currentInstructor].time_in,
                  values.instructorSchedule[values.currentInstructor].time_out,
                  () => {
                    if (
                      values.currentInstructor &&
                      !values.instructorSchedule[values.currentInstructor]
                        .start_mileage &&
                      !values.instructorSchedule[values.currentInstructor]
                        .end_mileage
                    ) {
                      dispatch(
                        fetchAppointmentsByDate(
                          moment(currentDate).format("YYYY-MM-DD"),
                          instructorId
                        )
                      );
                      setIsUpdated(!isUpdated);
                    }
                  }
                )
              );
            }
            if (
              values.currentInstructor &&
              values.instructorSchedule[values.currentInstructor]
                .start_mileage &&
              values.instructorSchedule[values.currentInstructor].end_mileage &&
              (values.instructorSchedule[values.currentInstructor]
                .previous_start_mileage !==
                values.instructorSchedule[values.currentInstructor]
                  .start_mileage ||
                values.instructorSchedule[values.currentInstructor]
                  .previous_end_mileage !==
                  values.instructorSchedule[values.currentInstructor]
                    .end_mileage)
            ) {
              dispatch(
                updateVehicleMileage(
                  values.currentInstructor,
                  values.instructorSchedule[values.currentInstructor]
                    .start_mileage,
                  values.instructorSchedule[values.currentInstructor]
                    .end_mileage,
                  () => {
                    dispatch(
                      fetchAppointmentsByDate(
                        moment(currentDate).format("YYYY-MM-DD"),
                        instructorId
                      )
                    );
                    setIsUpdated(!isUpdated);
                  }
                )
              );
            }

            if (
              values.currentInstructor &&
              values.instructorSchedule[values.currentInstructor].status &&
              values.instructorSchedule[values.currentInstructor].status !==
                values.instructorSchedule[values.currentInstructor]
                  .previous_status
            ) {
              dispatch(
                updateAppointmentStatus(
                  values.currentInstructor,
                  values.instructorSchedule[values.currentInstructor].status
                    ?.id,
                  () => {
                    dispatch(
                      fetchAppointmentsByDate(
                        moment(currentDate).format("YYYY-MM-DD"),
                        instructorId
                      )
                    );
                    setIsUpdated(!isUpdated);
                  }
                )
              );
            }
          }}
        >
          {({
            touched,
            errors,
            values,
            handleBlur,
            handleChange,
            isSubmitting,
            handleSubmit,
            setFieldValue,
          }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              if (instructorData && instructorData.length > 0) {
                const mappedData = new Array(
                  Math.max(...instructorData.map((data: any) => data.id)) + 1
                ).fill(null);

                instructorData.forEach((data: any) => {
                  mappedData[data.id] = {
                    previous_time_in: data?.time_in ?? "",
                    previous_time_out: data?.time_out ?? "",
                    time_in:
                      data?.time_in ??
                      (data?.availability?.start_time
                        ? data?.availability?.start_time
                        : ""),
                    time_out:
                      data?.time_out ??
                      (data?.availability?.end_time
                        ? data?.availability?.end_time
                        : ""),
                    previous_start_mileage: data?.start_mileage
                      ? data?.start_mileage
                      : data?.availability?.vehicle?.odometer
                      ? data?.availability?.vehicle?.odometer
                      : "",
                    previous_end_mileage: data?.end_mileage ?? "",
                    start_mileage: data?.start_mileage ?? "",
                    end_mileage: data?.end_mileage ?? "",
                    total_actual_time: "",
                    status: data?.status
                      ? data?.status
                      : {
                          id: 12,
                          created_at: "2024-11-14T07:47:52.881628Z",
                          updated_at: "2024-11-14T07:47:52.881628Z",
                          is_active: true,
                          is_deleted: false,
                          name: "Confirmed",
                          description: "This appointment has been confirmed",
                        },
                    previous_status: data?.status ?? null,
                  };
                });

                console.log("instructorData", instructorData);

                setFieldValue("instructorSchedule", mappedData);
                console.log(mappedData);
                setIsDataMapped(true);
              }
            }, [instructorData, isUpdated]);

            // Calculate total time function
            const calculateTotalTime = (startTime: any, endTime: any) => {
              if (startTime && endTime) {
                const start = moment(startTime, "HH:mm");
                const end = moment(endTime, "HH:mm");
                const duration = moment.duration(end.diff(start));
                const hours = duration.hours();
                const minutes = duration.minutes();
                return `${hours}h ${minutes}m`;
              }
              return ""; // return empty string if either start or end time is missing
            };

            const calculateTotalMileage = (startMileage: any, endMileage: any) => {
              if (startMileage && endMileage) {
                return endMileage - startMileage;
              }
              return 0;
            };

            return (
              <Form>
                <Table
                  sx={{
                    minWidth: 750,
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    "& .MuiTableCell-root": styles.tableCell,
                    "& .MuiTableCell-head:first-of-type, & .MuiTableCell-body:first-of-type":
                      {
                        borderLeft: "1px solid rgba(224, 224, 224, 1)",
                      },
                    "& .MuiTableCell-head:last-child, & .MuiTableCell-body:last-child":
                      {
                        borderRight: "1px solid rgba(224, 224, 224, 1)",
                      },
                  }}
                  aria-labelledby="tableTitle"
                >
                  <StyledTableHead>
                    <TableRow>
                      <TableCell align="left" sx={{ minWidth: 130 }}>
                        START/STOP TIME
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 120 }}>
                        School
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 180 }}>
                        Student Details
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 150 }}>
                        Emergency Contacts
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 130 }}>
                        Pickup Location
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 100 }}>
                        Lesson Type
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 130 }}>
                        Actual Start/End Time
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 100 }}>
                        Total Lesson Time
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 120 }}>
                        Note
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 100 }}>
                        Instructor Notes
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 150 }}>
                        VEHICLE
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 130 }}>
                        Start/End Mileage
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 100 }}>
                        Mileage
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 100 }}>
                        Lesson Mileage
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 100 }}>
                        Training Log
                      </TableCell>
                      <TableCell align="left" sx={{ minWidth: 80 }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </StyledTableHead>

                  <FieldArray name="instructorSchedule">
                    {({ push, remove }) => (
                      <TableBody>
                        {instructorData?.length > 0 ? (
                          instructorData?.map((row: any, index: number) => (
                            <Fragment key={index}>
                              <StyledTableRow>
                                <TableCell
                                  align="left"
                                  sx={{ minWidth: "170px" }}
                                >
                                  <Typography
                                    sx={{ fontWeight: "bold", mb: 1 }}
                                  >
                                    {moment(row.scheduled_date).format(
                                      "YYYY-MM-DD"
                                    )}
                                  </Typography>
                                  <Stack>
                                    <Typography
                                      variant="subtitle1"
                                      sx={styles.subTitles}
                                    >
                                      Start :
                                    </Typography>
                                    <Typography variant="subtitle1">
                                      {row?.availability.start_time
                                        ? formatTimeToTwelveHours(
                                            row?.availability.start_time
                                          )
                                        : "-"}
                                    </Typography>
                                    <Typography
                                      variant="subtitle1"
                                      sx={styles.subTitles}
                                    >
                                      End :
                                    </Typography>

                                    <Typography variant="subtitle1">
                                      {row?.availability.end_time
                                        ? formatTimeToTwelveHours(
                                            row?.availability.end_time
                                          )
                                        : "-"}
                                    </Typography>
                                  </Stack>
                                </TableCell>

                                <TableCell align="left">
                                  {row?.driving_school?.name ? (
                                    <>
                                      <br />
                                      <b>{row?.driving_school?.name}</b>
                                    </>
                                  ) : null}
                                </TableCell>

                                {/* =============Student Details ============ */}
                                <TableCell align="left">
                                  <Stack
                                    spacing={1}
                                    sx={styles.tableCellContent}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      fontWeight="bold"
                                    >
                                      <Link
                                        href={`/manage/profile/${row?.student?.id}`}
                                      >
                                        {row?.student?.first_name
                                          ? `${row?.student?.first_name} ${
                                              row?.student?.middle_name ?? ""
                                            } ${row?.student?.last_name}`
                                          : "-"}
                                      </Link>
                                    </Typography>

                                    <Box>
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                        gutterBottom
                                      >
                                        Phone
                                      </Typography>
                                      <Typography>
                                        {row?.student?.profile
                                          ?.contact_information?.[0]
                                          ?.contact_phone ?? "-"}
                                      </Typography>
                                    </Box>

                                    <Box>
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                        gutterBottom
                                      >
                                        Primary Address
                                      </Typography>
                                      <Typography>
                                        {row?.student?.profile?.address ?? "-"}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </TableCell>

                                {/* =============Emergency Contacts ============ */}
                                <TableCell align="left">
                                  {row?.student?.profile?.contact_information &&
                                  Array.isArray(
                                    row.student.profile.contact_information
                                  ) &&
                                  row.student.profile.contact_information
                                    .length > 0 ? (
                                    <Stack spacing={1}>
                                      {row.student.profile.contact_information
                                        .filter(
                                          (contact: any) =>
                                            contact?.contact_name &&
                                            contact?.contact_phone &&
                                            contact?.contact_relationship
                                        )
                                        .sort((a: any, b: any) =>
                                          a.contact_type ===
                                          "FIRST_EMERGENCY_CONTACT"
                                            ? -1
                                            : 1
                                        )
                                        .map((contact: any, idx: number) => (
                                          <Box key={contact.id || idx}>
                                            <Typography
                                              variant="subtitle2"
                                              fontWeight="bold"
                                            >
                                              {contact.contact_relationship}
                                            </Typography>
                                            <Typography>
                                              {contact.contact_name}
                                            </Typography>
                                            <Typography>
                                              {contact.contact_phone}
                                            </Typography>
                                          </Box>
                                        ))}
                                    </Stack>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>

                                <TableCell align="left">
                                  <b>Pickup Location:</b>
                                  <br />
                                  <Typography>
                                    {row?.pickup_location_text ?? "-"}
                                  </Typography>
                                  <br />
                                  <b>City :</b>
                                  <br />
                                  <Typography>
                                    {row?.student?.profile?.city
                                      ? row?.student?.profile?.city
                                      : "-"}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  {row.lesson.name ?? "-"}
                                  <br />
                                  <b>#{row.lesson.alias}</b>
                                </TableCell>

                                <TableCell align="left">
                                  <Box sx={{ minWidth: "150px" }}>
                                    <FormControl
                                      variant="standard"
                                      // error={Boolean(
                                      //   touched?.instructorSchedule &&
                                      //     touched.instructorSchedule[index]
                                      //       ?.time_in &&
                                      //     errors.instructorSchedule[index]
                                      //       ?.time_in
                                      // )}
                                      sx={{ width: "100%" }}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        sx={styles.subTitles}
                                      >
                                        Start time:
                                      </Typography>
                                      <TimePicker
                                        orientation="landscape"
                                        name={`instructorSchedule[${row.id}].time_in`}
                                        // timeSteps={{ minutes: 15 }}
                                        value={moment(
                                          values.instructorSchedule[row.id]
                                            ?.time_in,
                                          "HH:mm"
                                        )}
                                        onChange={(value: any) => {
                                          if (value?._isValid) {
                                            setFieldValue(
                                              `instructorSchedule[${row.id}].time_in`,
                                              value.format("HH:mm")
                                            );

                                            if (
                                              !values.instructorSchedule[row.id]
                                                ?.time_out
                                            ) {
                                              // Calculate duration in minutes
                                              const startTime = moment(
                                                row.start_time,
                                                "HH:mm"
                                              );
                                              const endTime = moment(
                                                row.end_time,
                                                "HH:mm"
                                              );
                                              const duration = endTime.diff(
                                                startTime,
                                                "minutes"
                                              );

                                              // Calculate new end time
                                              const newEndTime = moment(
                                                value
                                              ).add(duration, "minutes");

                                              setFieldValue(
                                                `instructorSchedule[${row.id}].time_out`,
                                                newEndTime.format("HH:mm")
                                              );
                                            }
                                          }
                                        }}
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: "42px",
                                            borderRadius: "32px",
                                          },
                                        }}
                                      />
                                    </FormControl>
                                    <FormControl
                                      variant="standard"
                                      // error={Boolean(
                                      //   touched?.instructorSchedule &&
                                      //     touched.instructorSchedule[index]
                                      //       ?.time_in &&
                                      //     errors.instructorSchedule[index]
                                      //       ?.time_in
                                      // )}
                                      sx={{ width: "100%" }}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        sx={styles.subTitles}
                                      >
                                        End time:
                                      </Typography>
                                      <TimePicker
                                        name={`instructorSchedule[${row.id}].time_out`}
                                        value={moment(
                                          values.instructorSchedule[row.id]
                                            ?.time_out,
                                          "HH:mm"
                                        )}
                                        onChange={(value: any) => {
                                          if (value?._isValid) {
                                            setFieldValue(
                                              `instructorSchedule[${row.id}].time_out`,
                                              value.format("HH:mm")
                                            );
                                          }
                                        }}
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: "42px",
                                            borderRadius: "32px",
                                          },
                                        }}
                                      />
                                    </FormControl>
                                  </Box>
                                </TableCell>
                                <TableCell align="left">
                                  {calculateTotalTime(
                                    values.instructorSchedule[row.id]?.time_in,
                                    values.instructorSchedule[row.id]?.time_out
                                  )}
                                </TableCell>
                                <TableCell align="left">
                                  {row.notes ?? "-"}
                                </TableCell>

                                {/* =============INSTRUCTOR NOTES ============ */}

                                <TableCell align="left">
                                  <Stack direction="row" spacing={2}>
                                    <Link
                                      onClick={() => {
                                        handleOpenViewNotesDialog(
                                          row.student_id,
                                          row.id
                                        );
                                      }}
                                      sx={{
                                        cursor: "pointer",
                                      }}
                                    >
                                      View Notes
                                    </Link>

                                    <Link
                                      onClick={() => {
                                        setIsEditNotesDialogOpen(true);
                                        handleOpenEditNotesDialog(
                                          row.student_id,
                                          row.id,
                                          Boolean(row.instructor_notes[0])
                                        );
                                      }}
                                      sx={{
                                        cursor: "pointer",
                                      }}
                                    >
                                      {Boolean(row.instructor_notes[0])
                                        ? "Edit"
                                        : "Add"}{" "}
                                      Note
                                    </Link>
                                  </Stack>
                                </TableCell>

                                {/* =============VEHICLE ============ */}
                                <TableCell align="left">
                                  <Typography>
                                    {row?.availability?.vehicle.id
                                      ? `${row?.availability?.vehicle.color} ${row?.availability?.vehicle.brand} ${row?.availability?.vehicle.model} ${row?.availability?.vehicle.year} ${row?.availability?.vehicle.plate_number}`
                                      : "-"}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left">
                                  <Box sx={{ minWidth: "150px" }}>
                                    <Typography
                                      variant="subtitle1"
                                      sx={styles.subTitles}
                                    >
                                      Start Mileage:
                                    </Typography>
                                    <CustomInput
                                      type="number"
                                      name={`instructorSchedule[${row.id}].start_mileage`}
                                      value={
                                        values.instructorSchedule[row.id]
                                          ?.start_mileage
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      sx={{
                                        width: "100%",
                                        "& .MuiInputBase-input": {
                                          height: "8px",
                                        },
                                      }}
                                    />
                                    <Typography
                                      variant="subtitle1"
                                      sx={styles.subTitles}
                                    >
                                      End Mileage:
                                    </Typography>
                                    <CustomInput
                                      type="number"
                                      name={`instructorSchedule[${row.id}].end_mileage`}
                                      value={
                                        values.instructorSchedule[row.id]
                                          ?.end_mileage
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      sx={{
                                        width: "100%",
                                        "& .MuiInputBase-input": {
                                          height: "8px",
                                        },
                                      }}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell align="left">
                                  {calculateTotalMileage(
                                    values.instructorSchedule[row.id]
                                      ?.start_mileage,
                                    values.instructorSchedule[row.id]
                                      ?.end_mileage
                                  )}
                                </TableCell>
                                <TableCell align="left">
                                  <Link
                                    onClick={() => {
                                      setIsTrainingLogsDialogOpen(true);
                                      setCurrentAppointment(row);
                                    }}
                                    sx={{
                                      cursor: "pointer",
                                    }}
                                  >
                                    Edit Log
                                  </Link>
                                </TableCell>
                                <TableCell align="left">
                                  <Box sx={{ minWidth: "200px" }}>
                                    {isDataMapped && (
                                      <AutocompleteWithDynamicSearch
                                        endpoint="/appointment_schedule/status/get"
                                        fieldNameKey={"instructorSchedule"}
                                        fieldNameIndex={row?.id}
                                        fieldName={`instructorSchedule[${row.id}].status`}
                                        setFieldValue={setFieldValue}
                                        values={values}
                                        placeholder="Select Status"
                                        fetchedOptionsKey="appointment_schedule_status"
                                        nestedFieldName
                                      />
                                    )}
                                  </Box>
                                </TableCell>

                                <TableCell align="left">
                                  <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                      height: "40px",
                                      width: "80px",
                                      padding: "0px",
                                      backgroundColor: "#09A548",
                                      "&:hover": {
                                        backgroundColor: "#F37736",
                                      },
                                      mr: 1,
                                      transition:
                                        "background-color 0.3s ease-in-out",
                                      fontSize: "18px",
                                      fontWeight: "bold",
                                    }}
                                    onClick={() => {
                                      setFieldValue(
                                        "currentInstructor",
                                        row.id
                                      );
                                      handleSubmit();
                                    }}
                                  >
                                    Save
                                  </Button>
                                </TableCell>
                              </StyledTableRow>
                            </Fragment>
                          ))
                        ) : (
                          <StyledTableRow>
                            <TableCell
                              component="th"
                              scope="row"
                              colSpan={17}
                              align="left"
                            >
                              No Instructor Lesson Listing found
                            </TableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    )}
                  </FieldArray>
                </Table>
              </Form>
            );
          }}
        </Formik>
      </TableContainer>
    </Fragment>
  );
};

export default InstructorDailyLessonListingTable;
