import React from "react";
import { Box, Stack, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, InputAdornment, Paper, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import CustomDateRangePicker from "@/components/CustomDateRangePicker";
import { useTheme } from "@mui/material/styles";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupIcon from '@mui/icons-material/Group';

interface SubHeaderProps {
  totalSalesAmount: number;
  totalTransactions: number;
  totalUniqueStudents: number;
  currentTransaction: string;
  currentDrivingSchool: string;
  dateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    key: string;
  }[];
  drivingSchoolList: any[];
  onTransactionSearch: (value: string) => void;
  onDrivingSchoolChange: (value: string) => void;
  onDateRangeChange: (dateRange: any) => void;
  onApplyDateRange: () => void;
  onClearFilters: () => void;
}

const SubHeader: React.FC<SubHeaderProps> = ({
  totalSalesAmount,
  totalTransactions,
  totalUniqueStudents,
  currentTransaction,
  currentDrivingSchool,
  dateRange,
  drivingSchoolList,
  onTransactionSearch,
  onDrivingSchoolChange,
  onDateRangeChange,
  onApplyDateRange,
  onClearFilters,
}) => {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  // Summary cards data
  const summaryCards = [
    {
      title: "Total Sales",
      value: `$${totalSalesAmount?.toFixed(2) || "0.00"}`,
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#4CAF50" }} />,
      bgColor: "rgba(76, 175, 80, 0.1)",
    },
    {
      title: "Total Transactions",
      value: totalTransactions?.toString() || "0",
      icon: <ReceiptLongIcon sx={{ fontSize: 40, color: "#2196F3" }} />,
      bgColor: "rgba(33, 150, 243, 0.1)",
    },
    {
      title: "Total Students",
      value: totalUniqueStudents?.toString() || "0",
      icon: <GroupIcon sx={{ fontSize: 40, color: "#9C27B0" }} />,
      bgColor: "rgba(156, 39, 176, 0.1)",
    },
  ];

  return (
    <Stack spacing={4} width="100%" py={4}>
      {/* Summary Cards */}
      <Grid container spacing={3}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: card.bgColor,
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.12)',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="subtitle2" fontWeight={500}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={600} mt={1}>
                    {card.value}
                  </Typography>
                </Box>
                {card.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filters Section */}
      <Box display="flex" gap="12px" alignItems="center" flexWrap="wrap">
        <TextField
          value={currentTransaction}
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
          onChange={(e) => onTransactionSearch(e.target.value)}
        />

        <FormControl sx={{ minWidth: "200px" }}>
          <InputLabel id="filter-by-driving-school-label">
            Filter by Driving School
          </InputLabel>
          <Select
            labelId="filter-by-driving-school-label"
            value={currentDrivingSchool}
            label="Filter by Driving School"
            onChange={(e) => onDrivingSchoolChange(e.target.value)}
            sx={{
              borderRadius: "32px",
              backgroundColor: theme.palette.common.white,
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
            }}
          >
            {dateRange[0].startDate && dateRange[0].endDate
              ? `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`
              : "Select Date Range"}
          </Button>

          <CustomDateRangePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            onApply={onApplyDateRange}
            onClear={() => {
              onDateRangeChange([
                {
                  startDate: undefined,
                  endDate: undefined,
                  key: "selection",
                },
              ]);
              onApplyDateRange();
            }}
            isOpen={showDatePicker}
            onClose={() => setShowDatePicker(false)}
          />
        </Box>

        <Button
          variant="outlined"
          onClick={onClearFilters}
          sx={{
            borderRadius: "32px",
            minWidth: "129px",
          }}
        >
          Clear All Filter
        </Button>
      </Box>
    </Stack>
  );
};

export default SubHeader;
