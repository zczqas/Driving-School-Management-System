import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import Exam from "@/views/Client/DriversEd/components/FinalExam";
import WithAuth from "@/components/WithAuth";
import AdminLayout from "@/layouts/Admin/Admin";

// ==============================|| DASHHBOARD PAGE ||============================== //
const FinalExam = () => {
  return <WithLayout layout={AdminLayout} component={Exam} />;
};

export default WithAuth(FinalExam);
