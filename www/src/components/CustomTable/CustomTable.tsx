import {
  TableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  styled,
  Skeleton,
} from "@mui/material";
import React from "react";

export const StyledTableHead = styled(MuiTableHead)(({ theme }) => ({
  "& .MuiTableRow-root > .MuiTableCell-root": {
    background: "#F4F4F4",
    color: "#4F5B67",
    borderBottom: "none",
    fontWeight: 600,
    textTransform: "uppercase",
    fontSize: "14px",
    padding: "16px 18px",

  },
  "& .MuiTableCell-root:first-child": {
    borderTopLeftRadius: 8,
  },
}));

export const StyledTableRow = styled(MuiTableRow)(({ theme }) => ({
  "& .MuiTableCell-root": {
    borderBottom: "1px solid #EAECEE",
    fontWeight: 500,
    fontSize: "14px",
    padding: "6px 18px",

  },
  "& #userName": {
    textTransform: "uppercase",
  },
}));

interface TableLoaderProps {
  columns: any[];
  rowsPerPage?: number;
}

export const TableLoader = ({ columns, rowsPerPage = 10 }: TableLoaderProps) => {
  return (
    <>
      {[...Array(rowsPerPage)].map((_, index) => (
        <StyledTableRow key={index}>
          {columns.map((column, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton animation="wave" />
            </TableCell>
          ))}
        </StyledTableRow>
      ))}
    </>
  );
};