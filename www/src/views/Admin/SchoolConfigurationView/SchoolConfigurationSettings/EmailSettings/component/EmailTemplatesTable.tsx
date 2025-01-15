import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";

import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment } from "react";

interface Props {
  emailTemplateList: any[];
  handleOpenDialog: (template: any) => void;
}

const EmailTemplatesTable = ({
  emailTemplateList,
  handleOpenDialog,
}: Props) => {
  console.log({ emailTemplateList });

  const router = useRouter();

  return (
    <Fragment>
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer
            sx={{ border: "1px solid #EAECEE", borderRadius: "8px" }}
            component={Paper}
          >
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <StyledTableHead>
                <TableRow>
                  <TableCell>NO.</TableCell>
                  <TableCell align="left">NAME</TableCell>

                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {emailTemplateList?.length > 0 ? (
                  emailTemplateList?.map((row: any, index: number) => (
                    <Fragment key={index}>
                      <StyledTableRow>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">{row ?? "-"}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            sx={{
                              padding: "6px 8px", // Adjust padding for rectangular shape
                              backgroundColor: "#1D24CA",
                              "&:hover": {
                                backgroundColor: "#201658",
                              },
                              "&:disabled": {
                                backgroundColor: "#F9E8C9",
                              },
                              mr: 1,
                              borderRadius: "4px",
                            }}
                            disabled={row.scheduled_lesson > 0}
                            onClick={() => handleOpenDialog(row)}
                          >
                            <Image
                              src="/assets/icons/settings.svg"
                              alt="eye"
                              height={16}
                              width={16}
                              style={{ marginRight: "8px" }}
                            />
                            <span
                              style={{
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: "#fff",
                              }}
                            >
                              Edit
                            </span>
                          </IconButton>
                        </TableCell>
                      </StyledTableRow>
                    </Fragment>
                  ))
                ) : (
                  <StyledTableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      colSpan={9}
                      align="center"
                    >
                      No Email Templates Found found
                    </TableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Fragment>
  );
};

export default EmailTemplatesTable;
