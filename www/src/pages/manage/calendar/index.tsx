import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import Calendar from "@/views/Admin/Calendar";

// ==============================|| SCHEDULE PAGE ||============================== //
const InstructorCalendar = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  return <WithLayout layout={AdminLayout} component={Calendar} />;
};

export default WithAuth(InstructorCalendar);
