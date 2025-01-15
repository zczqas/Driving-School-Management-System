import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { Container, IconButton } from "@mui/material";
import ProfileCard from "./components/ProfileCard";
import MobileSubHeader from "@/components/MobileSubHeader";
import { logout } from "@/store/auth/auth.actions";
import LogoutIcon from "@mui/icons-material/Logout";
import MainTabs from "./components/MainTabs";
import { constants } from "@/utils/constants";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import TransactionsMobile from "./components/Transactions/TransactionsMobile";
import {
  fetchUserDetailsById,
  getInstructorNotesByUserId,
} from "@/store/user/user.actions";
import { fetchTransactionsByUserIdStart } from "@/store/account/account.actions";
// ==============================|| CLIENT PROFILE VIEW MOBILE ||============================== //
const ProfileViewMobile = () => {
  const { currentUser } = useAppSelector((state: IRootState) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id, tabValue } = router.query;

  // ========= | Active Tab | ==========
  const [value, setValue] = React.useState(0);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    router.replace(
      `/manage/profile/${id ? id : currentUser?.id}?tabValue=${newValue}`,
      undefined,
      {
        shallow: true,
      }
    );
  };

  useEffect(() => {
    setValue(tabValue ? parseInt(tabValue as string) : 0);
  }, [tabValue]);

  const subHeaderTitle =
    value === 0 ? "Profile" : constants.profileTabs[value - 1].name;

  const {
    transactionListByUserId,
    transactionListByUserIdLoading,
    pendingTransactionListByUserId,
    pendingTransactionListByUserIdLoading,
  } = useAppSelector((state: IRootState) => state.account);

  const {
    userDetailsById: { details: detailsById, loading: loadingById },
    userDetails: { details: detailsUser, loading: loadingUser },
  } = useAppSelector((store: IRootState) => store?.user);

  React.useEffect(() => {
    if (id && !loadingById) {
      dispatch(fetchUserDetailsById(id as string));
      dispatch(fetchTransactionsByUserIdStart(id as string));
      dispatch(fetchTransactionsByUserIdStart(id as string, "PENDING"));

      // dispatch(
      //   fetchAppointmentsByUserId(detailsById?.user?.role, id as string)
      // );
      dispatch(getInstructorNotesByUserId(id as string));
      // dispatch(getUserCertificateByUserId(id as string));
    }
  }, []);

  return (
    <>
      <MobileSubHeader
        title={subHeaderTitle}
        rightAction={<LogoutButton />}
        backLink={value > 0 ? `/manage/profile/${id}` : null}
      />
      <Container
        maxWidth={"md"}
        sx={{
          padding: "22px 18px",
          borderRadius: "10px",
        }}
      >
        {(() => {
          switch (value) {
            case 2:
              return (
                <TransactionsMobile
                  drivingSchoolName={
                    detailsById?.user?.driving_school
                      ? detailsById?.user?.driving_school[0]?.name
                      : null
                  }
                  transactionListByUserId={transactionListByUserId}
                  transactionListByUserIdLoading={
                    transactionListByUserIdLoading
                  }
                  pendingTransactionListByUserId={
                    pendingTransactionListByUserId
                  }
                  pendingTransactionListByUserIdLoading={
                    pendingTransactionListByUserIdLoading
                  }
                />
              );
            default:
              return (
                <>
                  <ProfileCard
                    firstName={currentUser?.user?.first_name}
                    lastName={currentUser?.user?.last_name}
                    email={currentUser?.user?.email}
                    drivingSchool={
                      currentUser?.user?.driving_school
                        ? currentUser?.user?.driving_school[0]?.name
                        : null
                    }
                  />
                  <MainTabs handleChange={handleChange} />
                </>
              );
          }
        })()}
      </Container>
    </>
  );
};

export default ProfileViewMobile;

// Logout Icon Button for SubHeader

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <IconButton onClick={handleLogout}>
      <LogoutIcon />
    </IconButton>
  );
};
