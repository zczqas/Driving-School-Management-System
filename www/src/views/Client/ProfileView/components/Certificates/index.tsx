import React, { useState } from "react";
import { Box, Tab, Tabs, useTheme } from "@mui/material";
import CertificateTable from "./Components/CertificateTable";

interface Props {
  userCertificateByUserId: any;
  userCertificateByUserIdLoading: boolean;
  drivingSchoolName: string;
}

const Certificates = ({
  userCertificateByUserId,
  userCertificateByUserIdLoading,
  drivingSchoolName,
}: Props) => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const filteredGoldCertificates = userCertificateByUserId?.certs?.filter(
    (certificate: any) => certificate?.certificate_type === "GOLD"
  );

  const filteredPinkCertificates = userCertificateByUserId?.certs?.filter(
    (certificate: any) => certificate?.certificate_type === "PINK"
  );

  return (
    <Box
      p={3}
      sx={{
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        aria-label="Certificate Types"
        sx={{
          "& .MuiTab-root": {
            fontSize: "16px",
            lineHeight: "26px",
            fontWeight: 600,
            color: theme.palette.common.black,
          },
          "& .MuiTab-root.Mui-selected": {
            color: "#F37736",
          },
        }}
        TabIndicatorProps={{
          sx: {
            backgroundColor: "#F37736",
          },
        }}
      >
        <Tab label="Gold Certificates" sx={{ width: "100%", padding: 3 }} />
        <Tab label="Pink Certificates" sx={{ width: "100%", padding: 3 }} />
      </Tabs>

      <Box
        sx={{
          mt: 2,
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
          background: "#fff",
        }}
      >
        {tabIndex === 0 && (
          <CertificateTable
            drivingSchoolName={drivingSchoolName}
            certificates={filteredGoldCertificates}
            loading={userCertificateByUserIdLoading}
          />
        )}
        {tabIndex === 1 && (
          <CertificateTable
            drivingSchoolName={drivingSchoolName}
            certificates={filteredPinkCertificates}
            loading={userCertificateByUserIdLoading}
          />
        )}
      </Box>
    </Box>
  );
};

export default Certificates;
