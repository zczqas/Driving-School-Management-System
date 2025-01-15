import React, { useEffect } from "react";

import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import SchoolConfigurationView from "@/views/Admin/SchoolConfigurationView";
import { useRouter } from "next/router";
import WithAuth from "@/components/WithAuth";

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
      <WithLayout layout={AdminLayout} component={SchoolConfigurationView} />
    );
  }
  return null;
};

export default WithAuth(SchoolConfigurationPage);
