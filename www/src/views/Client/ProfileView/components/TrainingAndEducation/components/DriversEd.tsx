import React, { useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import moment from "moment";
import Theme from "@/themes";

import {
  fetchStudentTestStatus,
  fetchStudentProgress,
} from "@/store/driverEd/driver.actions";
import { useAppDispatch, useAppSelector } from "@/hooks";
import withEmailVerification from "@/components/WithEmailVerification";

const DriversEd = withEmailVerification(({ userId }: any) => {
  const dispatch = useAppDispatch();

  const {
    studentProgress,
    studentProgressLoading,
    studentTestStatus,
    studentTestStatusLoading,
  } = useAppSelector((state: any) => state.driver);

  useEffect(() => {
    dispatch(fetchStudentProgress());
    dispatch(fetchStudentTestStatus(userId));
  }, [dispatch, userId]);

  return (
    <React.Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
        open={studentProgressLoading || studentTestStatusLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ overflow: "auto" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* Student Progress Table */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                backgroundColor: Theme.palette.primary.main,
                p: 1,
                borderRadius: "6px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#fff",
                }}
              >
                Student Progress
              </Typography>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ border: "1px solid #EAECEE", borderRadius: "8px" }}
            >
              <Table stickyHeader>
                <StyledTableHead>
                  <StyledTableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Lesson ID
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Unit ID
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Is Passed
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Updated At
                    </TableCell>
                  </StyledTableRow>
                </StyledTableHead>
                <TableBody>
                  {studentProgress?.map((row: any, index: any) => (
                    <StyledTableRow key={index} hover>
                      <TableCell>{row.lesson_id}</TableCell>
                      <TableCell>{row.unit_id}</TableCell>
                      <TableCell>{row.is_passed ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {moment(row.updated_at).format("MMM DD YYYY hh:mm a")}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                backgroundColor: Theme.palette.primary.main,
                p: 1,
                borderRadius: "6px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#fff",
                }}
              >
                Students Test Status
              </Typography>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ border: "1px solid #EAECEE", borderRadius: "8px" }}
            >
              <Table stickyHeader>
                <StyledTableHead>
                  <StyledTableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Unit</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Marks</TableCell>
                    <TableCell style={{ fontWeight: "bold", width: 500 }}>
                      Detail
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Progress Date
                    </TableCell>
                  </StyledTableRow>
                </StyledTableHead>
                <TableBody>
                  {studentTestStatus?.map((row: any, index: any) => (
                    <StyledTableRow key={index} hover>
                      <TableCell>{row.unit_id}</TableCell>
                      <TableCell>{row.marks}</TableCell>
                      <TableCell
                        sx={{
                          width: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.detail ? row.detail : "-"}
                      </TableCell>
                      <TableCell>
                        {moment(row.progress_date).format(
                          "MMM DD YYYY hh:mm a"
                        )}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
});

export default DriversEd;
