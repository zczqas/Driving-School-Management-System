import React from "react";
import { Box, Typography, Button, Card } from "@mui/material";
import Image from "next/image";
import { openSans } from "@/themes/typography";
import { useRouter } from "next/router";

interface CourseItem {
  packageId: number;
  title: string;
  description: string;
  price: number;
  imageSrc: string;
}

const CourseCard: React.FC<CourseItem> = ({
  packageId,
  title,
  description,
  price,
  imageSrc,
}) => {
  const router = useRouter();

  return (
    <Card
      sx={{
        maxWidth: "1527px",
        width: "100%",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        fontFamily: openSans.style.fontFamily,
        overflow: "hidden",
        mb: 4,
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
            maxWidth: "1187px",
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
              src={imageSrc}
              alt={title}
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
              {title}
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
              {description}
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
            $ {price.toFixed(2)}
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
            onClick={() =>
              router.push(
                `/signup?purchasePackageId=${packageId}&purchasePackageTypeId=1`
              )
            }
          >
            Buy Now
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

const OnlineCourseList: React.FC = () => {
  const courses: CourseItem[] = [
    {
      packageId: 22,
      title: "Online course",
      description:
        "Our DMV-licensed traffic violator school (TVS) internet course is licensed for use statewide. The easy-to-read program is entertaining, informative, and loaded with colorful graphics, videos, cartoons, and jokes that will have you laughing while you learn. Best of all, you can take it from the comfort of your own home (or wherever you have internet access) and complete it in a few hours or over a few days—it's up to you! Register now and you'll be back on the road to safe driving in no time!",
      price: 29.99,
      imageSrc: "/assets/landing/sfds/online-course.webp",
    },
    {
      packageId: 21,
      title: "Booklet Course",
      description:
        "Our DMV-licensed traffic violator school (TVS) internet course is licensed for use statewide. The easy-to-read program is entertaining, informative, and loaded with colorful graphics, videos, cartoons, and jokes that will have you laughing while you learn. Best of all, you can take it from the comfort of your own home (or wherever you have internet access) and complete it in a few hours or over a few days—it's up to you! Register now and you'll be back on the road to safe driving in no time!",
      price: 59.99,
      imageSrc: "/assets/landing/sfds/booklet-course.webp",
    },
  ];

  return (
    <Box
      component={"section"}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingX: 8,
        pt: "100px",
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
          mb: "100px",
          lineHeight: "normal",
        }}
      >
        {`Our Courses`}
      </Typography>
      {courses.map((course, index) => (
        <CourseCard key={index} {...course} />
      ))}
    </Box>
  );
};

export default OnlineCourseList;
