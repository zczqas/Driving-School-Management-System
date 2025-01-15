import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import moment from "moment";
import React, { Fragment } from "react";

interface Props {
  instructorNotesByUserId: any;
  instructorNotesByUserIdLoading: boolean;
}

const InstructorNotes = ({
  instructorNotesByUserId,
  instructorNotesByUserIdLoading,
}: Props) => {
  return (
    <Box
      sx={{
        borderRadius: "10px",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        background: "#fff",
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <StyledTableHead>
            <TableRow>
              <TableCell>NO.</TableCell>
              <TableCell align="left">NOTE</TableCell>
              <TableCell align="left">CREATED BY</TableCell>
              <TableCell align="left">CREATED AT</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {instructorNotesByUserIdLoading ? (
              <StyledTableRow>
                <TableCell align="center" colSpan={4}>
                  Loading...
                </TableCell>
              </StyledTableRow>
            ) : instructorNotesByUserId?.length > 0 ? (
              instructorNotesByUserId?.map((note: any, index: number) => (
                <StyledTableRow key={note.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="left">{note.note ?? "-"}</TableCell>
                  <TableCell align="left">
                    {note.instructor?.user?.first_name
                      ? `${note.instructor?.user?.first_name} ${
                          note.instructor?.user?.middle_name ?? ""
                        } ${note.instructor?.user?.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell align="left">
                    {moment(note.created_at).format("MM-DD-YYYY ") ?? "-"}
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell align="center" colSpan={4}>
                  No notes found.
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InstructorNotes;
