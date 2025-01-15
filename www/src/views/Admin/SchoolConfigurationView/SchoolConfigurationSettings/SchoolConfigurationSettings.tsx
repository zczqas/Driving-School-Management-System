import React, { Fragment } from "react";
import SubHeader from "./components/SubHeader";
import { Box, Container, Paper, Typography } from "@mui/material";
import BasicSchoolSettings from "./BasicSchoolSettings";
import EmailSettings from "./EmailSettings";

const SchoolConfigurationSettingsView = () => {
  const tabs = [
    {
      id: 0,
      title: "Basic Settings",
      subTitle: "",
    },
    {
      id: 1,
      title: "Email Settings",
      subTitle: "",
    },
  ];
  const [tabValue, setTabValue] = React.useState(0);

  interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  return (
    <Fragment>
      <SubHeader
        title={tabs[tabValue].title}
        subTitle={tabs[tabValue].subTitle}
        tabValue={tabValue}
        handleChange={(event, newValue) => setTabValue(Number(newValue))}
        tabs={tabs}
      />

      <Container maxWidth={"lg"} component={Paper}>
        <Box
          sx={{
            py: 1,
            mt: 3,
          }}
        >
          <TabPanel value={tabValue} index={0}>
            <BasicSchoolSettings />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <EmailSettings />
          </TabPanel>
        </Box>
      </Container>
    </Fragment>
  );
};

export default SchoolConfigurationSettingsView;
