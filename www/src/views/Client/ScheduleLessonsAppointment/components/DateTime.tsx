import React from "react";
import { Box, Typography } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import PublicIcon from "@mui/icons-material/Public";
import moment, { Moment } from "moment";

const DateTime = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Moment | null;
  setSelectedDate: (date: Moment | null) => void;
}) => {
  const getCaliforniaTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const californiaTime = new Intl.DateTimeFormat("en-US", options).format(
      new Date()
    );
    return californiaTime;
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Typography sx={{ fontWeight: 600, fontSize: "24px" }}>
        Select the date & time
      </Typography>

      <Box
        sx={{
          p: 1,
        }}
      >
        <DateCalendar
          disablePast
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
        />
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
          Time zone
        </Typography>
        <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PublicIcon />
          Pacific Time (California): {getCaliforniaTime()}
        </Typography>
      </Box>
    </Box>
  );
};

export default DateTime;
