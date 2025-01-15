import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import Image from "next/image";
import React, { Fragment } from "react";

interface Props {
  schoolData: any[];
  editSchool: (id: string) => void;
  deleteSchool: (id: string) => void;
}

const SchoolTable = ({ schoolData, editSchool, deleteSchool }: Props) => {
  return (
    <Fragment>
      <Paper elevation={0}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <StyledTableHead>
              <TableRow>
                <TableCell>NO.</TableCell>
                <TableCell align="center">NAME</TableCell>
                <TableCell align="center">DESCRIPTION</TableCell>
                <TableCell align="center">ADDRESS</TableCell>
                <TableCell align="center">LATITUDE</TableCell>
                <TableCell align="center">LONGITUDE</TableCell>
                <TableCell align="center">ZIPCODE</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {schoolData?.length > 0 ? (
                schoolData?.map((row: any, index: number) => (
                  <Fragment key={index}>
                    <StyledTableRow>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{row.name ?? "-"}</TableCell>
                      <TableCell align="center">
                        {row.description ?? "-"}
                      </TableCell>
                      <TableCell align="center">{row.address ?? "-"}</TableCell>
                      <TableCell align="center">{row.latitude ?? "-"}</TableCell>
                      <TableCell align="center">{row.longitude ?? "-"}</TableCell>
                      <TableCell align="center">{row.zipcode ?? "-"}</TableCell>
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
                            editSchool(row.id);
                          }}
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
                          onClick={() => {
                            deleteSchool(row.id);
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
                  </Fragment>
                ))
              ) : (
                <StyledTableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    colSpan={9}
                    align="center"
                  >
                    No School found
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Fragment>
  );
};

export default SchoolTable;