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
import { useDispatch } from "react-redux";
import { updateUserRole } from "@/store/user/user.actions";
import { useRouter } from "next/router";
import { SwitchLovely } from "@/mui-treasury/switch-lovely";
import Image from "next/image";

const LessonTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  lessonData = [],
  changeLessonStatus,
  deleteLesson,
  editLesson,
}: Props) => {
  const router = useRouter();
  interface ColumnType {
    id:
      | "id"
      | "lessonName"
      | "description"
      | "price"
      | "duration"
      | "status"
      | "action"
      | "number"
      | "lessonNo";
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
      id: "lessonNo",
      label: "Lesson No.",
      minWidth: 30,
      align: "left",
    },
    {
      id: "lessonName",
      label: "Lesson Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "description",
      label: "Description",
      minWidth: 170,
      align: "left",
    },
    // {
    //   id: "price",
    //   label: "Price",
    //   minWidth: 170,
    //   align: "left",
    // },
    {
      id: "duration",
      label: "Duration",
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
                  {lessonData.map((row, index) => (
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
                      <TableCell align="left">{row.lessonNo}</TableCell>
                      <TableCell align="left">{row.lessonName}</TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell align="left">{row.duration}</TableCell>
                      {/* <TableCell align="left">${row.price}</TableCell> */}
                      <TableCell align="left">
                        <SwitchLovely
                          checked={row.status}
                          size="small"
                          onClick={() =>
                            changeLessonStatus(row.id, row.status)
                          }
                        />
                      </TableCell>
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
                          onClick={() => editLesson(row.id)}
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
                          onClick={() => deleteLesson(row.id)}
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

export default LessonTable;

type lesson = {
  id: number;
  lessonName: string;
  lessonNo: string;
  description: string;
  duration : string;
  // price: string;
  status: boolean;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  lessonData?: lesson[] | [];
  changeLessonStatus: (id: number, status: boolean) => void;
  deleteLesson: (id: number) => void;
  editLesson: (id: number) => void;
}
