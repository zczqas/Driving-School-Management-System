import React from "react";

// project imports
import RecoverView from "@/views/Auth/ResetPassword";
import WithLayout from "@/components/WithLayout";
import Blank from "@/layouts/Blank";
import withPublicRoute from "@/components/WithPublicRoute";

// ==============================|| RECOVER PASSWORD PAGE ||============================== //

const Login = () => {
  return <WithLayout layout={Blank} component={RecoverView} />;
};

export default withPublicRoute(Login);
