import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
// import AdminLayout from "@/layouts/Admin";
// import UserLayout from "@/layouts/User/User";

import WithAuth from "@/components/WithAuth";
// import { useSelector } from "react-redux";
// import IRootState from "@/store/interface";
import PricingView from "@/views/Client/PricingView";
import Blank from "@/layouts/Blank";

// ==============================|| PRICING PAGE LANDING ||============================== //
const PricingPage = () => {
//   const user = useSelector(
//     (state: IRootState) => state?.auth?.currentUser?.user
//   );
//   if (user?.role === "STUDENT" || user?.role === "INSTRUCTOR")
//     return <WithLayout layout={UserLayout} component={PricingView} />;
  return <WithLayout layout={Blank} component={PricingView} />;
};

export default PricingPage;
