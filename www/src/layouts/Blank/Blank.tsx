import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import Navbar from "@/pages/Layouts/Navbar";
import IRootState from "@/store/interface";

interface BlankProps {
  children: React.ReactNode;
}

// ==============================|| BLANK LAYOUT ||============================== //
const Blank = ({ children }: BlankProps) => {
  const tenantData = useSelector(
    (state: IRootState) => state.tenant.tenantData
  );

  return (
    <Box height={"100vh"}>
      <Navbar tenantData={tenantData} />
      <main
        style={{
          height: "70%",
        }}
      >
        {children}
      </main>
    </Box>
  );
};

export default Blank;
