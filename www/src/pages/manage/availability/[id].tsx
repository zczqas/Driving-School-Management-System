import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import Availability from "@/views/Admin/Availability";

// ==============================|| SCHEDULE PAGE ||============================== //
const InstructorAvailability = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  return <WithLayout layout={AdminLayout} component={Availability} />;
};

export default WithAuth(InstructorAvailability);