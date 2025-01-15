import { useEffect } from "react";

import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import IRootState from "@/store/interface";
import CourseManagementView from "@/views/Admin/CourseManagementView";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const CourseList = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  const router = useRouter();
  useEffect(() => {
    if (user?.role === "STUDENT") {
      router.replace("/404");
    }
  }, [user, router]);

  if (user?.role === "STUDENT") return null;
  return <WithLayout layout={AdminLayout} component={CourseManagementView} />;
};

export default WithAuth(CourseList);
