import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import formatDateToString from "@/utils/formatDateToString";
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
  cityData: any[];
  editCity: (id: string) => void;
  deleteCity: (id: string) => void;
}

const CityTable = ({ cityData, editCity, deleteCity }: Props) => {
  function parseDate(date: Date) {
    return new Date(date).toLocaleDateString();
  }

  return (
    <Fragment>
      <Paper elevation={0}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <StyledTableHead>
              <TableRow>
                <TableCell>NO.</TableCell>
                <TableCell align="center">NAME</TableCell>
                <TableCell align="center">STATE</TableCell>
                <TableCell align="center">COUNTRY</TableCell>
                <TableCell align="center">CITY ABBREVIATION</TableCell>
                <TableCell align="center">CREATED AT</TableCell>
                <TableCell align="center">ACTION</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {cityData?.length > 0 ? (
                cityData?.map((row: any, index: number) => (
                  <Fragment key={index}>
                    <StyledTableRow>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{row.name ?? "-"}</TableCell>

                      <TableCell align="center">{row.state ?? "-"}</TableCell>
                      <TableCell align="center">{row.country ?? "-"}</TableCell>
                      <TableCell align="center">
                        {row.city_abbreviation ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {formatDateToString(row.created_at) ?? "-"}
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
                            editCity(row.id);
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
                            deleteCity(row.id);
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
                    No City found
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

export default CityTable;