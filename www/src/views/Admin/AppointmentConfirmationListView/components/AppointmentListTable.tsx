import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import { Table, TableBody, TableCell, TableContainer } from "@mui/material";
import React from "react";

const AppointmentListTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  appointmentData = [],
}: Props) => {
  interface ColumnType {
    id:
      | "id"
      | "name"
      | "email"
      | "phone"
      | "parentNumber"
      | "pickup"
      | "pickupText"
      | "timeIn"
      | "timeOut"
      | "status"
      | "confirmed"
      | "number";
    label: string;
    minWidth?: number;
    align?: "center" | "right" | "left";
    format?: (value: number) => string;
  }
  const columns: readonly ColumnType[] = [
    {
      id: "number",
      label: "No.",
      minWidth: 30,
      align: "left",
    },
    {
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "email",
      label: "Email",
      minWidth: 170,
      align: "left",
    },
    {
      id: "phone",
      label: "Phone",
      minWidth: 170,
      align: "left",
    },
    {
      id: "parentNumber",
      label: "Parent's Phone",
      minWidth: 170,
      align: "left",
    },
    {
      id: "pickup",
      label: "Pickup",
      minWidth: 170,
      align: "left",
    },
    {
      id: "pickupText",
      label: "Pickup Text",
      minWidth: 170,
      align: "left",
    },
    {
      id: "timeIn",
      label: "Time In",
      minWidth: 100,
      align: "left",
    },
    {
      id: "timeOut",
      label: "Time Out",
      minWidth: 100,
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 100,
      align: "left",
    },
    {
      id: "confirmed",
      label: "Confirmed",
      minWidth: 170,
      align: "left",
    },
  ];

  return (
    <React.Fragment>
      <TableContainer
        sx={{
          maxHeight: "697px",
          border: "1px solid #EAECEE",
          borderRadius: "8px",
        }}
      >
        <Table stickyHeader>
          <StyledTableHead>
            <StyledTableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </StyledTableRow>
          </StyledTableHead>

          {loading || isSearching ? (
            <TableBody sx={{ maxHeight: "52px" }}>
              <TableLoader columns={[...columns]} />
            </TableBody>
          ) : (
            <TableBody sx={{ maxHeight: "52px" }}>
              {/* .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
              {appointmentData.map((row, index) => (
                <StyledTableRow key={index} hover role="checkbox" tabIndex={-1}>
                  {columns.map((column) => {
                    if (column.id === "number") {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          id={column.id}
                        >
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                      );
                    } else {
                      const value = row[column.id];

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          id={column.id}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value ?? "-"}
                        </TableCell>
                      );
                    }
                  })}
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default AppointmentListTable;

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  appointmentData?: any[];
}
