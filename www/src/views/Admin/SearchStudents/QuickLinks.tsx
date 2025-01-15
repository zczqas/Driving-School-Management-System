import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import {
  AddRounded as AddRoundedIcon,
  OpenInNewOutlined,
} from "@mui/icons-material";

const QuickLinks = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        p: 2,
        flex : 1,
      }}
    //   maxWidth={"800px"}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Quick Links <OpenInNewOutlined sx={{ fontSize: "20px" }} />
      </Typography>

      <Grid container spacing={2} alignItems={"flex-start"}>
        {/* <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            endIcon={<AddRoundedIcon />}
            sx={{
              borderRadius: "32px",
              color: "#fff",
            }}
            color="primary"
            onClick={() => router.push("/manage/accounting/create")}
          >
            Add New Student Transaction
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: "32px",
            }}
            endIcon={<AddRoundedIcon />}
            onClick={() =>
              router.push("/manage/driver-training-and-education/create")
            }
          >
            Add an Appointment
          </Button>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuickLinks;
