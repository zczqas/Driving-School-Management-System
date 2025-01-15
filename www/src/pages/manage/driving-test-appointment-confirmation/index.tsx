import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import AppointmentConfirmationView from "@/views/Admin/AppointmentConfirmationListView";
import WithAuth from "@/components/WithAuth";

// ==============================|| Appointment Confirmation PAGE ||============================== //
const AppointmentConfirmation = () => {
  return (
    <WithLayout layout={AdminLayout} component={AppointmentConfirmationView} />
  );
};

export default WithAuth(AppointmentConfirmation);
