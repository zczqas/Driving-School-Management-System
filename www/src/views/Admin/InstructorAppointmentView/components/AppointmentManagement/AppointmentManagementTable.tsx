import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import formatDateToString from "@/utils/formatDateToString";

const AppointmentManagementTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  appointmentData = [],
  changeDriverTrainingStatus = () => {},
  handleAppointmentDelete = () => {},
}: Props) => {
  const router = useRouter();
  interface ColumnType {
    id:
      | "id"
      | "classDate"
      | "studentName"
      | "lesson"
      | "address"
      | "location"
      | "startTime"
      | "endTime"
      | "vehicle"
      | "pickupText"
      | "timeIn"
      | "timeOut"
      | "status"
      | "confirmation"
      | "addedBy"
      | "action"
      | "number";
    label: string;
    minWidth?: number;
    align?: "center" | "right" | "left";
    format?: (value: number) => string;
  }
  const columns: readonly ColumnType[] = [
    {
      id: "number",
      label: "No.",
      minWidth: 30,
      align: "left",
    },
    {
      id: "classDate",
      label: "Class Date",
      minWidth: 100,
      align: "left",
    },
    {
      id: "studentName",
      label: "Student Name",
      minWidth: 100,
      align: "left",
    },
    { id: "lesson", label: "Lesson", minWidth: 100, align: "left" },
    {
      id: "address",
      label: "Address",
      minWidth: 100,
      align: "left",
    },
    {
      id: "location",
      label: "Location",
      minWidth: 100,
      align: "left",
    },
    {
      id: "startTime",
      label: "Start Time",
      minWidth: 100,
      align: "left",
    },
    {
      id: "endTime",
      label: "End Time",
      minWidth: 100,
      align: "left",
    },
    {
      id: "vehicle",
      label: "Vehicle",
      minWidth: 100,
      align: "left",
    },
    // {
    //     id : "pickupText",
    //     label: "Pickup",
    //     minWidth: 100,
    //     align: "left",
    // },
    // {
    //     id : "timeIn",
    //     label: "Time In",
    //     minWidth: 100,
    //     align: "left",
    // },
    // {
    //     id : "timeOut",
    //     label: "Time Out",
    //     minWidth: 100,
    //     align: "left",
    // },
    // {
    //   id: "status",
    //   label: "Status",
    //   minWidth: 100,
    //   align: "left",
    // },
    // {
    //   id: "confirmation",
    //   label: "Confirmation",
    //   minWidth: 100,
    //   align: "left",
    // },
    // {
    //   id: "addedBy",
    //   label: "Added By",
    //   minWidth: 100,
    //   align: "left",
    // },
    {
      id: "action",
      label: "Actions",
      minWidth: 140,
      align: "left",
    },
  ];

  return (
    <React.Fragment>
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer
            sx={{
              maxHeight: "697px",
              border: "1px solid #EAECEE",
              borderRadius: "8px",
            }}
          >
            <Table stickyHeader>
              <StyledTableHead>
                <StyledTableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </StyledTableRow>
              </StyledTableHead>

              {loading || isSearching ? (
                <TableBody sx={{ maxHeight: "52px" }}>
                  <TableLoader columns={[...columns]} />
                </TableBody>
              ) : (
                <TableBody sx={{ maxHeight: "52px" }}>
                  {/* .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                  {appointmentData.length > 0 ? (
                    appointmentData.map((row, index) => (
                      <StyledTableRow
                        key={index}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <TableCell align="left">
                          {" "}
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                        <TableCell>
                          {formatDateToString(row.classDate)}
                        </TableCell>
                        <TableCell>{row.studentName}</TableCell>
                        <TableCell>{row.lesson}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>{row.startTime}</TableCell>
                        <TableCell>{row.endTime}</TableCell>
                        <TableCell>
                          {row?.vehicle?.brand
                            ? `${row?.vehicle?.brand} ${row?.vehicle?.model} ${row?.vehicle?.color} ${row?.vehicle?.year} `
                            : "-"}
                        </TableCell>
                        {/* <TableCell align="left">
                          <SwitchLovely
                            checked={row.status}
                            size="small"
                            onClick={() =>
                              changeDriverTrainingStatus(row.id, row.status)
                            }
                          />
                        </TableCell> */}

                        <TableCell align="left">
                          {/* <IconButton
                            sx={{
                              height: "40px",
                              width: "40px",
                              padding: "0px",
                              backgroundColor: "#F37736",
                              "&:hover": {
                                backgroundColor: "#F37736",
                              },
                              mr: 1,
                              
                            }}
                            
                          >
                            <Image
                              src="/icons/edit.svg"
                              alt="eye"
                              height={16}
                              width={16}
                            />
                          </IconButton> */}
                          <IconButton
                            sx={{
                              height: "40px",
                              width: "40px",
                              padding: "0px",
                              backgroundColor: "#EB2D2F",
                              "&:hover": {
                                backgroundColor: "red",
                              },
                            }}
                            onClick={() => {
                              handleAppointmentDelete(row.id);
                            }}
                          >
                            <Image
                              src="/icons/delete.svg"
                              alt="eye"
                              height={16}
                              width={16}
                            />
                          </IconButton>
                        </TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <TableCell
                        component="th"
                        scope="row"
                        colSpan={columns.length}
                        align="center"
                      >
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

export default AppointmentManagementTable;

type appointment = {
  id: number;
  classDate: string;
  studentName: string;
  lesson: string;
  address: string;
  location: string;
  startTime: string;
  endTime: string;
  vehicle: any;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  appointmentData?: appointment[] | [];
  changeDriverTrainingStatus?: (id: number, status: boolean) => void;
  handleAppointmentDelete?: (id: number) => void;
}
