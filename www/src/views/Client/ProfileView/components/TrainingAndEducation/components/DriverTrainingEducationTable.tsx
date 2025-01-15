import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import moment from "moment";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import convertTo12HourFormat from "@/utils/convertTo12HourFormat";
import Image from "next/image";
import AutocompleteWithDynamicSearch from "./components/AutoComplete";
import { lato } from "@/themes/typography";

interface Props {
  loading?: boolean;
  driverTrainingData: any[];
  setIsTrainingLogsDialogOpen: (value: boolean) => void;
  setCurrentAppointment: (value: any) => void;
  userRole?: string;
  handleOpenViewNotesDialog: (appointment: any) => void;
  drivingSchoolName: string;
}

const DriverTrainingEducationTable: React.FC<Props> = ({
  loading = false,
  driverTrainingData = [],
  setIsTrainingLogsDialogOpen,
  setCurrentAppointment,
  userRole = "",
  handleOpenViewNotesDialog,
  drivingSchoolName,
}) => {
  const router = useRouter();

  type ColumnDef = {
    id: string;
    label: string;
    minWidth: number;
    align?: "center" | "right" | "left" | "inherit" | "justify";
  };

  const columns: ColumnDef[] = [
    { id: "number", label: "No.", minWidth: 30 },
    { id: "drivingSchool", label: "Driving School", minWidth: 160 },
    { id: "instructorName", label: "Instructor Name", minWidth: 100 },
    { id: "lesson", label: "Lesson", minWidth: 100 },
    { id: "address", label: "Address", minWidth: 160 },
    { id: "pickupText", label: "Pickup Text", minWidth: 160 },
    { id: "classDate", label: "Class Date", minWidth: 120 },
    { id: "timeIn", label: "Time In", minWidth: 100 },
    { id: "timeOut", label: "Time Out", minWidth: 100 },
    { id: "status", label: "Status", minWidth: 250 },

    ...(userRole === "ADMIN"
      ? ([
          { id: "createdBy", label: "Created By", minWidth: 140 },
          { id: "createdAt", label: "Created At", minWidth: 140 },
          { id: "action", label: "Actions", minWidth: 140, align: "center" },
        ] as ColumnDef[])
      : []),
  ];

  return (
    <React.Fragment>
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer>
            <Table stickyHeader>
              <StyledTableHead>
                <StyledTableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                      align={column.align || "left"}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </StyledTableRow>
              </StyledTableHead>

              {loading ? (
                <TableBody>
                  <Typography>Loading...</Typography>
                </TableBody>
              ) : (
                <TableBody>
                  {driverTrainingData.length > 0 ? (
                    driverTrainingData.map((row, index) => (
                      <StyledTableRow key={index} hover>
                        <TableCell align="center">{index + 1}</TableCell>
                        {/* User means Instructor */}
                        <TableCell>{drivingSchoolName}</TableCell>
                        <TableCell>{`${row?.availability?.user.first_name} ${row?.availability?.user.last_name}`}</TableCell>
                        <TableCell>{row.lesson.name}</TableCell>
                        <TableCell>
                          {row?.student?.profile?.address || "-"}
                        </TableCell>
                        <TableCell>
                          {row?.pickup_location_text || "-"}
                        </TableCell>
                        <TableCell>{row?.scheduled_date || "-"}</TableCell>
                        <TableCell>
                          {convertTo12HourFormat(row.availability.start_time)}
                        </TableCell>
                        <TableCell>
                          {convertTo12HourFormat(row.availability.end_time)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              minWidth:
                                userRole === "STUDENT" ? "0px" : "200px",
                            }}
                          >
                            {userRole === "STUDENT" ? (
                              row?.status ? (
                                row.status?.name
                              ) : (
                                "Confirmed"
                              )
                            ) : (
                              <AutocompleteWithDynamicSearch
                                endpoint="/appointment_schedule/status/get"
                                status={
                                  row?.status || { id: "12", name: "Confirmed" }
                                }
                                appointmentId={row?.id}
                                placeholder="Select Status"
                                fetchedOptionsKey="appointment_schedule_status"
                              />
                            )}
                          </Box>
                        </TableCell>
                        {userRole === "ADMIN" && (
                          <>
                            <TableCell>
                              {row?.created_by?.first_name ?? "Admin"}
                            </TableCell>
                            <TableCell>
                              {moment(row?.created_at).format(
                                "MM-DD-YYYY hh:mm A"
                              ) ?? "-"}
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                  variant="outlined"
                                  sx={{
                                    minWidth: 120,
                                  }}
                                  onClick={() => {
                                    handleOpenViewNotesDialog(row);
                                  }}
                                >
                                  View Notes
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    setIsTrainingLogsDialogOpen(true);
                                    setCurrentAppointment(row);
                                  }}
                                >
                                  Logs
                                </Button>

                                <Button
                                  variant="contained"
                                  startIcon={
                                    <Image
                                      src="/icons/edit.svg"
                                      alt="edit"
                                      height={16}
                                      width={16}
                                    />
                                  }
                                  sx={{
                                    height: "32px", // Smaller height
                                    minWidth: "auto",
                                    padding: "4px 12px",
                                    backgroundColor: "#F37736",
                                    color: "#fff",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    borderRadius: "32px",
                                    "&:hover": {
                                      backgroundColor: "#E66826",
                                    },
                                    mr: 1,
                                  }}
                                  onClick={() => {
                                    router.push(
                                      `/manage/schedule-lessons/?student_id=${row?.student_id}&first_name=${row?.student?.first_name}&last_name=${row?.student?.last_name}&appointment_id=${row?.id}&isEdit=true`
                                    );
                                  }}
                                >
                                  Edit
                                </Button>
                              </Box>
                            </TableCell>
                          </>
                        )}
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <TableCell colSpan={columns.length} align="center">
                        No appointments found
                      </TableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default DriverTrainingEducationTable;
