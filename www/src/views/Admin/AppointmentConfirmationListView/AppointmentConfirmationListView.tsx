import React, { Fragment } from "react";

// third party libraries
import { Box, Container, SelectChangeEvent } from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import AppointmentListTable from "./components/AppointmentListTable";

// ==============================|| USER LIST VIEW ||============================== //
const AppointmentConfirmationListView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const appointmentData = [
    {
      id: 1,
      name: "John Doe",
      email: "Cheyenne.Devine@surepass.com",
      phone: "123-456-7890",
      parentPhone: "123-456-7890",
      pickup: "Home",
      pickupText: "TO DMV Confirmation #: 238954989",
      timeIn: "9:30 am",
      timeOut: "10:30 am",
      status: "11:30 am",
      confirmed:
        "Method: manually Tosh - confirmed with dad - 2023-12-14 18:18:35",
    },
    {
      id: 2,
      name: "John Doe",
      email: "Cheyenne.Devine@surepass.com",
      phone: "123-456-7890",
      parentPhone: "123-456-7890",
      pickup: "Home",
      pickupText: "TO DMV Confirmation #: 238954989",
      timeIn: "9:30 am",
      timeOut: "10:30 am",
      status: "11:30 am",
      confirmed:
        "Method: manually Tosh - confirmed with dad - 2023-12-14 18:18:35",
    },
    {
      id: 3,
      name: "John Doe",
      email: "Cheyenne.Devine@surepass.com",
      phone: "123-456-7890",
      parentPhone: "123-456-7890",
      pickup: "Home",
      pickupText: "TO DMV Confirmation #: 238954989",
      timeIn: "9:30 am",
      timeOut: "10:30 am",
      status: "11:30 am",
      confirmed:
        "Method: manually Tosh - confirmed with dad - 2023-12-14 18:18:35",
    },
    {
      id: 4,
      name: "John Doe",
      email: "Cheyenne.Devine@surepass.com",
      phone: "123-456-7890",
      parentPhone: "123-456-7890",
      pickup: "Home",
      pickupText: "TO DMV Confirmation #: 238954989",
      timeIn: "9:30 am",
      timeOut: "10:30 am",
      status: "11:30 am",
      confirmed:
        "Method: manually Tosh - confirmed with dad - 2023-12-14 18:18:35",
    },
    {
      id: 5,
      name: "John Doe",
      email: "Cheyenne.Devine@surepass.com",
      phone: "123-456-7890",
      parentPhone: "123-456-7890",
      pickup: "Home",
      pickupText: "TO DMV Confirmation #: 238954989",
      timeIn: "9:30 am",
      timeOut: "10:30 am",
      status: "11:30 am",
      confirmed:
        "Method: manually Tosh - confirmed with dad - 2023-12-14 18:18:35",
    },
  ];

  return (
    <Fragment>
      <SubHeader sortBy={sortBy} handleSortChange={handleSortChange} />
      <Container maxWidth={false}>
        <Box
          sx={{
            py: 3,
          }}
        >
          <AppointmentListTable appointmentData={appointmentData} />
        </Box>
      </Container>
    </Fragment>
  );
};

export default AppointmentConfirmationListView;
