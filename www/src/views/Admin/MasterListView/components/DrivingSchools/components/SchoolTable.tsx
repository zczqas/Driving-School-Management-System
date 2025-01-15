import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React, { Fragment } from "react";

interface Props {
  schoolData: any[];
}

const SchoolTable = ({ schoolData }: Props) => {
  console.log({ schoolData });
  return (
    <Fragment>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <StyledTableHead>
            <TableRow>
              <TableCell>NO.</TableCell>
              <TableCell align="center">NAME</TableCell>
              <TableCell align="center">ADDRESS</TableCell>
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
                    <TableCell align="center">{row.address ?? "-"}</TableCell>
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
    </Fragment>
  );
};

export default SchoolTable;
