import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
// import AppointmentConfirmationView from "@/views/Admin/AppointmentConfirmationListView";
import CertificateListView from "@/views/Admin/CertificateListView";
import WithAuth from "@/components/WithAuth";

// ==============================|| Certificate PAGE ||============================== //
const AppointmentConfirmation = () => {
  return <WithLayout layout={AdminLayout} component={CertificateListView} />;
};

export default WithAuth(AppointmentConfirmation);
