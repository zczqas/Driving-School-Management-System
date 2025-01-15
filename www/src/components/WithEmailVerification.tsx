import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { useRouter } from "next/router";
import CustomDialog from "@/components/CustomDialog";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { openAlert } from "@/store/alert/alert.actions";
import { loadUser, resendEmailVerification } from "@/store/auth/auth.actions";

const getDisplayName = (WrappedComponent: React.ComponentType<any>): string => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

const withEmailVerification = (WrappedComponent: React.ComponentType<any>) => {
  const WithEmailVerification = (props: any) => {
    const [isVerificationModalOpen, setIsVerificationModalOpen] =
      useState(false);
    const [isResendEmailSubmitting, setIsResendEmailSubmitting] =
      useState(false);
    const [isResendEmailSuccess, setIsResendEmailSuccess] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { currentUser } = useAppSelector((state: any) => state.auth);

    useEffect(() => {
      if (currentUser?.user && !currentUser.user.is_verified) {
        setIsVerificationModalOpen(true);
      }
    }, [currentUser]);

    const handleResendEmail = () => {
      if (isResendEmailSuccess) {
        dispatch(openAlert("Try again in a few minutes", "info"));
        return;
      }
      setIsResendEmailSubmitting(true);
      dispatch(
        resendEmailVerification(currentUser?.user?.email as string, () => {
          setIsResendEmailSubmitting(false);
          setIsResendEmailSuccess(true);
        })
      );
      setTimeout(() => {
        setIsResendEmailSuccess(false);
      }, 15000);
    };

    const VerificationModalContent = () => (
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Box
          sx={{ height: "200px", width: "100%", position: "relative", mb: 3 }}
        >
          <Image
            src="/assets/email-start.svg"
            alt="Verify Email"
            fill
            priority
          />
        </Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Verify your email address
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          A confirmation email has been sent to your email address,{" "}
          <span style={{ color: "#5E38B5" }}>{currentUser?.user?.email}</span>.
          Please check your email and click on the link provided to complete
          your account verification process.
        </Typography>
        <Button
          disableElevation
          disabled={isResendEmailSubmitting}
          size="large"
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "100px",
            padding: "12px 0",
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 700,
            maxWidth: "330px",
            width: "100%",
          }}
          onClick={handleResendEmail}
        >
          Resend Email
        </Button>
      </Box>
    );

    return (
      <>
        <Box
          sx={{
            pointerEvents: isVerificationModalOpen ? "none" : "auto",
            opacity: isVerificationModalOpen ? 0.5 : 1,
            transition: "opacity 0.3s",
          }}
        >
          <WrappedComponent {...props} />
        </Box>
        <CustomDialog
          open={isVerificationModalOpen}
          handleClose={() => {
            router.push("/manage/profile");
          }}
          handleAccept={() => {}}
          dialogTitle="Email Verification Required"
          fullWidth
          maxWidth="sm"
          isNotAForm
        >
          <VerificationModalContent />
        </CustomDialog>
      </>
    );
  };

  WithEmailVerification.displayName = `WithEmailVerification(${getDisplayName(
    WrappedComponent
  )})`;
  return WithEmailVerification;
};

export default withEmailVerification;
