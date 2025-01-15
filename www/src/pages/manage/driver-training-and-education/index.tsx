import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import LessonView from "@/views/Admin/LessonView";
import DriverTrainingEducationView from "@/views/Admin/DrivingTrainingEducationView";

// ==============================|| DRIVING TRAINING PAGE ||============================== //
const LessonManagement = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  //   if (user?.role === "STUDENT")
  //     return <WithLayout layout={UserLayout} component={} />;
  return <WithLayout layout={AdminLayout} component={DriverTrainingEducationView} />;
};

export default WithAuth(LessonManagement);
