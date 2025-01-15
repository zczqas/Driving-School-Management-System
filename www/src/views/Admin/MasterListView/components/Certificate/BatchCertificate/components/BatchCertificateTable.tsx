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
  batchCertificateData: any[];
}

const BatchCertificateTable = ({ batchCertificateData }: Props) => {
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
                <TableCell align="center">Certificate Type</TableCell>
                <TableCell align="center">Created At</TableCell>
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
                      <TableCell align="center">
                        {row.batch_id ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {row.certificate_type ?? "-"}
                      </TableCell>

                      <TableCell align="center">
                        {formatDateToString(row.created_at) ?? "-"}
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

export default BatchCertificateTable;
