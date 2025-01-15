import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import IRootState from "../store/interface"; // Assuming you have a RootState interface
import { Box } from "@mui/material";

interface Props {}

const withPublicRoute = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const PublicRouteComponent: React.FC<P> = (props) => {
    const isAuthenticated = useSelector(
      (state: IRootState) => state.auth.isAuthenticated
    );
    const authLoading = useSelector(
      (state: IRootState) => state.auth.authLoading
    );
    const router = useRouter();

    useEffect(() => {
      // If the user is authenticated, redirect them to the home page or dashboard
      if (isAuthenticated && !authLoading) {
        router.push("/manage");
      }
    }, [isAuthenticated, authLoading, router]);

    return <WrappedComponent {...(props as P)} />;
  };

  return PublicRouteComponent;
};

export default withPublicRoute;
