import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import { useAppDispatch } from "@/hooks";
import { CourseActionTypes } from "@/store/course/course.type";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

type Course = {
  id: number;
  courseName: string;
  description: string;
  duration: string;
  modules: string;
  lessons: string;
  activeStudents: string;
  // price: string;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  courseData?: Course[] | [];
  changeCourseStatus: (id: number, status: boolean) => void;
  deleteCourse: (id: number) => void;
  editCourse: (id: number) => void;
}

const CourseTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  courseData = [],
  changeCourseStatus,
  deleteCourse,
  editCourse,
}: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  interface ColumnType {
    id:
      | "id"
      | "courseName"
      | "modules"
      | "lessons"
      | "activeStudents"
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
      id: "courseName",
      label: "Course Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "modules",
      label: "Modules",
      minWidth: 170,
      align: "left",
    },
    {
      id: "lessons",
      label: "Lessons",
      minWidth: 170,
      align: "left",
    },
    {
      id: "activeStudents",
      label: "Active Students",
      minWidth: 170,
      align: "left",
    },
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

              {loading && isSearching ? (
                <TableBody sx={{ maxHeight: "52px" }}>
                  <TableLoader columns={[...columns]} />
                </TableBody>
              ) : (
                <TableBody sx={{ maxHeight: "52px" }}>
                  {courseData.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <TableCell align="left">
                        {index + 1 + page * rowsPerPage}
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          sx={{
                            cursor: "pointer",
                            maxWidth: "fit-content",
                            "&:hover": {
                              color: "#673ab7",
                              textDecoration: "underline",
                            },
                          }}
                          onClick={() => {
                            dispatch({
                              type: CourseActionTypes.CLEAR_SECTION_MENU,
                            });
                            router.push(`/manage/course/${row.id}/edit`);
                          }}
                        >
                          {row.courseName}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{row.modules}</TableCell>
                      <TableCell align="left">{row.lessons}</TableCell>
                      <TableCell align="left">{row.activeStudents}</TableCell>
                      {/* <TableCell align="left">${row.price}</TableCell> */}
                      {/* <TableCell align="left">
                        <SwitchLovely
                          checked={row.status}
                          size="small"
                          onClick={() => changeCourseStatus(row.id, row.status)}
                        />
                      </TableCell> */}
                      <TableCell align="left">
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
                          onClick={() => editCourse(row.id)}
                        >
                          <Image
                            src="/icons/edit.svg"
                            alt="eye"
                            height={16}
                            width={16}
                          />
                        </IconButton>
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
                          onClick={() => deleteCourse(row.id)}
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
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default CourseTable;
