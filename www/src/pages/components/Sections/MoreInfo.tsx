import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { constants } from "@/utils/constants";
import { openSans } from "@/themes/typography";
import MoreInfoCard from "./MoreInfoCard";
import Image from "next/image";

const MoreInfo = () => {
  return (
    <Box
      component={"section"}
      sx={{
        py: "40px",
        px: constants.paddingContainerX,
        backgroundColor: constants.color.primary.main,
      }}
    >
      <Box sx={{ mb: "85px" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: "#fff",
            fontFamily: openSans.style.fontFamily,
            fontSize: "18px",
            fontWeight: 400,
            mb: "8px",
          }}
        >
          We make the process easy{" "}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            color: "#FAFBFF",
            fontFamily: openSans.style.fontFamily,
            fontSize: "42px",
            fontWeight: 600,
          }}
        >
          Want more info?
        </Typography>
      </Box>
      <Grid container spacing={"60px"}>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              color: "#fff",
              fontFamily: openSans.style.fontFamily,
              maxWidth: "562px",
              position: "relative",
              pt: "40px",
              height: "500px",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "32px", md: "56px" },
                fontWeight: 700,
                lineHeight: { xs: "40px", md: "70px" },
              }}
            >
              {`Tell us who you are and We'll tell you what you need?`}
            </Typography>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: { xs: 0, md: -30 },
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                src={"/assets/landing/moreinfo-back-ills.svg"}
                layout="fill"
                objectFit="contain"
                alt="More info image"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={7} container spacing={"60px"}>
          {moreInfoCards.map((card) => (
            <Grid item xs={12} md={4} key={card.id}>
              <MoreInfoCard
                title={card.title}
                link={card.link}
                image={card.image}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MoreInfo;

const moreInfoCards = [
  {
    id: 1,
    title: "Parents of New Drivers",
    link: "#",
    image: "/assets/landing/parents-of-new-driver.png",
  },
  {
    id: 2,
    title: "Teen Student",
    link: "#",
    image: "/assets/landing/teen-student.png",
  },
  {
    id: 3,
    title: "Adult Student",
    link: "#",
    image: "/assets/landing/adult-student.png",
  },
];
