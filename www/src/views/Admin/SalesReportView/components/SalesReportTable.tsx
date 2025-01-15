import React, { Fragment, useCallback } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";

// style + assets
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

// third party libraries
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  useTheme,
  Link as MuiLink,
  Typography,
  Fade,
  Tooltip,
  TablePagination,
  Pagination,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Image from "next/image";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchTransactionsStart } from "@/store/account/account.actions";
import IRootState from "@/store/interface";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import CustomDialog from "@/components/CustomDialog";
import CircularWithValueLabel from "@/components/CircularProgressWithLabel";
import formatDateToString from "@/utils/formatDateToString";
import CustomDateRangePicker from "@/components/CustomDateRangePicker";
import { fetchDrivingSchools } from "@/store/masterlist/masterlist.actions";

// ==============================|| SUB HEADER ||============================== //

interface SalesReportTableProps {
  transactions: any[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

const SalesReportTable: React.FC<SalesReportTableProps> = ({
  transactions,
  loading,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <StyledTableHead>
            <TableRow>
              <TableCell>NO.</TableCell>
              <TableCell align="center">STUDENT NAME</TableCell>
              <TableCell align="center">PAYMENT TYPE</TableCell>
              <TableCell align="center">LOCATION</TableCell>
              <TableCell align="center">CHECK NUMBER</TableCell>
              <TableCell align="center">RECEIPT NUMBER</TableCell>
              <TableCell align="center">AUTHORIZATION NUMBER</TableCell>
              <TableCell align="center">TRANSACTION ID</TableCell>
              <TableCell align="center">AMOUNT</TableCell>
              <TableCell align="center">PACKAGE</TableCell>
              <TableCell align="center">CSR</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody
            sx={{
              backgroundColor: "primary.light",
            }}
          >
            {transactions && transactions.length > 0 ? (
              transactions.map((row: any, index: number) => (
                <Fragment key={index}>
                  <StyledTableRow>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="center">
                      {row?.user
                        ? `${row?.user?.first_name} ${row?.user?.last_name}`
                        : "-"}
                    </TableCell>
                    <TableCell align="center">{row?.method || "-"}</TableCell>
                    <TableCell align="center">
                      {row?.location || "-"}
                    </TableCell>
                    <TableCell align="center">-</TableCell>
                    <TableCell align="center">-</TableCell>
                    <TableCell align="center">-</TableCell>
                    <TableCell align="center">{row?.transaction_id || "-"}</TableCell>
                    <TableCell align="center">
                      {row?.amount ? `$${row?.amount.toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell align="center">{row?.package?.name || "-"}</TableCell>
                    <TableCell align="center">
                      {row?.created_by?.first_name || "-"}
                    </TableCell>
                  </StyledTableRow>
                </Fragment>
              ))
            ) : (
              <StyledTableRow>
                <TableCell component="th" scope="row" colSpan={11} align="center">
                  No transactions found
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 2,
          gap: 2,
        }}
      >
        <TablePagination
          component="div"
          count={totalCount || 0}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[10, 25, 30, 50, 100]}
          sx={{
            borderBottom: "none",
            ".MuiTablePagination-toolbar": {
              paddingLeft: 0,
              paddingRight: 0,
            },
            ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
              margin: 0,
            },
            ".MuiTablePagination-actions": {
              display: "none",
            },
          }}
        />
        <Pagination
          count={Math.ceil((totalCount || 0) / rowsPerPage)}
          page={page + 1}
          onChange={(_, newPage) => onPageChange(newPage - 1)}
          shape="rounded"
          size="small"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#6B7280",
              borderRadius: "9999px",
              "&.Mui-selected": {
                backgroundColor: "#6366F1",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#4F46E5",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(99, 102, 241, 0.04)",
              },
            },
          }}
        />
      </Box>
    </>
  );
};

export default SalesReportTable;
