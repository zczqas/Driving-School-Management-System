import { useEffect } from "react";

import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import IRootState from "@/store/interface";
import CoursePreviewView from "@/views/Admin/CourseManagementView/CoursePreviewView";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const PreviewCourse = () => {
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
  return <WithLayout layout={AdminLayout} component={CoursePreviewView} />;
};

export default WithAuth(PreviewCourse);
