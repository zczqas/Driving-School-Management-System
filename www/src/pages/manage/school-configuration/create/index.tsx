import React, { useEffect } from "react";

import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { useRouter } from "next/router";
import WithAuth from "@/components/WithAuth";
import BasicSchoolSettings from "@/views/Admin/SchoolConfigurationView/SchoolConfigurationSettings/BasicSchoolSettings";
import { Box, Container, Paper } from "@mui/material";

//  ==================== | SchoolConfigurationPage | ====================
const SchoolConfigurationPage = () => {
  const user = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  if (
    user?.role === "ADMIN" ||
    user?.role === "CSR" ||
    user?.role?.lowercase() === "super_admin"
  ) {
    return (
      <WithLayout
        layout={AdminLayout}
        component={BasicSchoolSettingsPageView}
      />
    );
  }
  return null;
};

const BasicSchoolSettingsPageView = () => {
  return (
    <Container maxWidth={"lg"} component={Paper}>
      <Box
        sx={{
          py: 1,
          mt: 3,
        }}
      >
        <BasicSchoolSettings />
      </Box>
    </Container>
  );
};

export default WithAuth(SchoolConfigurationPage);
