import React, { Fragment } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  SelectChangeEvent,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";

// project imports
// import SubHeader from "./components/SubHeader";
// import { useDispatch, useSelector } from "react-redux";
// import IRootState from "@/store/interface";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useRouter } from "next/router";
import SchoolView from "./components/Schools/SchoolView";
import DrivingSchoolView from "./components/DrivingSchools/DrivingSchoolView";
import CityView from "./components/Cities/CityView";
import GasStationsView from "./components/GasStations/GasStationsView";
import AppointmentStatusView from "./components/AppointmentStatus/AppointmentStatusView";
import VehicleView from "./components/Vehicle/VehicleView";
import ManageCertificateView from "./components/Certificate/ManageCertificate/ManageCertificateView";
import BatchCertificateView from "./components/Certificate/BatchCertificate/BatchCertificateView";
import TrainingInstructionsView from "./components/TrainingInstruction/TrainingInstructionView";
import DMVView from "./components/DMV/DMVView";
import { openSans } from "@/themes/typography";
import CoursesView from "./components/Courses";
import UnitsView from "./components/Units";
// import CustomDialog from "@/components/CustomDialog";

// ==============================|| MasterList VIEW ||============================== //
const MasterListView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const dispatch = useAppDispatch<any>();

  const { query } = useRouter();
  const { name } = query;

  // React.useEffect(() => {}, []);

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

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const tabs = [
    { id: 0, title: "DMV" },
    { id: 1, title: "Schools" },
    { id: 2, title: "Cities" },
    { id: 3, title: "Gas Stations" },
    { id: 4, title: "Appointment Status" },
    { id: 5, title: "Vehicle" },
    { id: 6, title: "Training Instructions" },
    // { id: 7, title: "Certificate Batch" },
    // { id: 8, title: "Certificates" },
    // {
    //   id: 9,
    //   title: "Courses",
    // },
    // {
    //   id: 10,
    //   title: "Units",
    // },
  ];
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // const {
  //   school: { schoolListLoading },
  // } = useAppSelector((state: IRootState) => state?.masterlist);
  return (
    <Fragment>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "white",
          px: "30px",
          py: "25px",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="master list tabs"
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
            sx: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          sx={{
            "& .MuiTabs-indicator": {
              display: "flex",
              justifyContent: "center",
              backgroundColor: "transparent",
            },
            "& .MuiTabs-indicatorSpan": {
              maxWidth: 40,
              width: "100%",
              backgroundColor: "#5E38B5",
              height: 3,
              borderRadius: "10px",
            },
            "& .MuiTab-root": {
              fontFamily: openSans.style.fontFamily,
              textTransform: "none",
              minWidth: "auto",
              padding: "12px 16px",
              color: "#000",
              fontWeight: "600",
              "&.Mui-selected": {
                color: "#5E38B5",
                fontWeight: "bold",
              },
            },
            "& .MuiTouchRipple-root": {
              display: "none",
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.title} disableRipple />
          ))}
        </Tabs>
      </Box>

      <Container maxWidth={false}>
        <Box
          sx={{
            py: 1,
          }}
        >
          <TabPanel value={tabValue} index={0}>
            <DMVView />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <SchoolView />
          </TabPanel>
          {/* <TabPanel value={tabValue} index={2}>
              <DrivingSchoolView />
            </TabPanel> */}
          <TabPanel value={tabValue} index={2}>
            <CityView />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <GasStationsView />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <AppointmentStatusView />
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <VehicleView />
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            <TrainingInstructionsView />
          </TabPanel>
          {/*  ========== Page to add certificate in batch and view them ========*/}
          {/* <TabPanel value={tabValue} index={7}>
            <BatchCertificateView />/
          </TabPanel> */}
          {/* =========== Page to view and manage all individual certificates ======== */}
          {/* <TabPanel value={tabValue} index={8}>
            <ManageCertificateView />
          </TabPanel> */}
          {/* <TabPanel value={tabValue} index={9}>
            <CoursesView />
          </TabPanel>
          <TabPanel value={tabValue} index={10}>
            <UnitsView />
          </TabPanel> */}
        </Box>
      </Container>
    </Fragment>
  );
};

export default MasterListView;
