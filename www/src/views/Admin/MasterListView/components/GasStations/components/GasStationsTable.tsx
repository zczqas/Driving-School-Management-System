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
import Link from "next/link";
import React, { Fragment } from "react";

interface Props {
  gasStationData: any[];
  editGasStation: (id: string) => void;
  deleteGasStation: (id: string) => void;
}

const GasStationsTable = ({
  gasStationData,
  editGasStation,
  deleteGasStation,
}: Props) => {
  return (
    <Fragment>
      <Paper elevation={0}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <StyledTableHead>
              <TableRow>
                <TableCell>NO.</TableCell>
                <TableCell align="center">NAME</TableCell>
                <TableCell align="center">ADDRESS</TableCell>
                <TableCell align="center">CITY</TableCell>
                <TableCell align="center">STATE</TableCell>
                <TableCell align="center">ZIPCODE</TableCell>
                <TableCell align="center">PHONE</TableCell>
                <TableCell align="center">EMAIL</TableCell>
                <TableCell align="center">WEBSITE</TableCell>
                <TableCell align="center">NOTES</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {gasStationData?.length > 0 ? (
                gasStationData?.map((row: any, index: number) => (
                  <Fragment key={index}>
                    <StyledTableRow>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{row?.name ?? "-"}</TableCell>
                      <TableCell align="center">{row?.address ?? "-"}</TableCell>

                      <TableCell align="center">
                        {row?.city?.name ?? "-"}
                      </TableCell>
                      <TableCell align="center">{row.state ?? "-"}</TableCell>
                      <TableCell align="center">{row.zip_code ?? "-"}</TableCell>
                      <TableCell align="center">{row.phone ?? "-"}</TableCell>
                      <TableCell align="center">{row.email ?? "-"}</TableCell>
                      <TableCell align="center">
                        {row.website ? (
                          <Link href={row.website}>{row.website}</Link>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="center">{row.notes ?? "-"}</TableCell>
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
                            editGasStation(row.id);
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
                            deleteGasStation(row.id);
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
                    colSpan={11}
                    align="center"
                  >
                    No Gas Station found
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

export default GasStationsTable;