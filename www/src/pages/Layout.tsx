import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import IRootState from "@/store/interface";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const tenantData = useSelector(
    (state: IRootState) => state.tenant.tenantData
  );

  return (
    <>
      <Navbar tenantData={tenantData} />
      {children}
      <Footer tenantData={tenantData} />
    </>
  );
};

export default Layout;
