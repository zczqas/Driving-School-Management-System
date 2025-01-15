import withPublicRoute from "@/components/WithPublicRoute";
import { useAppDispatch } from "@/hooks";
import { openAlert } from "@/store/alert/alert.actions";
import {
  resendEmailVerification,
  verifyEmail,
} from "@/store/auth/auth.actions";
import { lato } from "@/themes/typography";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const Verify = () => {
  const router = useRouter();
  const { email, token } = router.query;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResendEmailSuccess, setIsResendEmailSuccess] = React.useState(false);
  const [loading, setIsLoading] = React.useState(true);
  const [verified, setVerified] = React.useState(false);
  const [error, setError] = React.useState("");
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (token) {
      dispatch(
        verifyEmail(
          token as string,
          () => {
            // setIsSubmitting(false);
            setVerified(true);
            setIsLoading(false);
          },
          (message) => {
            // setIsSubmitting(false);
            setError(message);
            setIsLoading(false);
          }
        )
      );
    }
  }, [token]);

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
    <React.Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
          <Image
            src={
              loading
                ? "/assets/email-start.svg"
                : !!error
                ? "/assets/email-error.svg"
                : "/assets/email-success.svg"
            }
            alt="sfds"
            fill
            priority
          />
        </Box>
        {loading ? null : (
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
              <Typography variant="h1">
                {!!error && !loading
                  ? "Email Verification Failed!"
                  : "Email is Verified"}
              </Typography>
            </Box>

            <Box
              sx={{ maxWidth: "850px", "& > h5>  span": { color: "#5E38B5" } }}
            >
              {!!error && !loading ? (
                <Typography variant="h5">error</Typography>
              ) : (
                <Typography variant="h5">
                  Your email
                  <span> {email} </span>
                  has been successfully verified. you can now go back to the
                  login page to access the platform.
                </Typography>
              )}
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
              onClick={() => {
                if (!error) {
                  router.push(`/login/?email=${email}`);
                } else if (!!error) {
                  handleResendEmail();
                }
              }}
            >
              {!!error ? "Resend Email" : "Go to Login"}
            </Button>
          </Box>
        )}
      </Container>
    </React.Fragment>
  );
};

export default withPublicRoute(Verify);
