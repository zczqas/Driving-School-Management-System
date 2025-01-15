import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
} from "@mui/material";
import React from "react";
// import { useDispatch } from "react-redux";
// import { updateUserRole } from "@/store/user/user.actions";
import { useRouter } from "next/router";
// import { SwitchLovely } from "@/mui-treasury/switch-lovely";
import Link from "next/link";
// import driverTrainingEducation from "@/pages/manage/driver-training-and-education";

const ActivitiesTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  driverTrainingData = [],
}: Props) => {
  const router = useRouter();
  interface ColumnType {
    id:
      | "id"
      | "adminName"
      | "studentName"
      | "instructorName"
      | "school"
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
      | "createdAt"
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
      id: "adminName",
      label: "Added By",
      minWidth: 170,
      align: "left",
    },
    {
      id: "school",
      label: "School",
      minWidth: 170,
      align: "left",
    },
    {
      id: "studentName",
      label: "Student Name",
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
      id: "status",
      label: "Description",
      minWidth: 170,
      align: "left",
    },

    {
      id: "createdAt",
      label: "Created Date",
      minWidth: 170,
      align: "left",
    },
    {
      id: "classDate",
      label: "Appointment Date",
      minWidth: 170,
      align: "left",
    },
  ];
  console.log(router.pathname.split("/")[2], "router.pathname");
  return (
    <React.Fragment>
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer
            sx={{
              minHeight: "697px",
              border: "1px solid #EAECEE",
              borderRadius: "8px",
            }}
          >
            <Table stickyHeader>
              <StyledTableHead>
                <StyledTableRow>
                  {columns.map((column) =>
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
                        <TableCell>{row.addedBy}</TableCell>
                        <TableCell>
                          {row?.transaction?.driving_school?.name
                            ? `${row?.transaction?.driving_school?.name}`
                            : "-"}
                        </TableCell>

                        {router.pathname.split("/")[2] === "profile" ? null : (
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
                        )}

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

                        <TableCell>{row.status}</TableCell>
                        <TableCell>{row.createdAt}</TableCell>
                        <TableCell>{row.classDate}</TableCell>
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

export default ActivitiesTable;

type lesson = {
  id: number;
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
  transaction : any;
  timeIn: string;
  timeOut: string;
  confirmation: string;
  addedBy: string;
  createdAt: string;
  status: string;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  driverTrainingData?: lesson[] | [];
  changeDriverTrainingStatus?: (id: number, status: boolean) => void;
}
