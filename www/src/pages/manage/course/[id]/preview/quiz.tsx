import { useEffect } from "react";

import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import IRootState from "@/store/interface";
import { useRouter } from "next/router";
import QuizPreview from "@/views/Admin/CourseManagementView/components/preview/QuizPreview";
import { useSelector } from "react-redux";

const PreviewCourseQuiz = () => {
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
  return <WithLayout layout={AdminLayout} component={QuizPreview} />;
};

export default WithAuth(PreviewCourseQuiz);
