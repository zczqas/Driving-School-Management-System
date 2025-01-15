import React from "react";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import ReactPlayer from "react-player";

type Video = {
  id: number;
  title: string;
  url: string;
};

type Section = {
  section: string;
  videos: Video[];
};

const videos: Section[] = [
  {
    section: "Section 1.1",
    videos: [
      {
        id: 1,
        title: "Teen Driver - How to Get Your Provisional Instruction Permit",
        url: "https://www.youtube-nocookie.com/embed/JiHyPByJdrA?si=_ewCBYpmzByv1b8c",
      },
    ],
  },
  {
    section:
      "Section 1.2 Operating a motor vehicle is a serious responsibility",
    videos: [
      {
        id: 2,
        title: "California Distractive Driving and its Consequences by NHTSA",
        url: "https://www.youtube-nocookie.com/embed/t7911kgJJZc?si=_ewCBYpmzByv1b8c",
      },
      {
        id: 3,
        title: "Driver Distractions",
        url: "https://www.youtube-nocookie.com/embed/KUiFRR0AIWs?si=_ewCBYpmzByv1b8c",
      },
      {
        id: 4,
        title: "Proper Yielding Procedures",
        url: "https://www.youtube-nocookie.com/embed/MHubqaU6zQM?si=_ewCBYpmzByv1b8c",
      },
      {
        id: 5,
        title: "Defensive Driving Tips",
        url: "https://www.youtube-nocookie.com/embed/VEOJhoJG0Ns?si=_ewCBYpmzByv1b8c",
      },
      {
        id: 6,
        title: "How Best to Deal With Tailgating",
        url: "https://www.youtube-nocookie.com/embed/ZkAA2eRSOlU?si=_ewCBYpmzByv1b8c",
      },
    ],
  },
  {
    section: "Section 1.3 Common courtesy is a key to traffic safety",
    videos: [
      {
        id: 7,
        title: "California DMV Sharing the Road #10 Light Rail Vehicles",
        url: "https://www.youtube-nocookie.com/embed/OyK9kAR9zus?si=_ewCBYpmzByv1b8c",
      },
      {
        id: 8,
        title: "Left Hand Turn Demonstration",
        url: "https://www.youtube-nocookie.com/embed/ZaX9Q6nvUK8?si=_ewCBYpmzByv1b8c",
      },
    ],
  },
  {
    section: "Section 1.4 History of the automobile",
    videos: [
      {
        id: 9,
        title: "Nissan Zero Gravity Seat (Courtesy of www.NissanUSA.com. 2017)",
        url: "https://www.youtube-nocookie.com/embed/_0vWIl0_QgA?si=_ewCBYpmzByv1b8c",
      },
      {
        id: 10,
        title: "How ABS works (Courtesy of YouTube.com)",
        url: "https://www.youtube-nocookie.com/embed/hwwXukJaTlM?si=_ewCBYpmzByv1b8c",
      },
    ],
  },
  {
    section: "Section 1.5 DMV Tests",
    videos: [
      {
        id: 11,
        title:
          "California DMV Written Test 2023 (60 Questions with Explained Answers)",
        url: "https://www.youtube-nocookie.com/embed/HUKxi1rqRQM?si=_ewCBYpmzByv1b8c",
      },
      {
        id: 12,
        title:
          "California DMV Written Test 2023 ( 50 REAL TEST Questions and Answers )",
        url: "https://www.youtube-nocookie.com/embed/5rRHpNE87uk?si=_ewCBYpmzByv1b8c",
      },
      {
        id: 13,
        title: "California DMV Written Test / PRACTICE TEST 2023",
        url: "https://www.youtube-nocookie.com/embed/Zn4B9rMjoeM?si=_ewCBYpmzByv1b8c",
      },
      {
        id: 14,
        title:
          "California DMV Written Test 2022 (60 Questions with Explained Answers)",
        url: "https://www.youtube-nocookie.com/embed/FQKWCi6akV8?si=_ewCBYpmzByv1b8c",
      },
    ],
  },
];

const OptionalVideos: React.FC = () => {
  const router = useRouter();
  const id = router.query.slug;

  let video: Video | undefined;
  let sectionTitle: string | undefined;

  videos.forEach((section) => {
    const foundVideo = section.videos.find((v) => v.id === Number(id));
    if (foundVideo) {
      video = foundVideo;
      sectionTitle = section.section;
    }
  });

  if (!video) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="90vh"
      >
        <Typography variant="h6" color="error">
          Video not found
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          background: "#fff",
          flexDirection: "column",
          p: 3,
          gap: 3,
          borderRadius: 2,
          boxShadow: 3,
          width: "70%",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            color: "rgba(79, 91, 103, 1)",
          }}
          gutterBottom
        >
          {sectionTitle}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
          width="100%"
          p={3}
        >
          <ReactPlayer url={video.url} controls width="100%" height="100%" />
        </Box>
      </Box>
    </Container>
  );
};

export default OptionalVideos;
