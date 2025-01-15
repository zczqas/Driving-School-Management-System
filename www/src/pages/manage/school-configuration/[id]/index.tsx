import React, { useEffect } from "react";

import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import WithAuth from "@/components/WithAuth";
import SchoolConfigurationSettingsView from "@/views/Admin/SchoolConfigurationView/SchoolConfigurationSettings/SchoolConfigurationSettings";

//  ==================== | SchoolConfigurationSettingsPage | ====================
const SchoolConfigurationSettingsPage = () => {
  const user = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  const userRole = user?.role?.toLowerCase();

  if (["super_admin", "admin", "csr"].includes(userRole)) {
    return (
      <WithLayout
        layout={AdminLayout}
        component={SchoolConfigurationSettingsView}
      />
    );
  }
  return null;
};

export default WithAuth(SchoolConfigurationSettingsPage);
