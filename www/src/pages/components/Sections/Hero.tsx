import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import { constants } from "@/utils/constants";
import { openSans, gothicA1, dmSans } from "@/themes/typography";
import Image from "next/image";

const Hero = () => {
  return (
    <Box
      component={"section"}
      sx={{
        py: "60px",
      }}
    >
      <Grid container spacing={"90px"} sx={{ px: constants.paddingContainerX }}>
        <Grid item xs={12} md={7} sx={{ display: { xs: "none", md: "block" } }}>
          <Box sx={{ height: "755px", position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: "120px",
                left: "10px",
                height: "73px",
                width: "73px",
                animation: "rotate 20s linear infinite",
              }}
            >
              <style jsx global>{`
                @keyframes rotate {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}</style>

              <Image
                src="/assets/landing/circular-illustration.svg"
                height={73}
                width={73}
                alt="circle illustration"
              />
            </Box>
            <Image
              src="/assets/landing/sfds/hero-image.webp"
              priority
              fill
              alt="safety first driving school home page hero image"
              style={{
                objectFit: "contain",
              }}
            />
            <Button
              variant={"outlined"}
              sx={{
                position: "absolute",
                bottom: "40px",
                right: "10px",
                fontFamily: dmSans.style.fontFamily,
                fontSize: "20px",
                fontWeight: 500,
                color: constants.color.text.primary,
                width: "256px",
                borderRadius: "50px",
                height: "82px",
                border: "1.4px solid #F37636",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                  borderColor: constants.color.primary.light,
                },
              }}
              endIcon={
                <Image
                  src="/assets/landing/icons/arrow-right-up.svg"
                  height={32}
                  width={32}
                  alt="arrow right"
                />
              }
            >
              {" "}
              Explore Course
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: { xs: "0", md: "40px" },
            }}
          >
            <Button
              variant="contained"
              sx={{
                fontFamily: openSans.style.fontFamily,
                fontSize: "16px",
                fontWeight: 500,
                color: "#fff",
                width: "209px",
                borderRadius: "50px",
                height: "44px",
                background:
                  "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #5E38B5",
                mb: "30px",
              }}
            >
              {" "}
              Drive with Confidence
            </Button>
            <Typography
              variant="h1"
              sx={{
                fontFamily: gothicA1.style.fontFamily,
                fontSize: "82px",
                color: "#1E1E1E",
                "& > span": {
                  color: constants.color.primary.main,
                },
                mb: "40px",
              }}
            >
              Safely Develop Your Driving <span>Skills</span> Here
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: openSans.style.fontFamily,
                fontSize: "18px",
                letterSpacing: "0.18px",
                color: "#1E1E1E",
                maxWidth: "574px",
              }}
            >
              Learn from our team of certified experts and develop crucial
              driving skills designed to help you navigate the road with both
              ease and confidence!
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {/* Hero Illustration bottom */}
      <Box sx={{ height: "81px", display: "flex", justifyContent: "flex-end" }}>
        <Image
          src="/assets/landing/driving-school-pattern-1.svg"
          height={81}
          width={643}
          alt="hero illustration bottom"
        />
      </Box>
    </Box>
  );
};

export default Hero;
