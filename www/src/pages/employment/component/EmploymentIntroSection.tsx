import { openSans } from "@/themes/typography";
import { Box, Typography, Grid } from "@mui/material";
import React from "react";

const EmploymentIntroSection = () => {
  return (
    <Box
      component={"section"}
      sx={{
        pt: "80px",
        px: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ====== Title ======= */}
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontFamily: openSans.style.fontFamily,
          fontSize: "42px",
          fontWeight: 600,
          mb: "16px",
          lineHeight: "normal",
        }}
      >
        {`Employment Opportunity`}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          fontFamily: openSans.style.fontFamily,
          fontSize: "18px",
          fontWeight: 400,
          color: "#1E1E1E",
          maxWidth: "1268px",
          letterSpacing: "0.18px",
          mb: "90px",
        }}
      >
        Join the safety first driving school team
      </Typography>

     
    </Box>
  );
};

export default EmploymentIntroSection;
