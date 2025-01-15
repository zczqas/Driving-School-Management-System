import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material";
import React from "react";
import CustomDialog from "@/components/CustomDialog";
import { updateUserDetailsFromList, updateUserStatus } from "@/store/user/user.actions";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Formik } from "formik";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { useAppDispatch } from "@/hooks";
import { SwitchLovely } from "@/mui-treasury/switch-lovely";
import formatDateToString from "@/utils/formatDateToString";

const UserListTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  usersData = [],
}: Props) => {
  interface ColumnType {
    id:
      | "id"
      | "userName"
      | "firstName"
      | "lastName"
      | "role"
      | "status"
      | "phoneNumber"
      // | "loginDate"
      | "createdDate"
      | "updatedAt"
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
      id: "userName",
      label: "User Name",
      minWidth: 170,
      align: "left",
    },
    // {
    //   id: "phoneNumber",
    //   label: "Phone Number",
    //   minWidth: 170,
    //   align: "left",
    // },
    {
      id: "firstName",
      label: "First Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "lastName",
      label: "Last Name",
      minWidth: 170,
      align: "left",
    },
    {
      id: "role",
      label: "Role",
      minWidth: 170,
      align: "left",
    },
    {
      id: "status",
      label: "Status",
      minWidth: 100,
      align: "left",
    },
    // {
    //   id: "loginDate",
    //   label: "Last Login",
    //   minWidth: 170,
    //   align: "left",
    // },
    {
      id: "createdDate",
      label: "Created Date",
      minWidth: 120,
      align: "left",
    },
    {
      id: "updatedAt",
      label: "Updated At",
      minWidth: 120,
      align: "left",
    },
    {
      id: "action",
      label: "Actions",
      minWidth: 120,
      align: "left",
    },
  ];

  const dispatch = useAppDispatch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<user | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<
    "STUDENT" | "CSR" | "INSTRUCTOR"
  >("STUDENT");
  const router = useRouter();

  const handleClickOpen = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setSelectedRole("STUDENT");
    setOpenDialog(false);
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
    console.log("Called");
  };

  const handleToggleLockUser = (user: user) => {
    dispatch(updateUserStatus(user.id, !user.is_active));
  };

  return (
    <React.Fragment>
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        isFormikForm
        dialogTitle="Update User"
      >
        <Box sx={{ minWidth: "500px" }}>
          <Formik
            initialValues={{
              firstName: selectedUser?.firstName || "",
              lastName: selectedUser?.lastName || "",
            }}
            enableReinitialize
            validationSchema={Yup.object().shape({
              firstName: Yup.string()
                .max(255)
                .required("First Name is required"),
              lastName: Yup.string().max(255).required("Last Name is required"),
            })}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              try {
                const formData = {
                  first_name: values.firstName,
                  last_name: values.lastName,
                  role: selectedRole,
                };
                console.log({ formData });
                dispatch(
                  updateUserDetailsFromList(
                    formData,
                    setOpenDialog(false),
                    selectedUser?.id
                  )
                );
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setSubmitting(false);
              }
            }}
          >
            {({
              touched,
              errors,
              values,
              handleBlur,
              handleChange,
              isSubmitting,
              handleSubmit,
              setFieldValue,
            }) => {
              return (
                <form>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.firstName && errors.firstName)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="firstName-update">
                        First Name *
                      </CustomLabel>
                      <CustomInput
                        id="firstName-update"
                        type="text"
                        value={values.firstName}
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>

                    <FormControl
                      variant="standard"
                      error={Boolean(touched.lastName && errors.lastName)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor="lastName-update">
                        Last Name *
                      </CustomLabel>
                      <CustomInput
                        id="lastName-update"
                        type="text"
                        value={values.lastName}
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                    </FormControl>

                    <Box>
                      <CustomLabel shrink htmlFor="role-update">
                        Role *
                      </CustomLabel>
                      <Select
                        labelId="role-update"
                        id="role-update"
                        value={selectedRole}
                        fullWidth
                        sx={{
                          borderRadius: 35,
                          fontSize: "16px",
                          fontWeight: 500,
                          padding: "0 16px",
                        }}
                        onChange={(e: any) => setSelectedRole(e.target.value)}
                      >
                        <MenuItem value={"STUDENT"}>Student</MenuItem>
                        <MenuItem value={"INSTRUCTOR"}>Instructor</MenuItem>
                        <MenuItem value={"CSR"}>CSR</MenuItem>
                      </Select>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      mt: 3,
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      disableElevation
                      size="large"
                      variant="outlined"
                      color="primary"
                      sx={{
                        borderRadius: "100px",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: 700,
                        maxWidth: "175px",
                        width: "100%",
                        mr: 2,
                      }}
                      onClick={handleCloseDialog}
                    >
                      Cancel
                    </Button>
                    <Button
                      disableElevation
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        handleSubmit(e as any)
                      }
                      sx={{
                        borderRadius: "100px",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: 700,
                        maxWidth: "175px",
                        width: "100%",
                      }}
                    >
                      Confirm
                    </Button>
                  </Box>
                </form>
              );
            }}
          </Formik>
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
            <Table stickyHeader sx={{ minWidth: 750 }}>
              <StyledTableHead>
                <StyledTableRow>
                  {columns.map((column) => (
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
                  {usersData.map((row, index) => (
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
                        if (column.id === "action") {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              id={column.id}
                            >
                              <Button
                                onClick={() => handleClickOpen(row)}
                                variant="contained"
                                sx={{
                                  backgroundColor: "#FEC039",
                                  color: "#fff",
                                  fontWeight: 500,
                                  borderRadius: "32px",
                                  "&:hover": {
                                    backgroundColor: "#FEC039",
                                  },
                                }}
                              >
                                Update
                              </Button>
                            </TableCell>
                          );
                        } else if (column.id === "status") {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              id={column.id}
                            >
                              <SwitchLovely
                                checked={row.is_active}
                                size="small"
                                onClick={() => handleToggleLockUser(row)}
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

export default UserListTable;

type user = {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
  // loginDate: string;
  createdDate: string;
  updatedAt: string;
  is_active: boolean;
};

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  usersData?: user[];
}
