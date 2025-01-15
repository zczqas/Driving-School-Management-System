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
// import { useDispatch } from "react-redux";
// import { updateUserRole } from "@/store/user/user.actions";
import { useRouter } from "next/router";
// import { SwitchLovely } from "@/mui-treasury/switch-lovely";
import Image from "next/image";
// import driverTrainingEducation from "@/pages/manage/driver-training-and-education";

const DocumentsTable = ({
  loading = false,
  //   isSearching = false,
  page = 0,
  rowsPerPage = 100,
  documentsTableData = [],
}: //   changeDriverTrainingStatus = () => {},
Props) => {
  const router = useRouter();
  interface ColumnType {
    id: "number" | "documentName" | "documentDescription" | "action";
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
      id: "documentName",
      label: "Name",
      minWidth: 30,
      align: "left",
    },
    {
      id: "documentDescription",
      label: "Description",
      minWidth: 30,
      align: "left",
    },
    {
      id: "action",
      label: "Action",
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
              borderRadius: "10px",
              boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
              background: "#fff",
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

              {loading ? (
                <TableBody sx={{ maxHeight: "52px" }}>
                  <TableLoader columns={[...columns]} />
                </TableBody>
              ) : (
                <TableBody sx={{ maxHeight: "52px" }}>
                  {/* .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                  {documentsTableData.length > 0 ? (
                    documentsTableData.map((row: any, index: number) => (
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
                        <TableCell>{row?.name}</TableCell>
                        <TableCell>{row?.description}</TableCell>

                        <TableCell align="left">
                          <IconButton
                            onClick={() => {
                              window.open(
                                `https://sfds.usualsmart.com/${row.document_url}`,
                                "_blank"
                              );
                            }}
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
                          >
                            <Image
                              src="/icons/viewIcon.svg"
                              alt="eye"
                              height={16}
                              width={16}
                            />
                          </IconButton>
                        </TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <TableCell
                        component="th"
                        scope="row"
                        colSpan={columns.length}
                        align="center"
                      >
                        No documents found
                      </TableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default DocumentsTable;

type document = {
  id: number;

  // status: boolean;
};

interface Props {
  loading?: boolean;
  page?: number;
  rowsPerPage?: number;
  documentsTableData?: document[] | [];
}
