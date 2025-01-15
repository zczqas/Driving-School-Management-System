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
import Link from "next/link";
import formatDateToString from "@/utils/formatDateToString";
import moment from "moment";

const ScheduleTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  driverTrainingData = [],
  currentDate,
}: Props) => {
  const router = useRouter();
  interface ColumnType {
    id:
      | "id"
      | "schoolName"
      | "studentName"
      | "instructorName"
      | "classDate"
      | "package"
      | "lesson"
      | "pickup"
      | "pickupText"
      | "timeIn"
      | "timeOut"
      | "status"
      | "confirmation"
      | "addedBy"
      | "action"
      | "number"
      | "address"
      | "city"
      | "vehicle"
      | "confirmed";
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
      id: "schoolName",
      label: "School Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "instructorName",
      label: "Instructor Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "studentName",
      label: "Student Name",
      minWidth: 170,
      align: "left",
    },

    // {
    //   id: "package",
    //   label: "Package",
    //   minWidth: 170,
    // },
    {
      id: "address",
      label: "Address",
      minWidth: 170,
      align: "left",
    },
    {
      id: "city",
      label: "Location",
      minWidth: 170,
      align: "left",
    },
    {
      id: "lesson",
      label: "Lesson",
      minWidth: 170,
    },

    {
      id: "timeIn",
      label: "Start Time",
      minWidth: 170,
      align: "left",
    },
    {
      id: "timeOut",
      label: "End Time",
      minWidth: 170,
      align: "left",
    },

    {
      id: "vehicle",
      label: "Vehicle",
      minWidth: 170,
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 170,
      align: "left",
    },

    {
      id: "confirmed",
      label: "Confirmed",
      minWidth: 170,
      align: "left",
    },
  ];
  console.log(router.pathname.split("/")[2], "router.pathname");
  return (
    <React.Fragment>
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px 0px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Lessons for{" "}
              {formatDateToString(currentDate || moment().format("YYYY-MM-DD"))}
            </Typography>
          </Box>
          <TableContainer
            sx={{
              minHeight: "60vh",
              border: "1px solid #EAECEE",
              borderRadius: "8px",
            }}
          >
            <Table stickyHeader>
              <StyledTableHead>
                <StyledTableRow>
                  {columns.map((column, index) =>
                    router.pathname.split("/")[2] === "profile" &&
                    column.id === "studentName" ? null : (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    )
                  )}
                </StyledTableRow>
              </StyledTableHead>

              {loading || isSearching ? (
                <TableBody sx={{ maxHeight: "52px" }}>
                  <TableLoader columns={[...columns]} />
                </TableBody>
              ) : (
                <TableBody sx={{ maxHeight: "52px" }}>
                  {/* .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                  {driverTrainingData.length > 0 ? (
                    driverTrainingData.map((row, index) => (
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
                        <TableCell>{row.schoolName}</TableCell>

                        <TableCell>
                          <Link
                            href={`/manage/instructor-appointment-management/${
                              row?.instructor_id
                            }?name=${
                              row?.instructor?.first_name
                                ? `${row?.instructor?.first_name} ${
                                    row?.instructor?.middle_name
                                      ? row?.instructor?.middle_name
                                      : ""
                                  } ${row?.instructor?.last_name}`
                                : "-"
                            }`}
                            target="_blank"
                          >
                            {row?.instructor?.first_name
                              ? `${row?.instructor?.first_name} ${
                                  row?.instructor?.middle_name
                                    ? row?.instructor?.middle_name
                                    : ""
                                } ${row?.instructor?.last_name}`
                              : "-"}
                          </Link>
                        </TableCell>

                        <TableCell>
                          <Link
                            href={`/manage/profile/${row?.student_id}`}
                            target="_blank"
                          >
                            {row?.student?.first_name
                              ? `${row?.student?.first_name} ${
                                  row?.student?.middle_name
                                    ? row?.student?.middle_name
                                    : ""
                                } ${row?.student?.last_name}`
                              : "-"}
                          </Link>
                        </TableCell>

                        {/* <TableCell>{row.package}</TableCell> */}
                        <TableCell>{row.pickupText}</TableCell>
                        <TableCell>{row.pickup}</TableCell>
                        <TableCell>{row.lesson}</TableCell>
                        {/* <TableCell>{row.classDate}</TableCell> */}
                        <TableCell>{row.timeIn}</TableCell>
                        <TableCell>{row.timeOut}</TableCell>
                        <TableCell>{row.vehicle}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>{`Method: manually - ${row.note} - ${formatDateToString(row.created_at)}`}</TableCell>
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

export default ScheduleTable;

type lesson = {
  id: number;
  schoolName: string | null;
  studentName: string | null;
  instructorName: string | null;
  student: any;
  instructor: any;
  student_id: number;
  instructor_id: number;
  classDate: string;
  package: string;
  lesson: string;
  pickup: string;
  pickupText: string;
  timeIn: string;
  timeOut: string;
  confirmation: string;
  addedBy: string;
  vehicle: string;
  status: string;
  created_at: string;
  note: string;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  driverTrainingData?: lesson[] | [];
  currentDate?: string;
}
