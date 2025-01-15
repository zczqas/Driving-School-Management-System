import { lato } from "@/themes/typography";
import { Home, Login } from "@mui/icons-material";
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

const ErrorPageNotFound = () => {
  const router = useRouter();

  return (
    <React.Fragment>
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
        <Box>
          <Typography
            sx={{
              fontFamily: lato.style.fontFamily,
              fontSize: "50px",
              fontWeight: 400,
              mb: "20px",
            }}
          >
            OOPS!
          </Typography>
          <Typography
            sx={{
              fontFamily: lato.style.fontFamily,
              fontSize: "100px",
              fontWeight: 700,
              mb: "20px",
            }}
          >
            404
          </Typography>

          <Typography
            sx={{
              fontWeight: 500,
              fontFamily: lato.style.fontFamily,
              fontSize: "24px",
              mb: "20px",
            }}
          >
            Page Not Found
          </Typography>
        </Box>
        <Box
          sx={{
            height: "300px",
            width: "100%",
            position: "relative",
            mb: "50px",
          }}
        >
          <Image
            src={"/assets/images/404Image.svg"}
            alt="404 Image Not found"
            fill
            priority
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: "90px",
            gap: "20px",
          }}
        >
          <Button
            disableElevation
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
              minWidth: "330px",
              width: "100%",
            }}
            onClick={() => {
              router.push("/");
            }}
            startIcon={<Home />}
          >
            Back to Home
          </Button>
          <Button
            disableElevation
            size="large"
            type="submit"
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: "100px",
              padding: "12px 0",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 700,
              minWidth: "330px",
              width: "100%",
            }}
            onClick={() => {
              router.push("/login");
            }}
            startIcon={<Login />}
          >
            Back to Login
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default ErrorPageNotFound;
