import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Container,
  Button,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchChartById } from "@/store/driverEd/driver.actions";
import IRootState from "@/store/interface";

const Chart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { chartById, chartByIdLoading } = useAppSelector(
    (state: IRootState) => state.driver
  );

  const chartId = router.query.slug as string;

  useEffect(() => {
    if (chartId) {
      dispatch(fetchChartById(chartId));
    }
  }, [chartId, dispatch]);

  if (chartByIdLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleBackClick = () => {
    router.back();
  };

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          background: "#fff",
          flexDirection: "column",
          p: 3,
          gap: 3,
          borderRadius: 2,
          boxShadow: 3,
          width: "70%",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            color: "rgba(79, 91, 103, 1)",
          }}
          gutterBottom
        >
          {chartById.title}: {chartById.name}
        </Typography>
        <Box sx={{ borderRadius: "10px", padding: "20px", width: "100%" }}>
          {chartById.images && chartById.images.length > 0 ? (
            <Grid container spacing={2}>
              {chartById.images.map((image: any, index: number) => (
                <Grid item xs={3} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Image
                      src={"https://sfds.usualsmart.com/" + `${image.url}`}
                      alt={`Figure ${index + 1}`}
                      width={100}
                      height={100}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                color: "rgba(79, 91, 103, 1)",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              No image found
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "70%",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: "20px", width: "120px", padding: "10px" }}
          onClick={handleBackClick}
        >
          Back
        </Button>
      </Box>
    </Container>
  );
};

export default Chart;
