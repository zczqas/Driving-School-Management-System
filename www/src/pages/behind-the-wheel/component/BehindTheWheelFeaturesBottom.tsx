import { Box, Grid } from "@mui/material";
import React from "react";
import FeatureItem from "./FeatureItem";

const BehindTheWheelFeaturesBottom = () => {
  const featureItems = [
    {
      title: "Our Vehicles",
      description: [
        "Our instructors use newer Toyota Priuses. All of our vehicles are equipped with a passenger side brake for the instructor so they can stop the vehicle if needed. Our airbags and other safety features help keep our students and instructors safe.",
      ],
      imageSrc: "/assets/landing/sfds/our-vehicles.webp",
      imageAlt: "Toyota Prius on the road",
    },
    {
      title: "Optimal and Safe Experience",
      description: [
        "While we strive to make everyone happy, sometimes it can take a while to schedule your driver training lesson. Safety First is very selective about instructors we hire, and we don't skim through lessons or take shortcuts. Depending on your location and availability, and the location and availability of your instructor, there are occasions when it can be several weeks before a driver training lesson can be scheduled.",
        "Remember, you have to hold the permit for at least six months before you can take the drive test, so if you cannot get on the schedule for a few weeks, it won't affect the date you can get your driver's license.",
      ],
      imageSrc: "/assets/landing/sfds/optimal-safe-experience.webp",
      imageAlt: "Smiling instructor in a car",
    },
  ];

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
      <Grid container spacing={4} sx={{ maxWidth: "1595px" }}>
        {featureItems?.map((item, index) => (
          <FeatureItem key={item?.title} {...item} imageLeft={index % 2 === 0} />
        ))}
      </Grid>
    </Box>
  );
};

export default BehindTheWheelFeaturesBottom;
