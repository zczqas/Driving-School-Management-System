import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  TablePagination,
  Pagination,
} from "@mui/material";
import React from "react";
import CustomDialog from "@/components/CustomDialog";
import { useDispatch } from "react-redux";
import { updateUserRole, updateUserStatus } from "@/store/user/user.actions";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks";
import { SwitchLovely } from "@/mui-treasury/switch-lovely";

const StudentManagementTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 10,
  usersData = [],
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
}: Props) => {
  const router = useRouter();
  interface ColumnType {
    id:
      | "id"
      | "userName"
      | "firstName"
      | "lastName"
      | "school"
      | "pinkCert"
      | "goldCert"
      | "loginDate"
      | "createdDate"
      | "transaction"
      | "certificates"
      | "action"
      | "driving_school"
      | "number"
      | "status"
      | "is_active";
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
      id: "userName",
      label: "User Name",
      minWidth: 130,
      align: "left",
    },
    {
      id: "firstName",
      label: "First Name",
      minWidth: 130,
      align: "left",
    },
    {
      id: "lastName",
      label: "Last Name",
      minWidth: 130,
      align: "left",
    },
    {
      id: "driving_school",
      label: "Driving School",
      minWidth: 170,
      align: "left",
    },
    {
      id: "createdDate",
      label: "Created Date",
      minWidth: 140,
      align: "left",
    },
    {
      id: "transaction",
      label: "Transactions",
      minWidth: 70,
      align: "left",
    },
    {
      id: "certificates",
      label: "Certificates",
      minWidth: 70,
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 70,
      align: "left",
    },
    {
      id: "action",
      label: "Actions",
      minWidth: 70,
      align: "left",
    },
  ];

  const dispatch = useDispatch<any>();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<user | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<
    "STUDENT" | "CSR" | "INSTRUCTOR"
  >("STUDENT");
  const [paginationState, setPaginationState] = React.useState({
    currentPage: page,
    currentRowsPerPage: rowsPerPage
  });
  const [statusChangeDialog, setStatusChangeDialog] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);
  const [selectedUserStatus, setSelectedUserStatus] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!loading) {
      setPaginationState({
        currentPage: page,
        currentRowsPerPage: rowsPerPage
      });
    }
  }, [page, rowsPerPage, loading]);

  const handleClickOpen = (user: any) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setSelectedRole("STUDENT");
    setOpenDialog(false);
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
    if (selectedUser) {
      dispatch(updateUserRole(selectedUser.id, selectedRole));
    }
  };

  const handleToggleUserStatus = (userId: number, isActive: boolean) => {
    setSelectedUserId(userId);
    setSelectedUserStatus(isActive);
    setStatusChangeDialog(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedUserId !== null) {
      dispatch(updateUserStatus(selectedUserId, !selectedUserStatus));
      setStatusChangeDialog(false);
    }
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <React.Fragment>
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle="Update Role"
      >
        <Box>
          <Typography>
            Are you sure you want to update the role of this user?
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedRole}
            label="Age"
            fullWidth
            sx={{ marginTop: "20px" }}
            onChange={(e: any) => setSelectedRole(e.target.value)}
          >
            <MenuItem value={"STUDENT"} disabled>
              STUDENT
            </MenuItem>
            <MenuItem value={"INSTRUCTOR"}>Instructor</MenuItem>
            <MenuItem value={"CSR"}>CSR</MenuItem>
          </Select>
        </Box>
      </CustomDialog>

      <CustomDialog
        open={statusChangeDialog}
        handleClose={() => setStatusChangeDialog(false)}
        handleAccept={handleConfirmStatusChange}
        dialogTitle="Confirm Status Change"
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          Are you sure you want to {selectedUserStatus ? 'deactivate' : 'activate'} this student?
        </Box>
      </CustomDialog>

      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer
            sx={{
              // maxHeight: "697px",
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

              <TableBody sx={{ maxHeight: "52px" }}>
                {(loading || isSearching) ? (
                  <TableLoader columns={columns as ColumnType[]} rowsPerPage={rowsPerPage} />
                ) : (
                  usersData.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      sx={{ cursor: "pointer" }}
                    >
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
                        }
                        if (column.id === "action") {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              id={column.id}
                            >
                              <Button
                                onClick={() =>
                                  router.push(`/manage/profile/${row.id}`)
                                }
                                variant="contained"
                                sx={{
                                  background: '#2563EB', // Modern blue
                                  color: '#FFFFFF',
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                  letterSpacing: '0.025em',
                                  borderRadius: '8px',
                                  padding: '6px 16px',
                                  textTransform: 'none', // Prevents all-caps
                                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    background: '#1D4ED8', // Slightly darker blue on hover
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    transform: 'translateY(-1px)',
                                  },
                                }}
                              >
                                Update
                              </Button>
                            </TableCell>
                          );
                        } else if (column.id === "driving_school") {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              id={column.id}
                            >
                              {row.driving_school
                                ? row.driving_school.map((school: any) => (
                                    <Typography key={school.id}>
                                      {school?.name}
                                    </Typography>
                                  ))
                                : "-"}
                            </TableCell>
                          );
                        } else if (column.id === "status") {
                          return (
                            <TableCell key={column.id} align={column.align} id={column.id}>
                              <SwitchLovely
                                checked={row.is_active}
                                size="small"
                                onClick={() => handleToggleUserStatus(row.id, row.is_active)}
                              />
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mt: 2,
          gap: 2,
        }}
      >
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(event, page) => onPageChange?.(event, page)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          sx={{ 
            borderBottom: "none",
            '.MuiTablePagination-toolbar': {
              paddingLeft: 0,
              paddingRight: 0,
            },
            '.MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel': {
              margin: 0,
            },
            // Hide the default pagination actions
            '.MuiTablePagination-actions': {
              display: 'none',
            },
          }}
        />
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(event, newPage) => onPageChange?.(event, newPage - 1)}
          shape="rounded"
          size="small"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#6B7280',
              borderRadius: '9999px',
              '&.Mui-selected': {
                backgroundColor: '#6366F1',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#4F46E5',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.04)',
              },
            },
          }}
        />
      </Box>
    </React.Fragment>
  );
};

export default StudentManagementTable;

type user = {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  pinkCert: string | null;
  goldCert: string | null;
  school: string | null;
  driving_school: any[];
  loginDate: string;
  createdDate: string;
  transaction: number;
  certificates: string[] | null;
  is_active: boolean;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  usersData?: user[];
  totalCount?: number;
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<unknown> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
