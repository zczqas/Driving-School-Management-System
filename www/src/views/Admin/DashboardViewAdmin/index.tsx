import { Box, Container, Typography } from "@mui/material";
import React from "react";

import { useRouter } from "next/router";
import QuickLinks from "./QuickLinks";
import StudentSearch from "./StudentSearch";

const DashboardViewAdmin = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        m: 3,
      }}
    >
      <Box>
        <Typography variant="h3">
          Welcome to{" "}
          {localStorage.getItem("selectedSchool")
            ? localStorage.getItem("selectedSchool")
            : "Safety First"}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: {
            xs: "8px",
            lg: "32px",
          },
          flexWrap: "wrap",
          flexDirection: {
            xs: "column-reverse",
            lg: "row",
          },

        }}
      >
        <StudentSearch />
        <QuickLinks />
      </Box>
    </Container>
  );
};

export default DashboardViewAdmin;
