import React, { useCallback } from "react";
import SalesReportTable from "./components/SalesReportTable";
import SubHeader from "./components/SubHeader";
import { Container } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchTransactionsStart } from "@/store/account/account.actions";
import { fetchDrivingSchools } from "@/store/masterlist/masterlist.actions";
import IRootState from "@/store/interface";
import moment from "moment";
import { debounce } from "lodash";

// ==============================|| SALES REPORT VIEW ||============================== //

const SalesReportView = () => {
  const dispatch = useAppDispatch();
  const { transactionList, transactionListLoading } = useAppSelector(
    (state: IRootState) => state.account
  );
  const { drivingSchoolList, drivingSchoolListLoading } = useAppSelector(
    (state: IRootState) => state?.masterlist?.drivingSchool
  );

  // State management
  const [currentTransaction, setCurrentTransaction] = React.useState<string>("");
  const [currentSort, setCurrentSort] = React.useState<string>("CREATED_AT");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [currentDrivingSchool, setCurrentDrivingSchool] = React.useState<string>("");
  const [dateRange, setDateRange] = React.useState<
    {
      startDate: Date | undefined;
      endDate: Date | undefined;
      key: string;
    }[]
  >([
    {
      startDate: moment().subtract(1, 'month').toDate(),
      endDate: moment().toDate(),
      key: "selection",
    },
  ]);

  // Fetch data with filters
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFilteredData = useCallback(
    debounce((
      name: string, 
      drivingSchoolId: string, 
      pageNum: number, 
      rowsPerPageNum: number,
      dateStart?: string,
      dateEnd?: string
    ) => {
      dispatch(
        fetchTransactionsStart(
          pageNum * rowsPerPageNum,
          rowsPerPageNum,
          name,
          "",
          currentSort || "",
          dateStart || "",
          dateEnd || "",
          drivingSchoolId
        )
      );
    }, 300),
    [dispatch, currentSort]
  );

  // Handle filters
  const handleTransactionSearch = (name: string) => {
    setCurrentTransaction(name);
    setPage(0);
    const startDate = dateRange[0].startDate
      ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
      : "";
    const endDate = dateRange[0].endDate
      ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
      : "";

    fetchFilteredData(
      name,
      currentDrivingSchool,
      0,
      rowsPerPage,
      startDate,
      endDate
    );
  };

  const handleDrivingSchoolChange = (schoolId: string) => {
    setCurrentDrivingSchool(schoolId);
    setPage(0);
    const startDate = dateRange[0].startDate
      ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
      : "";
    const endDate = dateRange[0].endDate
      ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
      : "";

    fetchFilteredData(
      currentTransaction,
      schoolId,
      0,
      rowsPerPage,
      startDate,
      endDate
    );
  };

  const handleDateRangeChange = (newDateRange: typeof dateRange) => {
    setDateRange(newDateRange);
  };

  const handleApplyDateRange = () => {
    const startDate = dateRange[0].startDate
      ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
      : "";
    const endDate = dateRange[0].endDate
      ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
      : "";

    setPage(0);
    fetchFilteredData(
      currentTransaction,
      currentDrivingSchool,
      0,
      rowsPerPage,
      startDate,
      endDate
    );
  };

  const handleClearFilters = () => {
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
    setPage(0);
    dispatch(fetchTransactionsStart(0, rowsPerPage));
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const startDate = dateRange[0].startDate
      ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
      : "";
    const endDate = dateRange[0].endDate
      ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
      : "";

    fetchFilteredData(
      currentTransaction,
      currentDrivingSchool,
      newPage,
      rowsPerPage,
      startDate,
      endDate
    );
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    const startDate = dateRange[0].startDate
      ? moment(dateRange[0].startDate).format("YYYY-MM-DD")
      : "";
    const endDate = dateRange[0].endDate
      ? moment(dateRange[0].endDate).format("YYYY-MM-DD")
      : "";

    fetchFilteredData(
      currentTransaction,
      currentDrivingSchool,
      0,
      newRowsPerPage,
      startDate,
      endDate
    );
  };

  // Initial data fetch with past month's date range and 10 rows per page
  React.useEffect(() => {
    const startDate = moment().subtract(1, 'month').format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
    
    dispatch(
      fetchTransactionsStart(
        0,
        rowsPerPage,
        currentTransaction,
        "",
        currentSort,
        startDate,
        endDate,
        currentDrivingSchool
      )
    );
    dispatch(fetchDrivingSchools(0, 25));
  }, [dispatch, rowsPerPage, currentTransaction, currentSort, currentDrivingSchool]);

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    if (!transactionList?.transactions) {
      return {
        totalSalesAmount: 0,
        totalTransactions: 0,
        totalUniqueStudents: 0,
      };
    }

    const transactions = transactionList.transactions;

    // Calculate total sales
    const totalSales = transactions.reduce((sum: number, transaction: any) => {
      return sum + (transaction.amount || 0);
    }, 0);

    // Count total transactions
    const totalTransactions = transactions.length;

    // Count unique students (using Set to remove duplicates)
    const uniqueStudents = new Set(
      transactions
        .map((transaction: any) => transaction.user?.id)
        .filter((id: any) => id !== undefined)
    );
    const totalUniqueStudents = uniqueStudents.size;

    return {
      totalSalesAmount: totalSales,
      totalTransactions,
      totalUniqueStudents,
    };
  }, [transactionList?.transactions]);

  return (
    <Container maxWidth={false}>
      <SubHeader 
        totalSalesAmount={summaryMetrics.totalSalesAmount}
        totalTransactions={summaryMetrics.totalTransactions}
        totalUniqueStudents={summaryMetrics.totalUniqueStudents}
        currentTransaction={currentTransaction}
        currentDrivingSchool={currentDrivingSchool}
        dateRange={dateRange}
        drivingSchoolList={drivingSchoolList}
        onTransactionSearch={handleTransactionSearch}
        onDrivingSchoolChange={handleDrivingSchoolChange}
        onDateRangeChange={handleDateRangeChange}
        onApplyDateRange={handleApplyDateRange}
        onClearFilters={handleClearFilters}
      />
      <SalesReportTable 
        transactions={transactionList?.transactions}
        loading={transactionListLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={transactionList?.total}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Container>
  );
};

export default SalesReportView;
