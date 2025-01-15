import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import Quiz from "@/views/Client/DriversEd/components/UnitQuiz";
import WithAuth from "@/components/WithAuth";
import AdminLayout from "@/layouts/Admin/Admin";

// ==============================|| DASHHBOARD PAGE ||============================== //
const UnitQuiz = () => {
  return <WithLayout layout={AdminLayout} component={Quiz} />;
};

export default WithAuth(UnitQuiz);
