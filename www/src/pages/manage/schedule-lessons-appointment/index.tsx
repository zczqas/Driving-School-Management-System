import React, { useEffect } from "react";

import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import ScheduleLesson from "@/views/Client/ScheduleLessonsAppointment";
import { useRouter } from "next/router";
import WithAuth from "@/components/WithAuth";

//  ==================== | ScheduleLessons | ====================
const ScheduleLessons = () => {
  const user = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  return <WithLayout layout={AdminLayout} component={ScheduleLesson} />;
};

export default WithAuth(ScheduleLessons);
