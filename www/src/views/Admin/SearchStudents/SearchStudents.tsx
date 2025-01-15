import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";

import { useRouter } from "next/router";
import QuickLinks from "./QuickLinks";
import StudentSearch from "./StudentSearch";
import {
  AddRounded as AddRoundedIcon,
  OpenInNewOutlined,
} from "@mui/icons-material";

const SearchStudents = () => {
  const router = useRouter();
  return (
    <Container
      maxWidth={false}
      sx={{
        py: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: {
            xs: "8px",
            lg: "32px",
          },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <StudentSearch />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              borderRadius: "32px",
            }}
            endIcon={<AddRoundedIcon />}
            onClick={() => router.push("/manage/add-new-student")}
          >
            Add New Student
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SearchStudents;
