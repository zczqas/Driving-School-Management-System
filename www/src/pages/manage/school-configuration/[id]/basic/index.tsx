import React, { useEffect } from "react";

import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import WithAuth from "@/components/WithAuth";
import BasicSchoolSettings from "@/views/Admin/SchoolConfigurationView/SchoolConfigurationSettings/BasicSchoolSettings";
import { Container, Paper } from "@mui/material";

//  ==================== | SchoolConfigurationSettingsPage | ====================
const SchoolConfigurationSettingsPage = () => {
  const user = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  const userRole = user?.role?.toLowerCase();

  if (["super_admin", "admin", "csr"].includes(userRole)) {
    return (
      <WithLayout layout={AdminLayout} component={BasicSchoolSettingsView} />
    );
  }
  return null;
};

export default WithAuth(SchoolConfigurationSettingsPage);

const BasicSchoolSettingsView = () => {
  return (
    <Container component={Paper} maxWidth={"lg"} sx={{ my: 2 }}>
      <BasicSchoolSettings />
    </Container>
  );
};
