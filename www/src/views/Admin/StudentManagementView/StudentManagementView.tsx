import React, { Fragment, useCallback, useState, useEffect } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  SelectChangeEvent,
  FormControl,
  Select,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import StudentManagementTable from "./components/StudentManagementTable";
import { fetchUsers } from "@/store/user/user.actions";
import { useDispatch, useSelector } from "react-redux";
import IRootState from "@/store/interface";
import generateCertificateWithHash from "@/utils/generateCertificate";
import isValidEmail from "@/utils/isValidEmail";
import { debounce } from "lodash";
import formatDateToString from "@/utils/formatDateToString";
import { fetchDrivingSchools } from "@/store/masterlist/masterlist.actions";
import { AppDispatch } from "@/store";

// ==============================|| STUDENT MANAGEMENT VIEW ||============================== //
const StudentManagementView = () => {
  const [sortBy, setSortBy] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  const dispatch = useDispatch<any>();
  const { userList, userListLoading } = useSelector(
    (state: IRootState) => state.user
  );
  const { drivingSchool } = useSelector(
    (state: IRootState) => state.masterlist
  );

  React.useEffect(() => {
    const isActive = statusFilter === "active" 
      ? true 
      : statusFilter === "inactive" 
      ? false 
      : undefined;

    dispatch(
      fetchUsers(
        "STUDENT",
        offset,
        limit,
        undefined,
        undefined,
        undefined,
        isActive
      )
    );
    dispatch(fetchDrivingSchools());
  }, [dispatch, offset, limit]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
    setPage(0);
    setOffset(0);
    
    if (event.target.value === "ALL") {
      dispatch(fetchUsers("STUDENT", 0, rowsPerPage));
    } else {
      dispatch(
        fetchUsers(
          "STUDENT",
          0,
          rowsPerPage,
          "",
          "",
          parseInt(event.target.value as string)
        )
      );
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
    setOffset(newPage * rowsPerPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setLimit(newRowsPerPage);
    setPage(0);
    setOffset(0);
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
              "STUDENT",
              offset,
              limit,
              "",
              searchTerm,
              undefined,
              isActive
            )
          );
        } else {
          dispatch(
            fetchUsers(
              "STUDENT",
              offset,
              limit,
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
          "STUDENT",
          offset,
          limit,
          undefined,
          undefined,
          undefined,
          isActive
        )
      );
    }
  }, [dispatch, offset, limit, searchQuery, statusFilter]);

  const filteredUsersData = userList?.users
    ? userList.users
        // Filter moved to backend
        // .filter(
        //   (user) =>
        //     user.email.includes(searchQuery) ||
        //     user.first_name.includes(searchQuery) ||
        //     user.last_name.includes(searchQuery)
        // )
        .map((user) => ({
          id: user.id,
          userName: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          school: user.school,
          driving_school: user.driving_school,
          pinkCert: null,
          goldCert: generateCertificateWithHash("sfds", 2024, user.id),
          loginDate: "12/15/2023",
          createdDate: formatDateToString(user.created_at),
          transaction: user?.transactions?.length ?? 0,
          certificates: null,
          is_active: user.is_active,
        }))
    : [];

  return (
    <Fragment>
      <Backdrop
        open={userListLoading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress color="inherit" />
        </Box>
      </Backdrop>
      <SubHeader
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        drivingSchools={drivingSchool}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <Container maxWidth={false}>
        <Box py={3}>
          <StudentManagementTable 
            usersData={filteredUsersData}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={userList?.total_count || 0}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            loading={userListLoading}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default StudentManagementView;
