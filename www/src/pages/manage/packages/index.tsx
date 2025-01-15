import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import PackageView from "@/views/Admin/PackageView";

// ==============================|| PACKAGES PAGE ||============================== //
const PackagesMangement = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  //   if (user?.role === "STUDENT")
  //     return <WithLayout layout={UserLayout} component={} />;
  return <WithLayout layout={AdminLayout} component={PackageView} />;
};

export default WithAuth(PackagesMangement);
