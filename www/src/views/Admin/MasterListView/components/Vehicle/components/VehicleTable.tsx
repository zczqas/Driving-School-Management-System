import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import { SwitchLovely } from "@/mui-treasury/switch-lovely";
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
  vehicleData: any[];
  editVehicle: (id: string) => void;
  deleteVehicle: (id: string) => void;
  changeVehicleStatus: (id: number, status: boolean) => void;
}

const VehicleTable = ({
  vehicleData,
  editVehicle,
  deleteVehicle,
  changeVehicleStatus,
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
                <TableCell align="center">BRAND</TableCell>
                <TableCell align="center">MODEL</TableCell>
                <TableCell align="center">YEAR</TableCell>
                <TableCell align="center">COLOR</TableCell>
                <TableCell align="center">PLATE_NUMBER</TableCell>
                <TableCell align="center">ODOMETER</TableCell>
                <TableCell align="center">CREATED AT</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="center">ACTION</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {vehicleData?.length > 0 ? (
                vehicleData?.map((row: any, index: number) => (
                  <Fragment key={index}>
                    <StyledTableRow>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{row.brand ?? "-"}</TableCell>
                      <TableCell align="center">{row.model ?? "-"}</TableCell>
                      <TableCell align="center">{row.year ?? "-"}</TableCell>
                      <TableCell align="center">{row.color ?? "-"}</TableCell>
                      <TableCell align="center">
                        {row.plate_number ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {row.odometer ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        {formatDateToString(row.created_at) ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        <SwitchLovely
                          checked={row.is_available}
                          size="small"
                          onClick={() =>
                            changeVehicleStatus(row.id, row.is_available)
                          }
                        />
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
                            editVehicle(row.id);
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
                            deleteVehicle(row.id);
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
                    No Vehicle found
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

export default VehicleTable;
