import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { updateUserRole } from "@/store/user/user.actions";
import { useRouter } from "next/router";
import { SwitchLovely } from "@/mui-treasury/switch-lovely";
import Image from "next/image";

const CouponsTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  couponsData = [],
  changeCouponsStatus,
  deleteCoupons,
  editCoupons,
}: Props) => {
  const router = useRouter();
  interface ColumnType {
    id:
      | "id"
      | "number"
      | "couponCode"
      | "note"
      | "amount"
      | "maxUses"
      | "minPurchase"
      | "uses"
      | "expiration"
      | "status"
      | "action";

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
      id: "couponCode",
      label: "Coupon Code",
      minWidth: 120,
      align: "left",
    },
    {
      id: "amount",
      label: "Amount",
      minWidth: 120,
      align: "left",
    },
    {
      id: "minPurchase",
      label: "Minimum Purchase",
      minWidth: 120,
      align: "left",
    },
    {
      id: "maxUses",
      label: "Max Uses",
      minWidth: 120,
      align: "left",
    },
    {
      id: "uses",
      label: "Uses",
      minWidth: 120,
      align: "left",
    },
    {
      id: "expiration",
      label: "Expiration",
      minWidth: 120,
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 120,
      align: "left",
    },
    {
      id: "note",
      label: "Note",
      minWidth: 120,
      align: "left",
    },
    {
      id: "action",
      label: "Actions",
      minWidth: 140,
      align: "left",
    },
  ];

  return (
    <React.Fragment>
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
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
                  {couponsData.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <TableCell align="left">
                        {" "}
                        {index + 1 + page * rowsPerPage}
                      </TableCell>
                      <TableCell align="left">{row.couponCode}</TableCell>
                      <TableCell align="left">${row.amount}</TableCell>
                      <TableCell align="left">${row.minPurchase}</TableCell>
                      <TableCell align="left">{row.maxUses}</TableCell>
                      <TableCell align="left">{row.uses}</TableCell>
                      <TableCell align="left">{row.expiration}</TableCell>
                      <TableCell align="left">
                        <SwitchLovely
                          checked={row.status}
                          size="small"
                          onClick={() =>
                            changeCouponsStatus(row.id, row.status)
                          }
                        />
                      </TableCell>
                      <TableCell align="left">{row.note}</TableCell>

                      <TableCell align="left">
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
                          onClick={() => editCoupons(row.id)}
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
                          onClick={() => deleteCoupons(row.id)}
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
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default CouponsTable;

type coupons = {
  id: number;
  couponCode: string;
  note: string;
  amount: string;
  minPurchase: string;
  maxUses: string;
  uses : string;
  status: boolean;
  expiration: string;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  couponsData?: coupons[] | [];
  changeCouponsStatus: (id: number, status: boolean) => void;
  deleteCoupons: (id: number) => void;
  editCoupons: (id: number) => void;
}
