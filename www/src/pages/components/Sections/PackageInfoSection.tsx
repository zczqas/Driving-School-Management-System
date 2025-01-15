import { openSans } from "@/themes/typography";
import { constants } from "@/utils/constants";
import { Box, Typography } from "@mui/material";
import React from "react";
import PackageInfoCard from "./PackageInfoCard";

const PackageInfoSection = () => {
  return (
    <Box
      component={"section"}
      sx={{
        py: "60px",
        px: constants.paddingContainerX,
        backgroundColor: "#FAFBFF",
      }}
    >
      {" "}
      <Box sx={{ mb: "85px" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontFamily: openSans.style.fontFamily,
            fontSize: "18px",
            fontWeight: 400,
            mb: "8px",
          }}
        >
          What we offer
        </Typography>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontFamily: openSans.style.fontFamily,
            fontSize: "42px",
            fontWeight: 600,
          }}
        >
          Package information
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: "40px",
          alignItems: "center",
          justifyContent: { xs: "center", md: "space-between" },
        }}
      >
        <Box
          sx={{
            " & p": {
              fontFamily: openSans.style.fontFamily,
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "normal",
              letterSpacing: "0.16px",
              color: "#1E1E1E",
            },
            "& p>span": {
              fontWeight: 600,
            },
            flex: 1,
            maxWidth: "401px",
          }}
        >
          <Typography component={"p"}>
            We provide Behind-the-Wheel Driving courses for teens, adults, and
            seniors. Explore our package options here
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "66px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {packageData.map((item) => (
            <PackageInfoCard
              key={item.id}
              title={item.title}
              desc={item.desc}
              duration={item.duration}
              selectLink={item.selectLink}
              learnMoreLink={item.learnMoreLink}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PackageInfoSection;

const packageData = [
  {
    id: 1,
    title: "Basic Training Package",
    desc: "Gain confidence with essential surface street driving and general vehicle knowledge.",
    duration: "6 Hours",
    selectLink: "#",
    learnMoreLink: "#",
  },
  {
    id: 2,
    title: "Enhanced Skills Package",
    desc: "Advance your skills with comprehensive freeway and canyon driving lessons.",
    duration: "10 Hours",
    selectLink: "#",
    learnMoreLink: "#",
  },
  {
    id: 3,
    title: "Complete Driver's Package",
    desc: "Everything included, plus DMV test service, pre-test lesson, and use of our car. We ensure your child gets home safely.",
    duration: "14 Hours",
    selectLink: "#",
    learnMoreLink: "#",
  },
];
