import { Box, Grid, Typography } from "@mui/material";
import React from "react";

const ScheduleInfo = ({ name }: any) => {
  return (
    <Box>
      <Grid container spacing={2} sx={{ paddingTop: 1, px: 3 }}>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography sx={{ fontWeight: 400, fontSize: "16px" }}>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "rgba(79, 91, 103, 1)",
                }}
              >
                Instructor:
              </span>{" "}
              {name}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScheduleInfo;
