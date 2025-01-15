import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import formatDateToString from "@/utils/formatDateToString";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Image from "next/image";
import React, { Fragment } from "react";

interface Props {
  TrainingInstructionData: any[];
  editTrainingInstruction: (id: string) => void;
  deleteTrainingInstruction: (id: string) => void;
}

const TrainingInstructionTable = ({
  TrainingInstructionData,
  editTrainingInstruction,
  deleteTrainingInstruction,
}: Props) => {
  function parseDate(date: Date) {
    return new Date(date).toLocaleDateString();
  }
  return (
    <Fragment>
      <TableContainer>
        <Table
          sx={{ minWidth: 750, background: "#fff" }}
          aria-labelledby="tableTitle"
        >
          <StyledTableHead>
            <TableRow>
              <TableCell>NO.</TableCell>
              <TableCell align="left">NAME</TableCell>
              <TableCell align="left">DESCRIPTION</TableCell>
              <TableCell align="left">CREATED AT</TableCell>
              <TableCell align="left">UPDATED AT</TableCell>
              <TableCell align="left">Action</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {TrainingInstructionData?.length > 0 ? (
              TrainingInstructionData?.map((row: any, index: number) => (
                <Fragment key={index}>
                  <StyledTableRow hover>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{row.name ?? "-"}</TableCell>
                    <TableCell align="left">{row.description ?? "-"}</TableCell>
                    <TableCell align="left">
                      {formatDateToString(row.created_at)}
                    </TableCell>
                    <TableCell align="left">
                      {formatDateToString(row.updated_at)}
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
                        onClick={() => {
                          editTrainingInstruction(row.id);
                        }}
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
                        onClick={() => {
                          deleteTrainingInstruction(row.id);
                        }}
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
                </Fragment>
              ))
            ) : (
              <StyledTableRow>
                <TableCell component="th" scope="row" colSpan={9} align="center">
                  No Training Instructions Found
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default TrainingInstructionTable;
