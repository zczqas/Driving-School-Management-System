import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import EditDriverTrainingView from "@/views/Admin/DrivingTrainingEducationView/components/AddEdit";

// ==============================|| DRIVING TRAINING PAGE ||============================== //
const LessonManagement = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  //   if (user?.role === "STUDENT")
  //     return <WithLayout layout={UserLayout} component={} />;
  return <WithLayout layout={AdminLayout} component={EditDriverTrainingView} />;
};

export default WithAuth(LessonManagement);
