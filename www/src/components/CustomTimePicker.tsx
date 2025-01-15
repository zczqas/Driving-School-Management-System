import React, { useState, useEffect } from "react";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import moment from "moment";

interface TimePickerProps {
  format: "12" | "24";
  value: string;
  onChange: (value: string) => void;
  minTime?: string;
  disabled?: boolean;
}

const generateTimeOptions = (format: "12" | "24") => {
  const times: string[] = [];
  const is24HourFormat = format === "24";
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, "0"); // Add leading zero to hour
      const formattedMinute = minute.toString().padStart(2, "0");
      if (is24HourFormat) {
        times.push(`${formattedHour}:${formattedMinute}`);
      } else {
        const period = hour < 12 ? "AM" : "PM";
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const formattedHour12 = hour12.toString().padStart(2, "0"); // Add leading zero to hour in 12-hour format
        times.push(`${formattedHour12}:${formattedMinute} ${period}`);
      }
    }
  }
  return times;
};

const CustomTimePicker: React.FC<TimePickerProps> = ({
  format,
  value,
  onChange,
  minTime,
  disabled = false,
}) => {
  const [selectedTime, setSelectedTime] = useState<string>(value || "");

  const timeOptions = generateTimeOptions(format);

  useEffect(() => {
    if (value) {
      setSelectedTime(value);
    }
  }, [value]);

  const handleTimeChange = (event: SelectChangeEvent<string>) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);
    onChange(newTime);
  };

  const filteredTimeOptions = minTime
    ? timeOptions.filter((time) => {
        const formatString = format === "24" ? "HH:mm" : "hh:mm A";
        const minTimeMoment = moment(minTime, formatString);
        const timeMoment = moment(time, formatString);
        return timeMoment.isSameOrAfter(minTimeMoment);
      })
    : timeOptions;

  // Scroll the selected time to the top of the options list
  const scrollToSelectedTime = (selectedTime: string) => {
    const selectedIndex = filteredTimeOptions.indexOf(selectedTime);
    if (selectedIndex > 0) {
      const optionsAboveSelected = filteredTimeOptions.slice(0, selectedIndex);
      const optionsBelowSelected = filteredTimeOptions.slice(selectedIndex);
      return [...optionsBelowSelected, ...optionsAboveSelected];
    }
    return filteredTimeOptions;
  };

  const sortedTimeOptions = scrollToSelectedTime(selectedTime);

  return (
    <Box sx={{ minWidth: 120 }}>
      <Select
        disabled={disabled}
        value={selectedTime}
        onChange={handleTimeChange}
        fullWidth
        displayEmpty
        sx={{
          borderRadius: "12px",
          borderColor: "rgba(194, 194, 194, 1)",
          color: "#000",
          width: "120px",
          height: "40px",
        }}
      >
        <MenuItem value="" disabled>
          Select time
        </MenuItem>
        {sortedTimeOptions.map((time) => (
          <MenuItem key={time} value={time}>
            {time}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default CustomTimePicker;
