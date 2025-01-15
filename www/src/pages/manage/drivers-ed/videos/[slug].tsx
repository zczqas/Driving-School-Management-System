import React, { Fragment } from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import OptionalVideos from "@/views/Client/DriversEd/components/OptionalVideos";
import WithAuth from "@/components/WithAuth";
import AdminLayout from "@/layouts/Admin/Admin";

// ==============================|| DASHHBOARD PAGE ||============================== //
const OptionalVideo = () => {
  return <WithLayout layout={AdminLayout} component={OptionalVideos} />;
};

export default WithAuth(OptionalVideo);
