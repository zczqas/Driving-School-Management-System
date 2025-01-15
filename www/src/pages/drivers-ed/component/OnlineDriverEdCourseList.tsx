import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import Image from "next/image";
import { openSans } from "@/themes/typography";
import { useRouter } from "next/router";

const OnlineDriverEdCourseList = () => {
  const router = useRouter();

  return (
    <Box
      component={"section"}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingX: 8,
        pt: "100px",
      }}
    >
      <Card
        sx={{
          maxWidth: "1527px",
          width: "100%",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          fontFamily: openSans.style.fontFamily,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            py: "40px",
            px: "20px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              maxWidth: "1000px",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Box
              sx={{
                height: "169px",
                width: "273px",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src="/assets/landing/sfds/driver-ed-banner.webp"
                alt="Driver Education"
                fill
                style={{
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#000",
                  fontFamily: openSans.style.fontFamily,
                  fontSize: "28px",
                  letterSpacing: "0.28px",
                  lineHeight: "normal",
                }}
              >
                DMV approved online driver education.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: "#657181",
                  lineHeight: "normal",
                  letterSpacing: "0.18px",
                  fontFamily: openSans.style.fontFamily,
                  fontSize: "18px",
                }}
              >
                {`  Our online driver's education system consists of ten easy to
              follow sections that build your knowledge from fundamentals of
              driving to advanced rules of the road. No classroom attendance is
              required.`}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: "34px",
                flex: "1",
                pt: 4,
                fontFamily: openSans.style.fontFamily,
                lineHeight: "normal",
                letterSpacing: "0.34px",
              }}
            >
              $ 59.00
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#F37636",
                "&:hover": {
                  backgroundColor: "#E56525",
                },
                textTransform: "none",
                paddingY: "14px",
                fontWeight: 600,
                mt: "auto",
                borderRadius: "30px",
                fontSize: "16px",
              }}
              onClick={() => router.push("/signup?purchasePackageId=15&purchasePackageTypeId=1")}
            >
              Buy Now
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default OnlineDriverEdCourseList;
