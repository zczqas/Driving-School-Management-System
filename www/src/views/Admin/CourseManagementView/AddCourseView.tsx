import { Backdrop, Box, CircularProgress, Tab, Tabs } from "@mui/material";
import { Fragment, useState } from "react";
import CreateCourseTab from "./components/CreateCourseTab";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AddCourseView = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ width: "100%" }}>
        <Box px={2} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="add-course-tabs"
            sx={{ marginBottom: 1 }}
          >
            <Tab
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
              }}
              label="Course"
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
              }}
              label="Marketing"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <CreateCourseTab />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Marketing
        </CustomTabPanel>
      </Box>
    </Fragment>
  );
};

export default AddCourseView;
