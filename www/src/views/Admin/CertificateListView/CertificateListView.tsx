import React, { Fragment } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  SelectChangeEvent,
} from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import CertificateListTable from "./components/CertificateListTable";
import { StyledTab, StyledTabs } from "@/components/CustomTabs";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchUsers } from "@/store/user/user.actions";
import IRootState from "@/store/interface";
import generateCertificateWithHash from "@/utils/generateCertificate";
import {
  getAssignedUserCertificate,
  updateUserCertificateStatus,
} from "@/store/certificate/certificate.actions";
import moment from "moment";
import formatDateToString from "@/utils/formatDateToString";

// ==============================|| CERTIFICATE REPORT VIEW ||============================== //
const CertificateReportView = () => {
  const { role, id: UserId } = useAppSelector(
    (state: IRootState) => state.auth
  );
  const [days, setDays] = React.useState("6");
  const dispatch = useAppDispatch();

  const handleDaysChange = (event: SelectChangeEvent) => {
    setDays(event.target.value as string);
  };

  const {
    goldCertificateList,
    goldCertificateListError,
    goldCertificateListLoading,
    pinkCertificateList,
    pinkCertificateListError,
    pinkCertificateListLoading,
  } = useAppSelector((state: IRootState) => state.certificate);

  React.useEffect(() => {
    if (role === "INSTRUCTOR") {
      dispatch(
        getAssignedUserCertificate(
          0,
          30,
          "GOLD",
          "NOT_ISSUED",
          "CERTIFICATE_ID",
          "DESC",
          null,
          null,
          null,
          null,
          UserId ? UserId.toString() : null
        )
      );
    } else {
      dispatch(getAssignedUserCertificate(0, 30, "GOLD", "NOT_ISSUED"));
    }
    // dispatch(getAssignedUserCertificate(0, 100, "PINK"));
  }, []);

  const filteredUsersData = goldCertificateList?.certs
    ? goldCertificateList?.certs.map(
        ({
          id,
          certificate_id,
          instructor,
          user_profiles: { user, dob },
          issued_date,
          assigned_date,
        }: any) => ({
          id: id,
          email: user.email,
          name: `${user.first_name ?? ""} ${user.middle_name ?? ""} ${
            user.last_name ?? ""
          }`,
          student_id: user.id,
          phone: "-",
          birthday: dob ? formatDateToString(dob) : "-",
          driverTrainingPinkCertificate: null,
          driverTrainingGoldCertificate: certificate_id ? certificate_id : "",
          issueDate: issued_date ? formatDateToString(issued_date) : "-",
          assignedDate: assigned_date ? formatDateToString(assigned_date) : "-",
          instructor: instructor?.user?.id ?? "",
          number: "-",
        })
      )
    : [];

  const pinkCertificateData = pinkCertificateList?.user_certificates
    ? pinkCertificateList?.user_certificates.map(
        ({
          id,
          certificate,
          instructor_id,
          user_profiles: { user },
          issued_date,
        }: any) => ({
          id: id,
          email: user.email,
          name: `${user.first_name ?? ""} ${user.middle_name ?? ""} ${
            user.last_name ?? ""
          }`,
          student_id: user.id,
          phone: "-",
          birthday: "-",
          driverTrainingPinkCertificate: certificate?.certificate_number,
          driverTrainingGoldCertificate: null,
          issueDate: issued_date ? formatDateToString(issued_date) : "-",
          instructor: instructor_id ?? "",
          number: "-",
        })
      )
    : [];

  const goldCertificateData = filteredUsersData;
  const [tabValue, setTabValue] = React.useState<number>(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function assignCertificate(
    user_certificate_id: string,
    certificateType: "GOLD" | "PINK",
    instructorId: string,
    certificateNumber: string
  ) {
    dispatch(
      updateUserCertificateStatus(
        user_certificate_id,
        "ISSUED",
        instructorId,
        certificateNumber,
        () => {
          if (role === "INSTRUCTOR") {
            dispatch(
              getAssignedUserCertificate(
                0,
                30,
                certificateType,
                "NOT_ISSUED",
                "CERTIFICATE_ID",
                "DESC",
                null,
                null,
                null,
                null,
                UserId ? UserId.toString() : null
              )
            );
          } else {
            dispatch(
              getAssignedUserCertificate(0, 30, certificateType, "NOT_ISSUED")
            );
          }
        }
      )
    );
  }

  const styles = {
    tabsContainer: {
      width: "597px",
      borderRadius: "24px",
      border: "0px solid rgba(243, 242, 241, 0.80)",
      background: "var(--ffffff, #FFF)",
      filter:
        "drop-shadow(2.477px 2.477px 18.578px rgba(166, 171, 189, 0.50)) drop-shadow(-1.239px -1.239px 16.101px #FAFBFF)",
      display: "flex",
      alignItems: "center",
    },
  };
  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={goldCertificateListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: "20px",
        }}
      >
        <Box sx={styles.tabsContainer}>
          <StyledTabs
            variant="fullWidth"
            value={tabValue}
            onChange={handleChange}
            centered
          >
            <StyledTab
              value={1}
              label="Golden Certificate"
              iconPosition="start"
              icon={
                <Image
                  src="/icons/Medallionsgold.svg"
                  alt="Custom Icon"
                  width={"77"}
                  height={"77"}
                  style={{ marginTop: "18px" }}
                />
              }
            />
            <StyledTab
              value={2}
              label="Pink Certificate"
              iconPosition="start"
              icon={
                <Image
                  src="/icons/Medallionspink.svg"
                  alt="Custom Icon"
                  width={"77"}
                  height={"77"}
                  style={{ marginTop: "18px" }}
                />
              }
            />
          </StyledTabs>
        </Box>
      </Box>
      <Container maxWidth={false}>
        <SubHeader
          days={days}
          handleDaysChange={handleDaysChange}
          tabValue={tabValue}
        />
        <Box
          sx={{
            py: 3,
          }}
        >
          <CertificateListTable
            assignCertificate={assignCertificate}
            certificateData={
              tabValue === 2 ? pinkCertificateData : goldCertificateData
            }
            certificateType={tabValue}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default CertificateReportView;
