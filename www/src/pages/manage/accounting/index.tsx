import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";
import AccountingView from "@/views/Admin/AccountingView";
import ProfileView from "@/views/Client/ProfileView";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| Accounting PAGE ||============================== //
const Accounting = () => {
  const user = useSelector((state: IRootState) => state?.auth?.currentUser?.user);
  if (user?.role === "STUDENT")
    return <WithLayout layout={UserLayout} component={ProfileView} />;
  return <WithLayout layout={AdminLayout} component={AccountingView} />;
};

export default WithAuth(Accounting);
