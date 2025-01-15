import React, { Fragment } from "react";

// third party libraries
import {
  Backdrop,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  useTheme,
} from "@mui/material";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import formatDateToString from "@/utils/formatDateToString";

interface Props {
  certificates: any[];
  loading: boolean;
  drivingSchoolName: string | null;
}

const CertificateTable = ({
  certificates,
  loading,
  drivingSchoolName,
}: Props) => {
  const theme = useTheme();

  function parseDate(date: Date) {
    return new Date(date).toLocaleDateString();
  }

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <StyledTableHead>
            <StyledTableRow>
              <TableCell>NO.</TableCell>
              <TableCell align="center">Driving School</TableCell>
              <TableCell align="center">CERTIFICATE NO.</TableCell>
              <TableCell align="center">INSTRUCTOR.</TableCell>
              {/* <TableCell align="center">STATUS</TableCell> */}
              <TableCell align="center">ISSUED AT</TableCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody sx={{ background: "white" }}>
            {certificates && certificates.length > 0 ? (
              certificates.map((row: any, index: number) => (
                <Fragment key={index}>
                  <StyledTableRow>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>

                    <TableCell align="center">{drivingSchoolName}</TableCell>

                    <TableCell align="center">{row?.certificate_id}</TableCell>
                    <TableCell align="center">
                      {row?.instructor?.user?.first_name}{" "}
                      {row?.instructor?.user?.middle_name}{" "}
                      {row?.instructor?.user?.last_name}
                    </TableCell>

                    {/* <TableCell align="center">
                      {row?.certificate?.status}
                    </TableCell> */}

                    <TableCell align="center">
                      {row?.issued_date
                        ? formatDateToString(row?.issued_date)
                        : "-"}
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
                  No Certificates found
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default CertificateTable;
