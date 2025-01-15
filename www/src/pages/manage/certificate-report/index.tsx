import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import CertificateReportView from "@/views/Admin/CertificateReportView";

// ==============================|| Certificate PAGE ||============================== //
const CertificateReport = () => {
  return <WithLayout layout={AdminLayout} component={CertificateReportView} />;
};

export default WithAuth(CertificateReport);
