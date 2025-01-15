import React from "react";
import { DateRange } from "react-date-range";
import moment from "moment";
import enGB from 'date-fns/locale/en-GB';
import {
  Box,
  Button,
  Fade,
  Tooltip,
  TextField,
  MenuItem,
  Menu,
} from "@mui/material";
import Image from "next/image";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { datePickerCustomStyles } from "./styles";

// Configure moment to use Monday as first day of week
moment.updateLocale('en', {
  week: {
    dow: 1, // Monday is the first day of the week
  }
});

interface DateRangeType {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}

interface CustomDateRangePickerProps {
  dateRange: DateRangeType[];
  onDateRangeChange: (range: DateRangeType[]) => void;
  onApply: () => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  dateRange,
  onDateRangeChange,
  onApply,
  onClear,
  isOpen,
  onClose,
}) => {
  const [tempDateRange, setTempDateRange] = React.useState(dateRange);
  const [isCustomRange, setIsCustomRange] = React.useState(false);
  const [customInputs, setCustomInputs] = React.useState({
    start: tempDateRange[0]?.startDate
      ? moment(tempDateRange[0].startDate).format("YYYY-MM-DD")
      : "",
    end: tempDateRange[0]?.endDate
      ? moment(tempDateRange[0].endDate).format("YYYY-MM-DD")
      : "",
  });

  React.useEffect(() => {
    setTempDateRange(dateRange);
  }, [dateRange]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const datePicker = document.getElementById("date-picker-container");
      if (datePicker && !datePicker.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDateRangeChange = (ranges: any) => {
    if (ranges.selection.endDate < ranges.selection.startDate) {
      ranges.selection.endDate = ranges.selection.startDate;
    }
    
    setTempDateRange([ranges.selection]);
    onDateRangeChange([ranges.selection]);
    setCustomInputs({
      start: moment(ranges.selection.startDate).format("YYYY-MM-DD"),
      end: moment(ranges.selection.endDate).format("YYYY-MM-DD"),
    });
  };

  const quickSelections = [
    { days: 0, label: "Today" },
    { days: 1, label: "Yesterday" },
    { days: 7, label: "Last 7 days" },
    { days: 28, label: "Last 28 days" },
    { days: 30, label: "Last 30 days" },
    { days: 90, label: "Last 90 days" },
    { days: 365, label: "Last 12 months" },
    { label: "Custom", value: "custom" },
  ];

  const handleQuickSelect = (selection: {
    days?: number;
    value?: string;
    label: string;
  }) => {
    if (selection.value === "custom") {
      setIsCustomRange(true);
      return;
    }

    const endDate = new Date();
    const startDate = new Date();
    if (selection.days === 0) {
      // Today
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate.setDate(startDate.getDate() - (selection.days || 0));
    }

    setIsCustomRange(false);
    const newRange = [
      {
        startDate,
        endDate,
        key: "selection",
      },
    ];
    setTempDateRange(newRange);
    onDateRangeChange(newRange);
  };

  const handleCustomInputChange = (type: "start" | "end", value: string) => {
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
      const newRange = [...tempDateRange];
      
      if (type === "start") {
        if (newRange[0].endDate && dateValue > newRange[0].endDate) {
          newRange[0] = {
            ...newRange[0],
            startDate: dateValue,
            endDate: dateValue,
          };
          setCustomInputs(prev => ({
            ...prev,
            start: value,
            end: value,
          }));
        } else {
          newRange[0] = {
            ...newRange[0],
            startDate: dateValue,
          };
          setCustomInputs(prev => ({
            ...prev,
            start: value,
          }));
        }
      } else {
        if (newRange[0].startDate && dateValue < newRange[0].startDate) {
          dateValue.setTime(newRange[0].startDate.getTime());
          setCustomInputs(prev => ({
            ...prev,
            end: moment(dateValue).format("YYYY-MM-DD"),
          }));
        } else {
          setCustomInputs(prev => ({
            ...prev,
            end: value,
          }));
        }
        newRange[0] = {
          ...newRange[0],
          endDate: dateValue,
        };
      }
      
      setTempDateRange(newRange);
      onDateRangeChange(newRange);
    }
  };

  const handleClear = () => {
    const clearedRange = [
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ];
    setTempDateRange(clearedRange);
    onDateRangeChange(clearedRange);
    onClear();
  };

  return (
    <Fade in={isOpen}>
      <Box
        id="date-picker-container"
        sx={{
          position: "absolute",
          zIndex: 2,
          top: "100%",
          left: 0,
          mt: 1,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid #E0E0E0",
          ...datePickerCustomStyles,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            padding: "16px",
            borderBottom: "1px solid #E0E0E0",
            flexWrap: "wrap",
          }}
        >
          {quickSelections.map((selection) => (
            <Tooltip
              key={selection.label}
              title={
                selection.days
                  ? `Select last ${selection.days} days`
                  : selection.label
              }
            >
              <Button
                onClick={() => handleQuickSelect(selection)}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: "20px",
                  borderColor: "secondary.light",
                  color: "text.primary",
                  padding: "4px 12px",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "secondary.main",
                    backgroundColor: "rgba(243, 119, 54, 0.04)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {selection.label}
              </Button>
            </Tooltip>
          ))}
        </Box>

        {tempDateRange[0].startDate && tempDateRange[0].endDate && (
          <Box
            sx={{
              padding: "12px 16px",
              borderBottom: "1px solid #E0E0E0",
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            Selected: {moment(tempDateRange[0].startDate).format("MMM D, YYYY")}{" "}
            - {moment(tempDateRange[0].endDate).format("MMM D, YYYY")}
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <TextField
            label="From"
            type="date"
            value={customInputs.start}
            onChange={(e) => handleCustomInputChange("start", e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{
              width: "160px",
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            label="To"
            type="date"
            value={customInputs.end}
            onChange={(e) => handleCustomInputChange("end", e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{
              width: "160px",
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        <DateRange
          ranges={tempDateRange}
          onChange={handleDateRangeChange}
          months={2}
          direction="horizontal"
          moveRangeOnFirstSelection={false}
          rangeColors={["#F37736"]}
          showMonthAndYearPickers={true}
          showDateDisplay={false}
          editableDateInputs={true}
          monthDisplayFormat="MMMM yyyy"
          weekdayDisplayFormat="EEEEE"
          dayDisplayFormat="d"
          locale={enGB}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            padding: "16px",
            borderTop: "1px solid #E0E0E0",
          }}
        >
          <Button
            onClick={handleClear}
            variant="outlined"
            sx={{
              color: "text.secondary",
              borderColor: "divider",
              borderRadius: "32px",
              padding: "8px 24px",
              "&:hover": {
                borderColor: "secondary.light",
                backgroundColor: "transparent",
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Clear Dates
          </Button>
          <Button
            onClick={() => onApply()}
            variant="contained"
            sx={{
              backgroundColor: "#F37736",
              color: "white",
              borderRadius: "32px",
              padding: "8px 24px",
              "&:hover": {
                backgroundColor: "#F37736",
                opacity: 0.9,
              },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default CustomDateRangePicker;
