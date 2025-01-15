import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React, { Fragment } from "react";
import Image from "next/image";
import { StyledTableHead } from "@/components/CustomTable";

interface Props {
  coursesData: any;
  editCourse: (id: string) => void;
  deleteCourse: (id: string) => void;
}

const CoursesTable = ({
  coursesData: { courses },
  editCourse,
  deleteCourse,
}: Props) => {
  return (
    <Fragment>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <StyledTableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell align="center">Course Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {courses?.length > 0 ? (
              courses.map((row: any, index: number) => (
                <Fragment key={index}>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="center">{row.title ?? "-"}</TableCell>
                    <TableCell align="center">
                      {row.description ?? "-"}
                    </TableCell>
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
                          editCourse(row.id);
                        }}
                      >
                        <Image
                          src="/icons/edit.svg"
                          alt="edit"
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
                        onClick={() => {
                          deleteCourse(row.id);
                        }}
                      >
                        <Image
                          src="/icons/delete.svg"
                          alt="delete"
                          height={16}
                          width={16}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  colSpan={4}
                  align="center"
                >
                  No Courses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default CoursesTable;
