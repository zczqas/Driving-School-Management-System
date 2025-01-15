import { Box, Typography, Grid, Paper } from "@mui/material";
import React from "react";

const learningTopics = [
  "Fundamentals of driving",
  "DMV drive test preparation",
  "Freeways",
  "Canyons",
  "Defensive driving",
  "Accident avoidance techniques and thought processes",
  "Evasive maneuvers",
  "Emergency procedures",
];

const TeenLearnSection = () => {
  return (
    <Box
      component={"section"}
      sx={{
        px: "30px",
        fontFamily: "Open Sans, sans-serif",
      }}
    >
      <Box
        sx={{
          py: "93px",
          bgcolor: "#FAF4F5",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "1740px",
          px: "35px",
          mx: "auto",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontSize: "28px",
            fontWeight: 600,
            lineHeight: "normal",
            letterSpacing: "-0.28px",
          }}
        >
          What the Teen Will Learn
        </Typography>
        <Grid
          container
          rowSpacing={"50px"}
          columnSpacing={"50px"}
          sx={{ mt: "10px" }}
        >
          {learningTopics.map((topic, index) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  minHeight: "80px",
                  height: "100%",
                  p: "15px 50px",
                  textAlign: "center",
                  bgcolor: "white",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  maxWidth: "380px",
                  width: "100%",
                  fontSize: "18px",
                  boxShadow: "0px 4px 14px 0px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Typography variant="body1" sx={{ fontSize: "18px" }}>
                  {topic}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TeenLearnSection;
