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

interface Unit {
  course_unit: any[]; // Update the type of course_unit
}

interface Props {
  unitsData: Unit; // Update the type of unitsData
  editUnit: (id: string) => void;
  deleteUnit: (id: string) => void;
}

const UnitsTable = ({
  unitsData: { course_unit },
  editUnit,
  deleteUnit,
}: Props) => {
  return (
    <Fragment>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <StyledTableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell align="center">Course Name</TableCell>
              <TableCell align="center">Unit Title</TableCell>
              <TableCell align="center">Purpose</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {course_unit?.length > 0 ? (
              course_unit?.map((row: any, index: number) => (
                <Fragment key={row.id}>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="center">{row.course?.title ?? "-"}</TableCell>
                    <TableCell align="center">{row.title ?? "-"}</TableCell>
                    <TableCell align="center">{row.purpose ?? "-"}</TableCell>
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
                          editUnit(row.id);
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
                          deleteUnit(row.id);
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
                  colSpan={5}
                  align="center"
                >
                  No Units found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default UnitsTable;
