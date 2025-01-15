import React, { Fragment, useState } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MuiLink,
  useTheme,
  Tabs,
  Tab,
  Badge,
  Button,
  Typography,
} from "@mui/material";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import formatDateToString from "@/utils/formatDateToString";
import CircularWithValueLabel from "@/components/CircularProgressWithLabel";
import CustomDialog from "@/components/CustomDialog";
import Theme from "@/themes";
import Image from "next/image";
import { useRouter } from "next/router";
import GlowingBadge from "@/components/GlowingBadge";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

/**
 * @param sortBy: string;
 * @param handleSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
 * @param transactionListByUserIdLoading: boolean;
 * @param transactionListByUserId: any; // Transaction List that is settled
 * @param pendingTransactionListByUserId: any; // Transaction List that is pending
 * @param drivingSchoolName: string;
 * @returns {ReactElement} - Transactions Mobile Component
 */

const Transactions = ({
  sortBy,
  handleSortChange,
  transactionListByUserIdLoading,
  transactionListByUserId,
  pendingTransactionListByUserId,
  pendingTransactionListByUserIdLoading,
  drivingSchoolName,
}: any) => {
  const router = useRouter();
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  function parseDate(date: Date) {
    return new Date(date).toLocaleDateString();
  }

  function handleLocationType(value: string) {
    if (value === "TELEPHONE") {
      return "☎️ Telephone";
    } else if (value === "WALK_IN") {
      return "🚶 Walk In";
    }
  }

  function handlePaymentMethod(value: string) {
    if (value === "CREDIT_CARD") {
      return "💳 Credit Card";
    } else if (value === "DEBIT_CARD") {
      return "💳 Debit Card";
    } else if (value === "CASH") {
      return "💵 Cash";
    } else if (value === "DIGITAL") {
      return "💰 Digital";
    }
  }

  const [isTransactionLessonsDialogOpen, setIsTransactionLessonsDialogOpen] =
    React.useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<any>(null);

  const handleCloseTransactionLessonsDialog = () => {
    setIsTransactionLessonsDialogOpen(false);
    setTimeout(() => {
      setSelectedTransaction(null);
    }, 500);
  };

  const handleOpenTransactionLessonsDialog = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsTransactionLessonsDialogOpen(true);
  };

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          transactionListByUserIdLoading ||
          pendingTransactionListByUserIdLoading
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
          mb: 2,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="Transaction tabs"
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontSize: "16px",
              lineHeight: "26px",
              fontWeight: 600,
              color: Theme.palette.common.black,
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#F37736",
            },
          }}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "#F37736",
            },
          }}
        >
          <Tab
            label="Settled Transactions"
            sx={{ width: "100%", padding: 1 }}
          />
          <Tab
            label={
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <GlowingBadge
                  badgeContent={
                    pendingTransactionListByUserId?.transactions?.length || 0
                  }
                  invisible={
                    !pendingTransactionListByUserId?.transactions?.length
                  }
                >
                  <span style={{ marginRight: "4px" }}>
                    Pending Transactions
                  </span>
                </GlowingBadge>
              </Box>
            }
            sx={{ width: "100%", padding: 1 }}
          />
        </Tabs>
      </Box>

      {tabIndex === 0 ? (
        <TableContainer
          sx={{
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
            background: "#fff",
          }}
        >
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <StyledTableHead>
              <TableRow>
                <TableCell>NO.</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: "20%",
                  }}
                >
                  Driving School
                </TableCell>
                <TableCell align="left">PACKAGE NAME</TableCell>
                <TableCell align="left">AMOUNT</TableCell>
                <TableCell align="left">DISCOUNT AMOUNT</TableCell>
                <TableCell align="left">METHOD</TableCell>
                <TableCell align="left">LOCATION</TableCell>
                <TableCell align="left">Transaction Date</TableCell>
                <TableCell align="left">
                  APPOINTMENT SCHEDULED (Lessons)
                </TableCell>
                <TableCell align="left">Added By</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: "10%",
                  }}
                >
                  Created At
                </TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {transactionListByUserId?.transactions &&
              transactionListByUserId?.transactions?.length > 0 ? (
                transactionListByUserId?.transactions?.map(
                  (row: any, index: number) => (
                    <Fragment key={index}>
                      <StyledTableRow>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">{drivingSchoolName}</TableCell>
                        <TableCell align="left">
                          {row?.package ? row?.package?.name : "-"}
                        </TableCell>
                        <TableCell align="left">${row?.amount}</TableCell>
                        <TableCell align="left">
                          {" "}
                          {row?.discount ? "$" + row?.discount : "-"}
                        </TableCell>
                        <TableCell align="left">
                          {handlePaymentMethod(row?.method)}
                        </TableCell>
                        <TableCell align="left">
                          {handleLocationType(row?.location)}
                        </TableCell>
                        <TableCell align="left">
                          {formatDateToString(row?.date_charged)}
                        </TableCell>
                        <TableCell align="left">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              justifyContent: "center",
                            }}
                          >
                            {row?.completed_appointments !== null &&
                            row?.total_lesson !== null &&
                            row?.total_lesson > 0 ? (
                              <>
                                <MuiLink
                                  sx={{ cursor: "pointer", fontWeight: 600 }}
                                  onClick={() => {
                                    handleOpenTransactionLessonsDialog(
                                      row?.package?.lessons
                                    );
                                  }}
                                >
                                  {`${row?.completed_appointments} / ${row?.total_lesson}`}
                                </MuiLink>
                                <CircularWithValueLabel
                                  progress={
                                    (row?.completed_appointments /
                                      row?.total_lesson) *
                                    100
                                  }
                                />
                              </>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  py: 1,
                                  px: 2,
                                  bgcolor: "grey.50",
                                  borderRadius: 1,
                                }}
                              >
                                <InfoOutlinedIcon
                                  sx={{
                                    color: "grey.400",
                                    fontSize: "1rem",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "grey.600",
                                    fontWeight: 500,
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  Schedule Unavailable
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{row?.created_by?.first_name}</TableCell>
                        <TableCell align="left">
                          {formatDateToString(row?.created_at)}
                        </TableCell>
                      </StyledTableRow>
                    </Fragment>
                  )
                )
              ) : (
                <StyledTableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    colSpan={9}
                    align="left"
                  >
                    No transactions found
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // ========= Pending Transactions =============
        <TableContainer
          sx={{
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
            background: "#fff",
          }}
        >
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <StyledTableHead>
              <TableRow>
                <TableCell>NO.</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: "20%",
                  }}
                >
                  Driving School
                </TableCell>
                <TableCell align="left">PACKAGE NAME</TableCell>
                <TableCell align="left">AMOUNT</TableCell>
                <TableCell align="left">DISCOUNT AMOUNT</TableCell>
                <TableCell align="left">METHOD</TableCell>
                <TableCell align="left">LOCATION</TableCell>
                <TableCell align="left">Transaction Date</TableCell>
                <TableCell align="left">Added By</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    width: "10%",
                  }}
                >
                  Created At
                </TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {pendingTransactionListByUserId?.transactions &&
              pendingTransactionListByUserId?.transactions?.length > 0 ? (
                pendingTransactionListByUserId?.transactions?.map(
                  (row: any, index: number) => (
                    <Fragment key={index}>
                      <StyledTableRow>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">{drivingSchoolName}</TableCell>
                        <TableCell align="left">
                          {row?.package ? row?.package?.name : "-"}
                        </TableCell>
                        <TableCell align="left">${row?.amount}</TableCell>
                        <TableCell align="left">
                          {" "}
                          {row?.discount ? "$" + row?.discount : "-"}
                        </TableCell>
                        <TableCell align="left">
                          {handlePaymentMethod(row?.method)}
                        </TableCell>
                        <TableCell align="left">
                          {handleLocationType(row?.location)}
                        </TableCell>
                        <TableCell align="left">
                          {formatDateToString(row?.date_charged)}
                        </TableCell>
                        <TableCell>{row?.created_by?.first_name}</TableCell>
                        <TableCell align="left">
                          {formatDateToString(row?.created_at)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            startIcon={
                              <Image
                                src="/icons/edit.svg"
                                alt="edit"
                                height={16}
                                width={16}
                              />
                            }
                            sx={{
                              height: "32px", // Smaller height
                              minWidth: "auto",
                              padding: "4px 12px",
                              backgroundColor: "#F37736",
                              color: "#fff",
                              fontSize: "14px",
                              fontWeight: 700,
                              textTransform: "none",
                              borderRadius: "32px",
                              "&:hover": {
                                backgroundColor: "#E66826",
                              },
                              mr: 1,
                            }}
                            onClick={() => {
                              router.push(
                                `/manage/accounting/update/${row?.id}?transactionStatus=PENDING&referrer=PROFILE_PAGE`
                              );
                            }}
                          >
                            Settle
                          </Button>
                        </TableCell>
                      </StyledTableRow>
                    </Fragment>
                  )
                )
              ) : (
                <StyledTableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    colSpan={9}
                    align="left"
                  >
                    No pending transactions found
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CustomDialog
        open={isTransactionLessonsDialogOpen}
        handleClose={() => {
          handleCloseTransactionLessonsDialog();
        }}
        handleAccept={() => {}}
        dialogTitle="Lessons"
        fullWidth
        isNotAForm
        maxWidth="xl"
      >
        <Box>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  <TableCell>NO.</TableCell>
                  <TableCell align="center">LESSON NAME</TableCell>
                  <TableCell align="center">LESSON DURATION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTransaction?.map((row: any, index: number) => (
                  <Fragment key={index}>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">{row?.name}</TableCell>
                      <TableCell align="center">
                        {row?.duration ?? "-"} Hours
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CustomDialog>
    </Fragment>
  );
};

export default Transactions;
