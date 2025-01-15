import React, { Fragment, useCallback } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";

// style + assets
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// third party libraries
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  useTheme,
  Link as MuiLink,
  Typography,
  Fade,
  Tooltip,
  TablePagination,
  Pagination,
  LinearProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Image from "next/image";
import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchTransactionsStart } from "@/store/account/account.actions";
import IRootState from "@/store/interface";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import CustomDialog from "@/components/CustomDialog";
import CircularWithValueLabel from "@/components/CircularProgressWithLabel";
import formatDateToString from "@/utils/formatDateToString";
import CustomDateRangePicker from "@/components/CustomDateRangePicker";
import { fetchDrivingSchools } from "@/store/masterlist/masterlist.actions";

// ==============================|| SUB HEADER ||============================== //

const Transactions = ({ sortBy, handleSortChange }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { transactionList, transactionListLoading } = useAppSelector(
    (state: IRootState) => state.account
  );

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

  // Transaction list being fetched below on useCallback
  // React.useEffect(() => {
  //   dispatch(fetchTransactionsStart());
  // }, []);

  function parseDate(date: Date) {
    return new Date(date).toLocaleDateString();
  }
  const theme = useTheme();
  const [dateRange, setDateRange] = React.useState<
    {
      startDate: Date | undefined;
      endDate: Date | undefined;
      key: string;
    }[]
  >([
    {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [currentTransaction, setCurrentTransaction] =
    React.useState<string>("");
  const [currentSort, setCurrentSort] = React.useState<string>("CREATED_AT");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
  const [currentDrivingSchool, setCurrentDrivingSchool] =
    React.useState<string>("");

  function handleApplyDateRange() {
    const startDate = dateRange[0].startDate
      ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
      : "";
    const endDate = dateRange[0].endDate
      ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
      : "";

    dispatch(
      fetchTransactionsStart(
        0,
        30,
        currentTransaction || "",
        "",
        currentSort || "",
        startDate,
        endDate
      )
    );
    setShowDatePicker(false);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFilteredData = useCallback(
    debounce((name: string, drivingSchoolId: string) => {
      dispatch(
        fetchTransactionsStart(
          0,
          30,
          name,
          "",
          currentSort || "",
          dateRange[0].startDate
            ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
            : "",
          dateRange[0].endDate
            ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
            : "",
          drivingSchoolId
        )
      );
    }, 300),
    [dispatch, currentSort, dateRange]
  );

  const handleChangeTransaction = (name: string) => {
    setCurrentTransaction(name);
  };

  React.useEffect(() => {
    fetchFilteredData(currentTransaction, currentDrivingSchool);
  }, [currentTransaction, currentDrivingSchool]);

  // function handleChangeSort(sort: string) {
  //   setCurrentSort(sort);
  //   dispatch(
  //     fetchTransactionsStart(
  //       0,
  //       30,
  //       currentTransaction || "",
  //       "", // date_charged is no longer used
  //       sort || "",
  //       "", // startDate is no longer used
  //       "" // endDate is no longer used
  //     )
  //   );
  // }

  function handleClearFilters() {
    setDateRange([
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ]);
    setCurrentTransaction("");
    setCurrentSort("");
    setCurrentDrivingSchool("");
    dispatch(fetchTransactionsStart(0, 30));
  }

  function handleLocationType(value: string) {
    if (value === "TELEPHONE") {
      return "Telephone";
    } else if (value === "WALK_IN") {
      return "Walk In";
    }
  }

  // Add this useEffect near your other hooks
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const datePicker = document.getElementById("date-picker-container");
      if (datePicker && !datePicker.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(
      fetchTransactionsStart(
        newPage * rowsPerPage,
        rowsPerPage,
        currentTransaction || "",
        "",
        currentSort || "",
        dateRange[0].startDate
          ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
          : "",
        dateRange[0].endDate
          ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
          : "",
        currentDrivingSchool
      )
    );
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    dispatch(
      fetchTransactionsStart(
        0,
        newRowsPerPage,
        currentTransaction || "",
        "",
        currentSort || "",
        dateRange[0].startDate
          ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
          : "",
        dateRange[0].endDate
          ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
          : "",
        currentDrivingSchool
      )
    );
  };

  // Update the initial data fetch to include pagination
  React.useEffect(() => {
    dispatch(fetchTransactionsStart(0, rowsPerPage));
    // fetching driving schools for filter
    dispatch(fetchDrivingSchools(0, 25));
  }, [dispatch, rowsPerPage]);

  const { drivingSchoolList, drivingSchoolListLoading } = useAppSelector(
    (state: IRootState) => state?.masterlist?.drivingSchool
  );

  const handleDrivingSchoolChange = (schoolId: string) => {
    setCurrentDrivingSchool(schoolId);
    fetchFilteredData(currentTransaction, schoolId);
  };

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={transactionListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* ============ Dialog to view the lessons of transactions ============= */}
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
                  <TableCell align="left">LESSON NAME</TableCell>
                  {/* <TableCell align="left">LESSON DESCRIPTION</TableCell> */}
                  <TableCell align="left">LESSON DURATION</TableCell>
                  {/* <TableCell align="left">LESSON STATUS</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTransaction?.map((row: any, index: number) => (
                  <Fragment key={index}>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{row?.name}</TableCell>
                      {/* <TableCell align="left">
                        {row?.description ?? "-"}
                      </TableCell> */}
                      <TableCell align="left">
                        {row?.duration ?? "-"} Hours
                      </TableCell>
                      {/* <TableCell align="left">{row?.status ?? "-"}</TableCell> */}
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CustomDialog>

      <Box display={"flex"} gap={"12px"} alignItems={"center"} mb={"21px"}>
        <TextField
          value={currentTransaction || ""}
          placeholder="Search Transactions"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),

            sx: {
              borderRadius: "32px",
              backgroundColor: theme.palette.common.white,
            },
          }}
          onChange={(e) => handleChangeTransaction(e.target.value)}
        />

        {/* ============== HIDE FILTER BY STATUS ================ */}
        {/* <FormControl
          sx={{
            minWidth: "147px",
          }}
        >
          <InputLabel
            id="filter-by-status-label"
            sx={{
              fontSize: "14px",
              color: "#AFB4B8",
            }}
          >
            Filter by Status
          </InputLabel>
          <Select
            labelId="filter-by-status-label"
            id="demo-simple-select"
            label="Filter by Status"
            onChange={(event) => handleChangeSort(event.target.value)}
            value={currentSort}
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "dark.main",
              borderRadius: "32px",
              backgroundColor: theme.palette.common.white,

              fontFamily: (theme) => theme.typography.button.fontFamily,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.light,
              },
              ".MuiSvgIcon-root ": {
                fill: "#A8B0B9 !important",
              },
            }}
          >
            <MenuItem value="DATE_CHARGED">Sort by date charged</MenuItem>
            <MenuItem value="CREATED_AT">Sort by created date</MenuItem>
            <MenuItem value="NAME">Sort by name</MenuItem>
          </Select>
        </FormControl> */}

        <FormControl
          sx={{
            minWidth: "200px",
          }}
        >
          <InputLabel
            id="filter-by-driving-school-label"
            sx={{
              fontSize: "14px",
              color: "#AFB4B8",
            }}
          >
            Filter by Driving School
          </InputLabel>
          <Select
            labelId="filter-by-driving-school-label"
            id="driving-school-select"
            label="Filter by Driving School"
            onChange={(event) => handleDrivingSchoolChange(event.target.value)}
            value={currentDrivingSchool}
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "dark.main",
              borderRadius: "32px",
              backgroundColor: theme.palette.common.white,
              fontFamily: (theme) => theme.typography.button.fontFamily,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.light,
              },
              ".MuiSvgIcon-root ": {
                fill: "#A8B0B9 !important",
              },
            }}
          >
            <MenuItem value="">All Schools</MenuItem>
            {drivingSchoolList?.map((school: any) => (
              <MenuItem key={school.id} value={school.id.toString()}>
                {school.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ position: "relative" }}>
          <Button
            onClick={() => setShowDatePicker(!showDatePicker)}
            startIcon={
              <Image
                src="/icons/calendarIcon.svg"
                alt="calendar"
                width={20}
                height={20}
              />
            }
            sx={{
              height: "40px",
              borderRadius: "32px",
              backgroundColor: theme.palette.common.white,
              padding: "8px 16px",
              minWidth: "200px",
              justifyContent: "flex-start",
              border: "1px solid #E0E0E0",
              textTransform: "none",
              color: dateRange[0].startDate ? "text.primary" : "#AFB4B8",
              "&:hover": {
                backgroundColor: theme.palette.common.white,
                borderColor: theme.palette.secondary.light,
              },
            }}
          >
            {dateRange[0].startDate && dateRange[0].endDate
              ? `${moment(dateRange[0].startDate).format(
                  "MM/DD/YYYY"
                )} - ${moment(dateRange[0].endDate).format("MM/DD/YYYY")}`
              : "Select Date Range"}
          </Button>

          <CustomDateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onApply={handleApplyDateRange}
            onClear={() => {
              setDateRange([
                {
                  startDate: undefined,
                  endDate: undefined,
                  key: "selection",
                },
              ]);
              dispatch(
                fetchTransactionsStart(
                  0,
                  30,
                  currentTransaction || "",
                  "",
                  currentSort || "",
                  "",
                  ""
                )
              );
              setShowDatePicker(false);
            }}
            isOpen={showDatePicker}
            onClose={() => setShowDatePicker(false)}
          />
        </Box>
        <Button
          variant="outlined"
          size="large"
          onClick={handleClearFilters}
          sx={{
            width: "100%",
            borderColor: "secondary.light",
            backgroundColor: theme.palette.common.white,
            padding: "12px 10px",
            fontSize: "14px",
            fontWeight: 500,
            maxWidth: "129px",
            borderRadius: "32px",
            // color: "#AFB4B8",
            "&:hover": {
              borderColor: "secondary.light",
              backgroundColor: theme.palette.common.white,
            },
            "&:disabled": {
              backgroundColor: "backgroundColor.main",
              color: "#D6DADE",
            },
          }}
        >
          Clear All Filter
        </Button>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <StyledTableHead>
            <TableRow>
              <TableCell>NO.</TableCell>
              <TableCell align="left">STUDENT NAME</TableCell>
              <TableCell align="left">PACKAGE NAME</TableCell>
              <TableCell align="left">AMOUNT</TableCell>
              <TableCell align="left">DISCOUNT AMOUNT</TableCell>
              <TableCell align="left">TRANSACTION TYPE</TableCell>
              <TableCell align="left">METHOD</TableCell>
              <TableCell align="left">LOCATION</TableCell>
              <TableCell align="left" sx={{ width: 200 }}>
                DRIVING SCHOOL
              </TableCell>
              <TableCell align="left">Transaction Date</TableCell>
              {/* <TableCell align="left">REFUND</TableCell> */}
              <TableCell align="left">
                APPOINTMENT SCHEDULED (Lessons)
              </TableCell>
              <TableCell align="left" sx={{ width: 110 }}>
                Created By
              </TableCell>
              <TableCell align="left" sx={{ width: 110 }}>
                Created At
              </TableCell>
              <TableCell align="left">ACTION</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody
            sx={{
              backgroundColor: "primary.light",
            }}
          >
            {transactionList?.transactions &&
            transactionList?.transactions?.length > 0 ? (
              transactionList?.transactions?.map((row: any, index: number) => (
                <Fragment key={index}>
                  <StyledTableRow>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">
                      <Link
                        href={`/manage/profile/${row?.user?.id}`}
                        target="_blank"
                      >
                        {row?.user
                          ? `${row?.user?.first_name} ${row?.user?.last_name}`
                          : null}
                      </Link>
                    </TableCell>
                    <TableCell align="left">{row?.package?.name}</TableCell>
                    <TableCell align="left">
                      {row?.amount ? "$" + row?.amount : "-"}
                    </TableCell>
                    <TableCell align="left">
                      {row?.discount ? "$" + row?.discount : "-"}
                    </TableCell>
                    <TableCell align="left">{row?.method}</TableCell>
                    <TableCell align="left">{row?.method}</TableCell>
                    <TableCell align="left">
                      {handleLocationType(row?.location)}
                    </TableCell>
                    <TableCell align="left" sx={{ minWidth: 120 }}>
                      {row?.driving_school?.name ?? "-"}
                    </TableCell>
                    <TableCell align="left">
                      {parseDate(row?.date_charged)}
                    </TableCell>
                    {/* <TableCell align="left">
                      -
                    </TableCell> */}
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
                    <TableCell sx={{ minWidth: "100px" }}>
                      {formatDateToString(row?.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        startIcon={
                          <Image
                            src="/icons/edit.svg"
                            alt="edit"
                            height={14}
                            width={14}
                          />
                        }
                        sx={{
                          backgroundColor: "#F37736",
                          color: "white",
                          fontWeight: 700,
                          padding: "4px 12px",
                          fontSize: "12px",
                          minWidth: "auto",
                          "&:hover": {
                            backgroundColor: "#F37736",
                          },
                          "&:disabled": {
                            backgroundColor: "#f377368f",
                          },
                        }}
                        disabled={row.scheduled_lesson > 0}
                        onClick={() =>
                          router.push(`/manage/accounting/update/${row?.id}`)
                        }
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                </Fragment>
              ))
            ) : (
              <StyledTableRow>
                <TableCell component="th" scope="row" colSpan={13} align="left">
                  No transactions found
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 2,
          gap: 2,
        }}
      >
        <TablePagination
          component="div"
          count={transactionList?.total || 0} // Updated to use 'total' instead of 'total_count'
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 30, 50, 100]}
          sx={{
            borderBottom: "none",
            ".MuiTablePagination-toolbar": {
              paddingLeft: 0,
              paddingRight: 0,
            },
            ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
              {
                margin: 0,
              },
            ".MuiTablePagination-actions": {
              display: "none",
            },
          }}
        />
        <Pagination
          count={Math.ceil((transactionList?.total || 0) / rowsPerPage)} // Updated to use 'total'
          page={page + 1}
          onChange={(event, newPage) => handlePageChange(event, newPage - 1)}
          shape="rounded"
          size="small"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#6B7280",
              borderRadius: "9999px",
              "&.Mui-selected": {
                backgroundColor: "#6366F1",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#4F46E5",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(99, 102, 241, 0.04)",
              },
            },
          }}
        />
      </Box>
    </Fragment>
  );
};

export default Transactions;
