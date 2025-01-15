/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import Link from "next/link";
import axiosInstance from "@/config/axios.config";
import {
  StyledTableHead,
  StyledTableRow,
  TableLoader,
} from "@/components/CustomTable";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  styled,
  TextField as MuiTextField,
  FormControl,
  Select,
  MenuItem,
  MenuProps,
  Box,
} from "@mui/material";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";

const TextField = styled(MuiTextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "40px",
    borderRadius: "32px",
    background: "#F6F6F6",
    "& fieldset": {
      border: "1px solid #D7DDE4",
    },
    "& input": {
      padding: "10px 14px",
    },
  },
}));

const CertificateListTable = ({
  loading = false,
  isSearching = false,
  page = 0,
  rowsPerPage = 100,
  certificateData = [],
  certificateType = 1,
  assignCertificate,
}: Props) => {
  const { role } = useAppSelector((state: IRootState) => state.auth);
  const columns: readonly ColumnType[] = [
    { id: "number", label: "No.", minWidth: 30, align: "left" },
    { id: "name", label: "Name", minWidth: 170, align: "left" },
    { id: "email", label: "Email", minWidth: 170, align: "left" },
    {
      id:
        certificateType === 2
          ? "driverTrainingPinkCertificate"
          : "driverTrainingGoldCertificate",
      label:
        certificateType === 2
          ? "Driver Training (Pink) Certificate #"
          : "Driver Training (Gold) Certificate #",
      minWidth: 170,
      align: "left",
    },
    {
      id: "assignedDate",
      label: "Assigned Date",
      minWidth: 170,
      align: "left",
    },
    { id: "instructor", label: "Instructor", minWidth: 170, align: "left" },
    { id: "action", label: "Action", minWidth: 170, align: "left" },
  ];

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axiosInstance.get("/user/get", {
          params: {
            offset: 0,
            limit: 100,
            order: "DESC",
            sort: "UPDATED_AT",
            role: "INSTRUCTOR",
            is_active: true,
          },
        });

        setInstructors(response.data?.users || []);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

  console.log("certificateData", certificateData);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps: Partial<MenuProps> = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 8 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Formik
      initialValues={{ certificates: certificateData }}
      onSubmit={(values) => {
        // You can handle form submission here if needed
      }}
    >
      {({ values, setFieldValue }) => {
        useEffect(() => {
          setFieldValue("certificates", certificateData);
        }, [certificateData, setFieldValue]);
        return (
          <Form>
            <FieldArray name="certificates">
              {() => (
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
                        {values?.certificates?.length > 0 ? (
                          values.certificates.map((row, index) => (
                            <StyledTableRow
                              key={row.id}
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

                                if (
                                  column.id ===
                                    "driverTrainingPinkCertificate" ||
                                  column.id === "driverTrainingGoldCertificate"
                                ) {
                                  return (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                      id={column.id}
                                    >
                                      <TextField
                                        value={row[column.id] || ""}
                                        onChange={(e) => {
                                          setFieldValue(
                                            `certificates.${index}.${column.id}`,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </TableCell>
                                  );
                                }

                                if (column.id === "name") {
                                  return (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                      id={column.id}
                                    >
                                      <Link
                                        href={`/manage/profile/${row?.student_id}`}
                                        target="_blank"
                                      >
                                        {row.name}
                                      </Link>
                                    </TableCell>
                                  );
                                }

                                if (column.id === "instructor") {
                                  return (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                      id={column.id}
                                    >
                                      <FormControl
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        sx={{ minWidth: "131px" }}
                                      >
                                        <Select
                                          value={row.instructor || ""}
                                          onChange={(e) => {
                                            setFieldValue(
                                              `certificates.${index}.instructor`,
                                              e.target.value
                                            );
                                          }}
                                          displayEmpty
                                          MenuProps={MenuProps}
                                          sx={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            color: "dark.main",
                                            fontFamily: (theme) =>
                                              theme.typography.button
                                                .fontFamily,
                                            borderRadius: "32px",
                                          }}
                                          disabled={role === "INSTRUCTOR"}
                                        >
                                          <MenuItem value="" disabled>
                                            Select an instructor
                                          </MenuItem>
                                          {instructors.map(
                                            (instructor: any) => (
                                              <MenuItem
                                                key={instructor?.id}
                                                value={instructor?.id}
                                              >
                                                {`${
                                                  instructor?.first_name || ""
                                                } ${
                                                  instructor?.last_name || ""
                                                }`}
                                              </MenuItem>
                                            )
                                          )}
                                        </Select>
                                      </FormControl>
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
                                        variant="contained"
                                        onClick={() =>
                                          assignCertificate(
                                            row?.id,
                                            certificateType === 1
                                              ? "GOLD"
                                              : "PINK",
                                            row?.instructor,
                                            row?.driverTrainingGoldCertificate ||
                                              row?.driverTrainingPinkCertificate
                                          )
                                        }
                                        sx={{
                                          background: "#A4A8BE",
                                          borderRadius: "32px",
                                          padding: "12px 20px",
                                          height: "40px",
                                        }}
                                        disabled={!row?.instructor}
                                      >
                                        Submit
                                      </Button>
                                    </TableCell>
                                  );
                                }

                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                    id={column.id}
                                  >
                                    {row[column.id] ?? "-"}
                                  </TableCell>
                                );
                              })}
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            <TableCell
                              sx={{
                                width: "100%",
                                textAlign: "center",
                                padding: "20px",
                                color: "dark.main",
                                fontSize: "16px",
                                fontWeight: 500,
                              }}
                              colSpan={columns.length}
                            >
                              No Any Pending Certificate
                            </TableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              )}
            </FieldArray>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CertificateListTable;

interface Props {
  loading?: boolean;
  isSearching?: boolean;
  page?: number;
  rowsPerPage?: number;
  certificateData?: any[];
  certificateType?: number;
  assignCertificate: (
    certificateId: string,
    certificateType: "GOLD" | "PINK",
    instructorId: string,
    certificateNumber: string
  ) => void;
}

interface ColumnType {
  id:
    | "id"
    | "name"
    | "email"
    | "phone"
    | "birthday"
    | "scheduledhours"
    | "driverTrainingGoldCertificate"
    | "driverTrainingPinkCertificate"
    | "assignedDate"
    | "instructor"
    | "action"
    | "number";
  label: string;
  minWidth?: number;
  align?: "center" | "right" | "left";
  format?: (value: number) => string;
}
