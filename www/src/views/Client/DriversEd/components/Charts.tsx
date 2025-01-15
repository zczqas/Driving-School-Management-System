import React, { useEffect } from "react";
import {
  Box,
  Paper,
  List,
  ListItem,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchChartList } from "@/store/driverEd/driver.actions";
import IRootState from "@/store/interface";

const Charts: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { chartList, chartListLoading } = useAppSelector(
    (state: IRootState) => state.driver
  );

  useEffect(() => {
    dispatch(fetchChartList());
  }, [dispatch]);

  const handleTitleClick = (sectionId: number) => {
    router.push(`/manage/drivers-ed/charts/${sectionId}`);
  };

  if (chartListLoading) {
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

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ borderRadius: "10px" }}>
        <List>
          {chartList?.sections?.map((chart: any, index: number) => (
            <React.Fragment key={chart.id}>
              <ListItem
                sx={{
                  padding: "15px",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={() => handleTitleClick(chart.id)}
              >
                <Typography variant="body1">
                  {chart.title}: {chart.name}
                </Typography>
              </ListItem>
              {index < chartList?.sections?.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Charts;
