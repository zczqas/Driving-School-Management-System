import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  CircularProgress,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchVideoList } from "@/store/driverEd/driver.actions";
import IRootState from "@/store/interface";
import { useRouter } from "next/router";

const Video: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { videoList, videoListLoading, videoListError } = useAppSelector(
    (state: IRootState) => state.driver
  );

  useEffect(() => {
    dispatch(fetchVideoList());
  }, [dispatch]);

  if (videoListLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (videoListError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error fetching video list
        </Typography>
      </Box>
    );
  }

  const handleVideoClick = (videoId: number) => {
    router.push(`/manage/drivers-ed/videos/${videoId}`);
  };

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {videoList?.sections?.map((section: any, index: number) => (
        <Paper key={index} elevation={3} style={{ borderRadius: "12px" }}>
          <Box
            sx={{
              backgroundColor: "rgba(167, 140, 231, 0.2)",
              padding: "20px",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center" }} gutterBottom>
              {section.title}
            </Typography>
          </Box>
          <List>
            {section.videos.map((video: any, videoIndex: number) => (
              <React.Fragment key={videoIndex}>
                <ListItem
                  sx={{ padding: "12px", cursor: "pointer" }}
                  onClick={() => handleVideoClick(video.id)}
                >
                  <ListItemIcon>
                    <PlayCircleOutlineIcon />
                  </ListItemIcon>
                  <Typography
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {video.title}
                  </Typography>
                </ListItem>
                {videoIndex < section.videos.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default Video;
