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
  schoolData: any[];
  handleOpenDialog: (school: any) => void;
}

const SchoolConfigurationViewTable = ({
  schoolData,
  handleOpenDialog,
}: Props) => {
  console.log({ schoolData });

  const router = useRouter();

  return (
    <Fragment>
      <Box sx={{ overflow: "auto", zoom: { xs: 0.85, lg: 0.9 } }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer
            sx={{ border: "1px solid #EAECEE", borderRadius: "8px" }}
            component={Paper}
          >
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <StyledTableHead>
                <StyledTableRow>
                  <TableCell>NO.</TableCell>
                  <TableCell align="center">NAME</TableCell>
                  <TableCell align="center">DESCRIPTION</TableCell>
                  <TableCell align="center">ADDRESS</TableCell>
                  <TableCell align="center">EMAIL</TableCell>
                  <TableCell align="center">PHONE</TableCell>
                  <TableCell align="center">WEBSITE</TableCell>
                  <TableCell align="center">DOMAIN</TableCell>
                  <TableCell align="center">Logo</TableCell>
                  <TableCell align="center" sx={{ minWidth: 170 }}>
                    SETTINGS
                  </TableCell>
                </StyledTableRow>
              </StyledTableHead>
              <TableBody>
                {schoolData?.length > 0 ? (
                  schoolData?.map((row: any, index: number) => (
                    <Fragment key={index}>
                      <StyledTableRow>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="center">{row.name ?? "-"}</TableCell>
                        <TableCell align="center">
                          {row.description ?? "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.address ?? "-"}
                        </TableCell>
                        <TableCell align="center">{row.email ?? "-"}</TableCell>
                        <TableCell align="center">{row.phone ?? "-"}</TableCell>
                        <TableCell align="center">
                          {row.website ?? "-"}
                        </TableCell>
                        <TableCell align="center">
                          {row.domain ?? "-"}
                        </TableCell>

                        <TableCell align="center">
                          <Box
                            sx={{
                              height: "52px",
                              width: "100%",
                              position: "relative",
                            }}
                          >
                            <Image
                              src={
                                row?.driving_school_urls?.logo_url
                                  ? `https://sfds.usualsmart.com/${row?.driving_school_urls?.logo_url}`
                                  : "/assets/surepasslogo.webp"
                              }
                              alt="logo"
                              fill
                              objectFit="contain"
                            />
                          </Box>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            minWidth: 350,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <IconButton
                              sx={{
                                padding: "6px 8px", // Adjust padding for rectangular shape
                                backgroundColor: "#F37736",
                                "&:hover": {
                                  backgroundColor: "#EB5B00",
                                },
                                "&:disabled": {
                                  backgroundColor: "#f377368f",
                                },
                                mr: 1,
                                borderRadius: "4px",
                              }}
                              disabled={row.scheduled_lesson > 0}
                              onClick={() => handleOpenDialog(row)}
                            >
                              <Image
                                src="/assets/icons/credit-card.svg"
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
                                Authorize API
                              </span>
                            </IconButton>
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
                              onClick={() =>
                                router.push(
                                  `/manage/school-configuration/${row.id}/basic`
                                )
                              }
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
                                Basic
                              </span>
                            </IconButton>
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
                              onClick={() =>
                                router.push(
                                  `/manage/school-configuration/${row.id}/email`
                                )
                              }
                            >
                              <Image
                                src="/icons/mail.svg"
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
                                Mail
                              </span>
                            </IconButton>
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
                              // disabled={row.scheduled_lesson > 0}
                              onClick={() => router.push(`/manage/blogs`)}
                            >
                              <Image
                                src="/icons/blogs.svg"
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
                                Blogs
                              </span>
                            </IconButton>
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    </Fragment>
                  ))
                ) : (
                  <StyledTableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      colSpan={12}
                      align="center"
                    >
                      No School found
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

export default SchoolConfigurationViewTable;
