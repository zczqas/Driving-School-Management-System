import React, { useState } from "react";
import { Box, Container, Divider, Tab, Tabs, Typography } from "@mui/material";
import TabPanel from "./components/TabPanel";
import { lato } from "@/themes/typography";
import Units from "./components/Units";
import Video from "./components/Video";
import Charts from "./components/Charts";

const DriversEd: React.FC = () => {
  const [value, setValue] = useState<string>("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          background: "#fff",
          flexDirection: "column",
          height: "100%",
          minHeight: "90vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 18px",
          }}
        >
          <Typography
            id="alert-dialog-title"
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              fontFamily: lato.style.fontFamily,
            }}
          >
            Online Driver Ed
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: "14px 18px" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="styled tabs"
            >
              <Tab label="Units" value="1" />
              <Tab label="Optional Online Video Viewing" value="2" />
              <Tab label="Charts and Tables" value="3" />
            </Tabs>
          </Box>
          <Box width={"70%"}>
            <TabPanel value={value} index="1">
              <Units />
            </TabPanel>
            <TabPanel value={value} index="2">
              <Video />
            </TabPanel>
            <TabPanel value={value} index="3">
              <Charts />
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DriversEd;
