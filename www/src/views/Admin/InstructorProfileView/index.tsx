import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import React from "react";
import ProfileCard from "./components/ProfileCard";
import { Box, Container, Typography } from "@mui/material";
import InformationCard from "./components/InformationCard";

const InstructorProfileView = () => {
  const dispatch = useAppDispatch();

  const { user, profile } = useAppSelector(
    (state: IRootState) => state.auth?.currentUser
  );
  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 3,
          backgroundColor: "primary.light",
          padding: "22px 18px",
          borderRadius: "8px",
          minHeight: "85vh",
        }}
      >
        <ProfileCard
          id={user?.id}
          firstName={user?.first_name}
          middleName={user?.middle_name}
          lastName={user?.last_name}
          email={user?.email}
          verified={user?.is_verified}
          role={user?.role}
        />
        <InformationCard
          userRole={user?.role}
          firstName={user?.first_name}
          lastName={user?.last_name}
          phone={profile?.cell_phone}
          notes={profile?.notes[0]}
          address={profile?.address}
          birthDate={profile?.dob}
          city={profile?.city}
          gender={profile?.gender}
          school={profile?.school}
          state={profile?.state}
          unit={profile?.apartment}
          zip={profile?.zip_code}
        />
      </Box>
    </Container>
  );
};

export default InstructorProfileView;
