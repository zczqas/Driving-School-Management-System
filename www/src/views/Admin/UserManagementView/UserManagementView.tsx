import React, { Fragment, useCallback } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  SelectChangeEvent,
} from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import UserListTable from "./components/UserListTable";
import { fetchUsers } from "@/store/user/user.actions";
import { useDispatch, useSelector } from "react-redux";
import IRootState from "@/store/interface";
import { debounce, update } from "lodash";

// import utils
import isValidEmail from "@/utils/isValidEmail";
import moment from "moment";

// ==============================|| USER Management VIEW ||============================== //
const UserManagementView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");
  const [statusFilter, setStatusFilter] = React.useState("active");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const dispatch = useDispatch<any>();
  const { userList, userListLoading } = useSelector(
    (state: IRootState) => state.user
  );
  React.useEffect(() => {
    dispatch(fetchUsers("NOT_STUDENT"));
  }, []);

  const usersData = userList?.users
    ? userList.users
        .filter((user) => user.role !== "STUDENT")
        .map((user) => ({
          id: user.id,
          userName: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          // loginDate: "12-15-2023",
          phoneNumber: "-",
          updatedAt: moment(user.updated_at).format("MM-DD-YYYY"),
          role: user.role,
          is_active: user.is_active,
          createdDate: moment(user.created_at).format("MM-DD-YYYY"),
        }))
    : [];

  const [searchQuery, setSearchQuery] = React.useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      try {
        const isActive = statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined;
        if (isValidEmail(searchTerm)) {
          dispatch(fetchUsers("NOT_STUDENT", 0, 100, "", searchTerm, undefined, isActive));
        } else {
          dispatch(fetchUsers("NOT_STUDENT", 0, 100, searchTerm, undefined, undefined, isActive));
        }
      } catch (error: any) {
        console.log("error", error);
      }
    }, 300),
    [dispatch, statusFilter]
  );

  React.useEffect(() => {
    console.log(searchQuery);
    fetchOptions(searchQuery);
  }, [fetchOptions, searchQuery]);

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
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <Container maxWidth={false} sx={{ overflow: "auto" }}>
        <Box
          sx={{
            py: 3,
          }}
        >
          <UserListTable usersData={usersData} />
        </Box>
      </Container>
    </Fragment>
  );
};

export default UserManagementView;
