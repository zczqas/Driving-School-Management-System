import { openSans } from "@/themes/typography";
import { constants } from "@/utils/constants";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const BusinessInfo = () => {
  return (
    <Box
      component={"section"}
      sx={{
        py: "60px",
        px: constants.paddingContainerX,
        backgroundColor: "#FAFBFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: "40px",
          justifyContent: {
            xs: "center",
            sm: "center",
          },
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {BusinessInfoData.map((item) => (
          <BusinessInfoCard
            key={item.id}
            title={item.title}
            desc={item.desc}
            image={item.image}
          />
        ))}
      </Box>
    </Box>
  );
};

export default BusinessInfo;

const BusinessInfoCard = ({
  title,
  desc,
  image,
}: {
  title: string;
  desc: string;
  image: string;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "300px",
        gap : "18px",
      }}
    >
      <Image src={image} alt={title} width={50} height={50} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <Typography
          variant="h4"
          sx={{
            color: "#000",
            fontFamily: openSans.style.fontFamily,
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            letterSpacing: "0.18px",
          }}
        >
          {title}
        </Typography>
        <Typography
          component={"p"}
          sx={{
            color: "#000",
            fontFamily: openSans.style.fontFamily,
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            letterSpacing: "0.14px",
          }}
        >
          {desc}
        </Typography>
      </Box>
    </Box>
  );
};

const BusinessInfoData = [
  {
    id: 1,
    title: "25+ Years in Business",
    image: "/assets/landing/InfoIcons/Car.svg",
    desc: "Serving the Ventura County community for over 25 years.",
  },
  {
    id: 2,
    title: "Experienced Instructors",
    image: "/assets/landing/InfoIcons/Experience.svg",
    desc: "Many of our instructors have been with us for over a decade.",
  },
  {
    id: 3,
    title: "Certified and Vetted",
    image: "/assets/landing/InfoIcons/Certified.svg",

    desc: "Trained, DMV tested, examined, and background checked.",
  },
  {
    id: 4,
    title: "Diverse Team",
    image: "/assets/landing/InfoIcons/DiverseTeam.svg",

    desc: "Both male and female instructors available.",
  },
  {
    id: 5,
    title: "Personalised Lessons",
    image: "/assets/landing/InfoIcons/PersonalizedLesson.svg",
    desc: "Customised for teens, adults, and individuals with disabilities",
  },
];
