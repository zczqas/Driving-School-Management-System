import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import SubHeader from "../components/SubHeader";
import { useAppDispatch } from "@/hooks";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import { fetchUsers } from "@/store/user/user.actions";
import { debounce } from "lodash";
import isValidEmail from "@/utils/isValidEmail";
import { AppDispatch } from "@/store";
import { SwitchLovely } from "@/mui-treasury/switch-lovely";
import { updateUserStatus } from "@/store/user/user.actions";
import CustomDialog from "@/components/CustomDialog";

const CurrentInstructors = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
}: Props) => {
  const router = useRouter();
  const [selectedInstructor, setSelectedInstructor] = React.useState<any>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);
  const [selectedUserStatus, setSelectedUserStatus] = React.useState<boolean>(false);

  interface ColumnType {
    id: "id" | "userName" | "name" | "active" | "action" | "number" | "status";
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
      minWidth: 170,
      align: "left",
    },
    {
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 170,
      align: "left",
    },
    // {
    //   id: "active",
    //   label: "Active",
    //   minWidth: 150,
    //   align: "left",
    // },
    {
      id: "action",
      label: "Action",
      minWidth: 200,
      align: "left",
    },
  ];

  const dispatch = useAppDispatch();
  const { userList, userListLoading } = useSelector(
    (state: IRootState) => state.user
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("active");

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

  const debouncedFetch = debounce(
    async (searchTerm: string, status: string, dispatch: AppDispatch) => {
      try {
        const isActive =
          status === "active"
            ? true
            : status === "inactive"
            ? false
            : undefined;

        if (isValidEmail(searchTerm)) {
          dispatch(
            fetchUsers(
              "INSTRUCTOR",
              0,
              100,
              "",
              searchTerm,
              undefined,
              isActive
            )
          );
        } else {
          dispatch(
            fetchUsers(
              "INSTRUCTOR",
              0,
              100,
              searchTerm,
              undefined,
              undefined,
              isActive
            )
          );
        }
      } catch (error: any) {
        console.log("error", error);
      }
    },
    300
  );

  const fetchOptions = useCallback(
    (searchTerm: string, status: string) => {
      debouncedFetch(searchTerm, status, dispatch);
    },
    [dispatch]
  );

  useEffect(() => {
    fetchOptions(searchQuery, statusFilter);
  }, [fetchOptions, searchQuery, statusFilter]);

  useEffect(() => {
    if (!searchQuery) {
      const isActive =
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
          ? false
          : undefined;
      dispatch(
        fetchUsers(
          "INSTRUCTOR",
          page,
          rowsPerPage,
          undefined,
          undefined,
          undefined,
          isActive
        )
      );
    }
  }, [dispatch, page, rowsPerPage, searchQuery, statusFilter]);

  const instructorsData = userList?.users
    ? userList?.users?.map((user) => ({
        id: user.id,
        userName: user.email,
        name: user.first_name + " " + user.last_name,
        active: user.is_active,
      }))
    : [];

  return (
    <React.Fragment>
      <CustomDialog
        open={statusChangeDialog}
        handleClose={() => setStatusChangeDialog(false)}
        handleAccept={handleConfirmStatusChange}
        dialogTitle="Confirm Status Change"
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          Are you sure you want to {selectedUserStatus ? 'deactivate' : 'activate'} this instructor?
        </Box>
      </CustomDialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={userListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <SubHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        selectedInstructor={selectedInstructor}
        setSelectedInstructor={setSelectedInstructor}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />

      <Container maxWidth={false}>
        <Box
          sx={{
            py: 3,
          }}
        >
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
                  {instructorsData.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      hover
                      role="checkbox"
                      tabIndex={-1}
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
                        if (column.id === "active") {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              id={column.id}
                            >
                              {value ? "Active" : "Inactive"}
                            </TableCell>
                          );
                        }
                        if (column.id === "status") {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              id={column.id}
                            >
                              <SwitchLovely
                                checked={row.active}
                                size="small"
                                onClick={() =>
                                  handleToggleUserStatus(row.id, row.active)
                                }
                              />
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
                                  router.push(
                                    `/manage/schedule-appointment/${row.id}/?name=${row.name}`
                                  )
                                }
                                variant="contained"
                                sx={{
                                  color: "#fff",
                                  fontWeight: 500,
                                  borderRadius: "32px",
                                  mr: 1,
                                }}
                              >
                                Schedule
                              </Button>
                              {/* <Button
                                onClick={() =>
                                  router.push(
                                    `/manage/availability/${row.id}/?name=${row.name}`
                                  )
                                }
                                variant="contained"
                                sx={{
                                  color: "#fff",
                                  fontWeight: 500,
                                  borderRadius: "32px",
                                  mr: 1,
                                }}
                              >
                                Availability
                              </Button> */}
                              {/* <Button
                                onClick={() =>
                                  router.push(
                                    `/manage/instructor-appointment-management/${row.id}/?name=${row.name}`
                                  )
                                }
                                variant="contained"
                                sx={{
                                  color: "#fff",
                                  fontWeight: 500,
                                  borderRadius: "32px",
                                  mr: 1,
                                }}
                              >
                                Appointments
                              </Button> */}
                              <Button
                                variant="contained"
                                startIcon={
                                  <Image
                                    src="/icons/edit.svg"
                                    alt="edit"
                                    height={16}
                                    width={16}
                                  />
                                }
                                sx={{
                                  height: "32px",
                                  minWidth: "auto",
                                  padding: "4px 12px",
                                  backgroundColor: "#F37736",
                                  color: "#fff",
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  textTransform: "none",
                                  borderRadius: "32px",
                                  "&:hover": {
                                    backgroundColor: "#E66826",
                                  },
                                  mr: 1,
                                }}
                                onClick={() => {
                                  setSelectedInstructor(row);
                                  setOpenDialog(true);
                                }}
                              >
                                Edit
                              </Button>
                              {/* <IconButton
                                sx={{
                                  height: "40px",
                                  width: "40px",
                                  padding: "0px",
                                  backgroundColor: "#EB2D2F",
                                  "&:hover": {
                                    backgroundColor: "red",
                                  },
                                }}
                              >
                                <Image
                                  src="/icons/delete.svg"
                                  alt="eye"
                                  height={16}
                                  width={16}
                                />
                              </IconButton> */}
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
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default CurrentInstructors;

type instructor = {
  id: number;
  userName: string;
  name: string;
  active: boolean;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  instructorsData?: instructor[];
}
