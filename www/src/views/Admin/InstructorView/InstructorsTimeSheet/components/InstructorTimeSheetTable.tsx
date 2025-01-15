import * as React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  Box,
  TableContainer,
  Paper,
} from "@mui/material";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import { useRouter } from "next/router";
import TruncatedCell from "@/components/TruncatedCell";

interface appointmentType {
  studentId: string;
  studentName: string;
  classDate: string;
  timeStart: string;
  timeEnd: string;
  status: string;
  instructorTimeIn: string;
  instructorTimeOut: string;
  mileageIn: string;
  mileageOut: string;
  type: string;
}

// Instructor Time Sheet Table

function InstructorTimeSheetTable({
  appointments = [],
}: {
  appointments: [] | appointmentType[];
}) {
  const router = useRouter();
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <StyledTableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Class Date</TableCell>
              <TableCell>Time Start</TableCell>
              <TableCell>Time End</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Instructor Time In</TableCell>
              <TableCell>Instructor Time Out</TableCell>
              <TableCell>Mileage In</TableCell>
              <TableCell>Mileage Out</TableCell>
              <TableCell>Type</TableCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {appointments?.length > 0 ? (
              appointments.map((appointment, index) => (
                <StyledTableRow
                  hover
                  key={index}
                  sx={{
                    "& .MuiTableCell-root": {
                      padding: "6px 12px",
                      fontSize: "14px",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    router.push(`/manage/profile/${appointment.studentId}`);
                  }}
                >
                  <TableCell>{appointment.studentName}</TableCell>
                  <TableCell>{appointment.classDate}</TableCell>
                  <TableCell>{appointment.timeStart}</TableCell>
                  <TableCell>{appointment.timeEnd}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>{appointment.instructorTimeIn}</TableCell>
                  <TableCell>{appointment.instructorTimeOut}</TableCell>
                  <TableCell>{appointment.mileageIn}</TableCell>
                  <TableCell>{appointment.mileageOut}</TableCell>
                  <TruncatedCell
                    text={appointment.type}
                    maxLength={15}
                    sx={{ maxWidth: "200px" }}
                  />
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={10} align="center">
                  No Appointments Found! Please change or select pay period.
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default InstructorTimeSheetTable;
