import { Box, Typography } from "@mui/material";
import React from "react";
import AppointmentManagementTable from "./AppointmentManagementTable";

interface Props {
  appointmentByUserId: any;
  currentUserName?: string;
  handleAppointmentDelete: (id: number) => void;
}

const AppointmentManagement = ({
  appointmentByUserId,
  currentUserName,
  handleAppointmentDelete,
}: Props) => {
  console.log(appointmentByUserId);
  const appointmentData = appointmentByUserId?.appointments?.map(
    (appointment: any) => {
      return {
        id: appointment?.id,
        classDate: appointment?.appointment_date,
        studentName: appointment?.student?.first_name
          ? `${appointment?.student?.first_name ?? ""} ${
              appointment?.student?.middle_name ?? ""
            } ${appointment?.student?.last_name ?? ""}`
          : "-",
        lesson: appointment?.lesson?.name,
        address: appointment?.student?.school?.address ?? "-",
        location: appointment?.student?.school?.description ?? "-",
        startTime: appointment?.start_time,
        endTime: appointment?.end_time,
        vehicle: appointment?.vehicle,
      };
    }
  );
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          background: "#E5E4E4",
          borderRadius: "8px 8px 0px 0px",
          padding: "22px 12px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textTransform: "uppercase",
            fontWeight: 700,
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          {`${currentUserName}'s Schedule`}
        </Typography>
      </Box>
      <Box
        sx={{
          padding: "50px 45px",
        }}
      >
        <AppointmentManagementTable
          appointmentData={appointmentData}
          handleAppointmentDelete={handleAppointmentDelete}
        />
      </Box>
    </Box>
  );
};

export default AppointmentManagement;
