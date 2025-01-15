import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { openSans } from "@/themes/typography";
import BlogCard from "./BlogCard";

const BlogsSection: React.FC = () => {
  const blogPosts = [
    {
      image: "/assets/blog/driver-laptop-image.webp",
      author: "Phoenix Baker",
      date: "21 Feb 2024",
      time: "3:31 PM",
      title:
        "Take Driver Training Courses Online To Fulfill California State Requirement for Drivers Education",
      content:
        "Going to a classroom, daily, without failing in attendance is too old school. Moreover, it's hard to find time in our busy lives to go all the way to a driving school to learn and understand how to drive better. Thanks to the technological reforms happening at a quickened pace, you can now take driver training courses online",
      readMoreLink: "#",
    },
    {
      image: "/assets/blog/car-dashboard-image.webp",
      author: "Phoenix Baker",
      date: "22 Jan 2024",
      time: "2:00 PM",
      title: "When the visibility is low - DRIVE SLOW",
      content:
        "There is no better way of escaping the hustles of city life than going for a long drive in the countryside. In spite of rough terrains and poor vehicle maintenance, long drives can refresh any individual's mood and provide a clear perspective. However, sudden downpours, thick fog, smoke and blowing dust often make it extremely hard to cherish those little moments",
      readMoreLink: "#",
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
        pt: "40px",
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
          lineHeight: "normal",
          mb: "16px",
        }}
      >
        {`Blog`}
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
          mb: "100px",
        }}
      >
        Empowering teens with essential driving skills and confidence.
      </Typography>

      {/* Blogs Container */}
      <Box sx={{ maxWidth: "1211px", width: "100%" }}>
        <Grid container spacing={4} justifyContent="center">
          {blogPosts.map((post, index) => (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={6}
              sx={{ maxWidth: "500px" }}
            >
              <BlogCard {...post} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default BlogsSection;
