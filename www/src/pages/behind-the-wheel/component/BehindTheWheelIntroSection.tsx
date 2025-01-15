import { openSans } from "@/themes/typography";
import { Box, Typography, Grid } from "@mui/material";
import React from "react";
import FeatureItem from "./FeatureItem";

const featureItems = [
  {
    title: "In Car Driver Training",
    description: [
      "Once the teen has completed Safety First's driver education course and passed the DMV permit test, he or she can start the Safety First In Car driver's training.",
      "This portion of driver's training is essential for teens to practice and apply their knowledge as a driver, and to get ready for the DMV drive test. Once scheduled, each teen will drive with a certified instructor who will educate him or her during In Car sessions.",
      "We have a diverse staff and can offer a female instructor upon request.",
    ],
    imageSrc: "/assets/landing/sfds/in-car-driver-training.webp",
    imageAlt: "Instructor and student in car",
  },
  {
    title: "Scheduling & Pick Up",
    description: [
      "In Car driver training is available for scheduling 7 days a week from 7am to 10pm. Each lesson is two hours long. We offer pick-up at your home, our office, or school (Call our office for school pick up locations 805-374-2393).",
      "Once your teen starts, try to schedule In Car lessons every month, except for the last lesson. Schedule the DMV drive test preparation lesson the same week as the DMV drive test. This will allow the final lesson to be fresh in the student's mind.",
    ],
    imageSrc: "/assets/landing/sfds/scheduling-and-pick-up.webp",
    imageAlt: "Student driving with instructor",
  },
];

const BehindTheWheelIntroSection = () => {
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
        {`Behind the Wheel Driver's Training for Teens`}
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
        Empowering teens with essential driving skills and confidence.
      </Typography>

      <Grid container spacing={4} sx={{ maxWidth: "1595px" }}>
        {featureItems?.map((item, index) => (
          <FeatureItem key={item?.title} {...item} imageLeft={index % 2 !== 0} />
        ))}
      </Grid>
    </Box>
  );
};

export default BehindTheWheelIntroSection;
