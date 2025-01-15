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
import OnlineIcon from '@mui/icons-material/Cloud'; // Add this import
import OfflineIcon from '@mui/icons-material/CloudOff'; // Add this import

const PackagesAndLessonTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  packagesData = [],
  changePackageStatus,
  expandLessonsWithPackage,
  deletePackage,
  editPackage,
}: Props) => {
  const router = useRouter();
  interface ColumnType {
    id:
      | "id"
      | "packageName"
      | "packageCategoryType"
      | "packageType"
      | "lessonsWithPackage"
      | "price"
      | "status"
      | "action"
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
      id: "packageName",
      label: "Package Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "packageCategoryType",
      label: "Package Category Type",
      minWidth: 170,
      align: "left",
    },
    {
      id: "packageType",
      label: "Package  Type",
      minWidth: 170,
      align: "left",
    },
    {
      id: "lessonsWithPackage",
      label: "Lessons With Package",
      minWidth: 170,
      align: "left",
    },
    {
      id: "price",
      label: "Price",
      minWidth: 170,
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 170,
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
                  {packagesData.map((row, index) => (
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
                      <TableCell align="left">{row?.packageName}</TableCell>
                      <TableCell align="left">
                        {row?.packageCategoryType}
                      </TableCell>
                      <TableCell align="left">
                        {row?.packageType === 'ONLINE' ? (
                          <Box display="flex" alignItems="center">
                            <OnlineIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                            {row?.packageType}
                          </Box>
                        ) : row?.packageType === 'OFFLINE' ? (
                          <Box display="flex" alignItems="center">
                            <OfflineIcon sx={{ marginRight: 1, color: 'text.secondary' }} />
                            {row?.packageType}
                          </Box>
                        ) : (
                          row?.packageType
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {row?.expandLessons
                          ? row?.lessonsWithPackage.map(
                              (lesson: any, index) => (
                                <Typography key={index} variant="subtitle1">
                                  {lesson?.name}
                                </Typography>
                              )
                            )
                          : row?.lessonsWithPackage
                              .slice(0, 2)
                              .map((lesson: any, index) => (
                                <Typography key={index} variant="subtitle1">
                                  {lesson?.name}
                                </Typography>
                              ))}
                        <Button
                          variant="text"
                          onClick={() => {
                            expandLessonsWithPackage(row.id);
                          }}
                        >
                          {row?.expandLessons ? "Read Less" : "Read More"}
                        </Button>
                      </TableCell>
                      <TableCell align="left">${row.price}</TableCell>
                      <TableCell align="left">
                        <SwitchLovely
                          checked={row.status}
                          size="small"
                          onClick={() =>
                            changePackageStatus(row?.id, row?.status)
                          }
                        />
                      </TableCell>
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
                          // onClick={() => router.push(`/manage/packages/update/${row.id}`)}
                          onClick={() => editPackage(row.id)}
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
                          onClick={() => deletePackage(row.id)}
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

export default PackagesAndLessonTable;

type packages = {
  id: number;
  packageName: string;
  packageCategoryType: string;
  packageType: string;
  lessonsWithPackage: [];
  expandLessons: boolean;
  price: string;
  status: boolean;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  packagesData?: packages[] | [];
  changePackageStatus: (id: number, status: boolean) => void;
  expandLessonsWithPackage: (id: number) => void;
  deletePackage: (id: number) => void;
  editPackage: (id: number) => void;
}