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
  TablePagination,
  Pagination,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import TruncatedCell from "@/components/TruncatedCell";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import moment from "moment";
import formatTimeToTwelveHours from "@/utils/formattime";

const DriverTrainingEducationTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 10,
  driverTrainingData = [],
  changeDriverTrainingStatus = () => {},
  setIsTrainingLogsDialogOpen,
  setCurrentAppointment,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
}: Props) => {
  const router = useRouter();
  const { currentUser } = useSelector((state: IRootState) => state.auth);

  interface ColumnType {
    id:
      | "number"
      | "studentName"
      | "instructorName"
      | "school"
      | "classDate"
      | "lesson"
      | "pickupText"
      | "timeIn"
      | "timeOut"
      | "status"
      | "addedBy"
      | "createdAt"
      | "trainingLog"
      | "action";
    label: string;
    minWidth?: number;
    maxWidth?: number;
    align?: "center" | "right" | "left";
  }

  const columns: readonly ColumnType[] = [
    {
      id: "number",
      label: "No.",
      minWidth: 30,
      align: "left",
    },
    {
      id: "studentName",
      label: "Student Name",
      minWidth: 100,
      align: "left",
    },
    {
      id: "instructorName",
      label: "Instructor Name",
      minWidth: 100,
      align: "left",
    },
    {
      id: "school",
      label: "Driving School",
      minWidth: 100,
    },
    {
      id: "lesson",
      label: "Lesson",
      minWidth: 100,
    },
    {
      id: "classDate",
      label: "Class Date",
      minWidth: 100,
      align: "left",
    },
    {
      id: "pickupText",
      label: "Pickup Text",
      minWidth: 100,
      align: "left",
      maxWidth: 120,
    },
    {
      id: "trainingLog",
      label: "Training Log",
      minWidth: 100,
      align: "left",
      maxWidth: 120,
    },
    {
      id: "timeIn",
      label: "Time In",
      minWidth: 100,
      align: "left",
    },
    {
      id: "timeOut",
      label: "Time Out",
      minWidth: 100,
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 100,
      align: "left",
    },
    {
      id: "addedBy",
      label: "Added By",
      minWidth: 100,
      align: "left",
    },
    {
      id: "createdAt",
      label: "Created At",
      minWidth: 100,
      align: "left",
    },
    ...(currentUser?.user?.role !== "STUDENT"
      ? [
          {
            id: "action",
            label: "Actions",
            minWidth: 100,
            align: "center",
          } as ColumnType,
        ]
      : []),
  ];

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <React.Fragment>
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer
            sx={{
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
                        style={{
                          minWidth: column.minWidth,
                          maxWidth: column?.maxWidth,
                        }}
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
                  {driverTrainingData.length > 0 ? (
                    driverTrainingData.map((row: any, index: any) => (
                      <StyledTableRow
                        sx={{
                          "& .MuiTableCell-root": {
                            padding: "6px 4px",
                            cursor: "pointer",
                          },
                        }}
                        key={index}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <TableCell align="center">
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                        {router.pathname.split("/")[2] === "profile" ? null : (
                          <TableCell>
                            <Link
                              href={`/manage/profile/${row?.student?.id}`}
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
                              row?.availability?.user?.id
                            }?name=${
                              row?.availability?.user?.first_name
                                ? `${row?.availability?.user?.first_name} ${
                                    row?.availability?.user?.middle_name
                                      ? row?.availability?.user?.middle_name
                                      : ""
                                  } ${row?.availability?.user?.last_name}`
                                : "-"
                            }`}
                            target="_blank"
                          >
                            {row?.availability?.user?.first_name
                              ? `${row?.availability?.user?.first_name} ${
                                  row?.availability?.user?.middle_name
                                    ? row?.availability?.user?.middle_name
                                    : ""
                                } ${row?.availability?.user?.last_name}`
                              : "-"}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {row?.package?.driving_school?.name
                            ? `${row?.package?.driving_school?.name}`
                            : "-"}
                        </TableCell>
                        <TableCell>{row?.lesson?.name}</TableCell>
                        <TableCell>
                          {moment(row?.scheduled_date).format("MM-DD-YYYY") ??
                            "-"}
                        </TableCell>
                        <TruncatedCell
                          text={row?.pickup_location_text}
                          maxLength={20}
                          sx={{ maxWidth: 250 }}
                        />
                        <TableCell align="center">
                          <Button
                            onClick={() => {
                              setIsTrainingLogsDialogOpen(true);
                              setCurrentAppointment(row);
                            }}
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            View Log
                          </Button>
                        </TableCell>
                        <TableCell>
                          {row?.time_in
                            ? formatTimeToTwelveHours(row?.time_in)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {row?.time_out
                            ? formatTimeToTwelveHours(row?.time_out)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {row?.status?.name ?? "CONFIRMED"}
                        </TableCell>
                        <TableCell>
                          {row?.created_by?.first_name ?? "Admin"}
                        </TableCell>
                        <TableCell>
                          {moment(row?.created_at).format("MM-DD-YYYY") ?? "-"}
                        </TableCell>

                        {currentUser?.user?.role !== "STUDENT" && (
                          <TableCell align="center">
                            <IconButton
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
                              onClick={() => {
                                router.push(
                                  `/manage/schedule-lessons?student_id=${row?.student?.id}&first_name=${row?.student?.first_name}&last_name=${row?.student?.last_name}&appointment_id=${row?.id}&isEdit=true`
                                );
                              }}
                            >
                              <Image
                                src="/icons/edit.svg"
                                alt="eye"
                                height={16}
                                width={16}
                              />
                            </IconButton>
                          </TableCell>
                        )}
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

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mt: 2,
          gap: 2,
        }}
      >
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(event, page) => onPageChange?.(event, page)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          sx={{ 
            borderBottom: "none",
            '.MuiTablePagination-toolbar': {
              paddingLeft: 0,
              paddingRight: 0,
            },
            '.MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel': {
              margin: 0,
            },
            '.MuiTablePagination-actions': {
              display: 'none',
            },
          }}
        />
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(event, newPage) => onPageChange?.(event, newPage - 1)}
          shape="rounded"
          size="small"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#6B7280',
              borderRadius: '9999px',
              '&.Mui-selected': {
                backgroundColor: '#6366F1',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#4F46E5',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.04)',
              },
            },
          }}
        />
      </Box>
    </React.Fragment>
  );
};

export default DriverTrainingEducationTable;

// type lesson = {
//   id: number;
//   studentName: string | null;
//   instructorName: string | null;
//   student: any;
//   transaction: any;
//   drivingSchool: any;
//   instructor: any;
//   student_id: number;
//   instructor_id: number;
//   classDate: string;
//   package: string;
//   lesson: string;
//   pickup: string;
//   pickupText: string;
//   timeIn: string;
//   timeOut: string;
//   confirmation: string;
//   addedBy: string;
//   createdAt: string;
//   status: string;
// };

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  driverTrainingData?: any;
  changeDriverTrainingStatus?: (id: number, status: boolean) => void;
  setIsTrainingLogsDialogOpen: (value: boolean) => void;
  setCurrentAppointment: (value: any) => void;
  totalCount?: number;
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<unknown> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
