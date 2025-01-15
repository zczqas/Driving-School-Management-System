import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import PricingView from "@/views/Admin/PricingView";

// ==============================|| PRICING PAGE ||============================== //
const PricingPage = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  if (user?.role === "STUDENT" || user?.role === "INSTRUCTOR")
    return <WithLayout layout={UserLayout} component={PricingView} />;
  return <WithLayout layout={AdminLayout} component={PricingView} />;
};

export default WithAuth(PricingPage);
