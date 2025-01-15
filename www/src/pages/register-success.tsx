import withPublicRoute from "@/components/WithPublicRoute";
import { useAppDispatch } from "@/hooks";
import { openAlert } from "@/store/alert/alert.actions";
import { resendEmailVerification } from "@/store/auth/auth.actions";
import { lato } from "@/themes/typography";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const RegisterSuccess = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { email } = router.query;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResendEmailSuccess, setIsResendEmailSuccess] = React.useState(false);

  function handleResendEmail() {
    if (!email) return;
    if (isResendEmailSuccess) {
      dispatch(openAlert("Try again in a few minutes", "info"));
      return;
    }
    setIsSubmitting(true);
    dispatch(
      resendEmailVerification(email as string, () => {
        setIsSubmitting(false);
        setIsResendEmailSuccess(true);
      })
    );
    setTimeout(() => {
      setIsResendEmailSuccess(false);
    }, 15000);
  }
  return (
    <Container
      maxWidth={"lg"}
      sx={{
        p: 10,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "300px",
          width: "100%",
          position: "relative",
          mb: "50px",
        }}
      >
        <Image src={"/assets/email-start.svg"} alt="sfds" fill priority />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          "& > div": {
            textAlign: "center",
          },
          "& > div > h1": {
            fontSize: { lg: "60px", md: "48px", sm: "36px", xs: "24px" },
            fontWeight: 700,
            color: "#000",
            fontFamily: lato.style.fontFamily,
            lineHeight: {
              lg: "72px",
              md: "57.6px",
              sm: "43.2px",
              xs: "28.8px",
            },
          },
          "& > div > h5": {
            fontSize: "24px",
            fontWeight: 400,
            color: "#000",
            fontFamily: lato.style.fontFamily,
            lineHeight: "28.8px",
          },
        }}
      >
        <Box>
          <Typography variant="h1">Verify your email address</Typography>
        </Box>

        <Box sx={{ maxWidth: "850px", "& > h5>  span": { color: "#5E38B5" } }}>
          <Typography variant="h5">
            A confirmation email has been sent to your email address,&nbsp;
            <span>{email}</span>&nbsp; Please check your email and click on the
            link provided to complete your account registration process.
          </Typography>
        </Box>

        <Button
          disableElevation
          disabled={isSubmitting}
          size="large"
          type="submit"
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
            marginTop: "90px",
          }}
          onClick={handleResendEmail}
        >
          Resend Email
        </Button>
      </Box>
    </Container>
  );
};

export default withPublicRoute(RegisterSuccess);
