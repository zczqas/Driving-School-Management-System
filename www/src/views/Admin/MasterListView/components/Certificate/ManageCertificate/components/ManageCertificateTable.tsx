import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import formatDateToString from "@/utils/formatDateToString";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import Image from "next/image";
import React, { Fragment } from "react";

interface Props {
  batchCertificateData: any[];
  handleOpenDialog: (editRow: any) => void;
}

const ManageCertificateTable = ({
  batchCertificateData,
  handleOpenDialog,
}: Props) => {
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
                <TableCell align="center">Batch No</TableCell>
                <TableCell align="center">Certificate No</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="center">Created At</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {batchCertificateData?.length > 0 ? (
                batchCertificateData?.map((row: any, index: number) => (
                  <Fragment key={index}>
                    <StyledTableRow>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{row.batch_id ?? "-"}</TableCell>
                      <TableCell align="center">
                        {row.certificate_number ?? "-"}
                      </TableCell>
                      <TableCell align="center">{row.status ?? "-"}</TableCell>

                      <TableCell align="center">
                        {formatDateToString(row.created_at) ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Box>
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
                              handleOpenDialog(row);
                            }}
                          >
                            <Image
                              src="/icons/edit.svg"
                              alt="eye"
                              height={16}
                              width={16}
                            />
                          </IconButton>
                        </Box>
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
                    No Certificate Batch found
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

export default ManageCertificateTable;