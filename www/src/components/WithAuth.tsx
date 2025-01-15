import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import IRootState from "../store/interface"; // Assuming you have a RootState interface
import { Box } from "@mui/material";
import Image from "next/image";
import Loader from "./Loader";
import { useAppDispatch } from "@/hooks";
import { openAlert } from "@/store/alert/alert.actions";
import { updateNotifiedForVerification } from "@/store/auth/auth.actions";

interface Props {}

const WithAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthComponent: React.FC<P> = (props) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useSelector(
      (state: IRootState) => state.auth.isAuthenticated
    );
    const authLoading = useSelector(
      (state: IRootState) => state.auth.authLoading
    );

    const currentUser = useSelector(
      (state: IRootState) => state.auth.currentUser
    );

    const notifiedForVerification = useSelector(
      (state: IRootState) => state.auth.notifiedForVerification
    );

    const router = useRouter();

    useEffect(() => {
      // If the user is not authenticated, redirect them to the login page
      if (!isAuthenticated && !authLoading) {
        // router.replace(`/login/?fallbackUrl=${router.asPath}`); // Use replace instead of push to prevent back button from taking user to the protected page
        router.replace(`/login`); // Use replace instead of push to prevent back button from taking user to the protected page
      }

      if (!currentUser?.user?.is_verified && !authLoading && isAuthenticated && !notifiedForVerification) {
        console.log(currentUser, "checkaa");
        dispatch(
          openAlert(
            "Account not verified. Please check your email to complete verification.",
            "warning"
          )
        );
        dispatch(updateNotifiedForVerification());
      }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
     
    }, [currentUser]);

    if (authLoading) {
      return <Loader />;
    }

    // Render the wrapped component only if authenticated
    return isAuthenticated ? <WrappedComponent {...(props as P)} /> : null;
  };

  return AuthComponent;
};

export default WithAuth;
