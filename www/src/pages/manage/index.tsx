// pages/index.js

import { useRouter } from "next/router";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import IRootState from "@/store/interface";
import { loadUser } from "@/store/auth/auth.actions";
import withAuth from "@/components/WithAuth";

const HomePage = () => {
  // redirect to login if not authenticated & to dashboard if authenticated
  const { isAuthenticated, authLoading, loadUserFailed, currentUser, role } =
    useSelector((state: IRootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedDispatch = React.useCallback(dispatch, []);

  React.useEffect(() => {
    if (!isAuthenticated && !loadUserFailed) {
      memoizedDispatch<any>(loadUser());
    } else if (isAuthenticated && !loadUserFailed) {
      if (currentUser?.user.role === "STUDENT" || role === "STUDENT") {
        router.push("/manage/profile");

        // === Commented out because we want to create transaction after profile update ===
        // if (currentUser?.user?.package?.length > 0) {
        //   router.push("/manage/profile");
        // } 
        // else {
        //   router.push("/manage/accounting/create");
        // }
      } else if (role === "INSTRUCTOR") {
        router.push("/manage/instructor/instructors-lesson-listing");
      } else {
        router.push("/manage/search-students");
      }
    }
  }, [
    isAuthenticated,
    loadUserFailed,
    memoizedDispatch,
    router,
    currentUser,
    role,
  ]);

  return null;
};

export default withAuth(HomePage);
