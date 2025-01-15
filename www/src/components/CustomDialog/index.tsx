import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Divider, IconButton, Slide } from "@mui/material";
import {
  CloseOutlined,
  ZoomInMapRounded,
  ZoomOutMapRounded,
} from "@mui/icons-material";
import { lato } from "@/themes/typography";
import { TransitionProps } from "@mui/material/transitions";

interface Props {
  handleClose: () => void;
  handleAccept: () => void;
  open: boolean;
  dialogTitle?: string;
  children: React.ReactNode;
  isFormikForm?: boolean;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  isSubmitOnTop?: boolean;
  isNotAForm?: boolean;
  fullscreen?: boolean;
  loading?: boolean;
}

export default function CustomDialog({
  handleClose,
  handleAccept,
  open,
  children,
  dialogTitle,
  isFormikForm,
  fullWidth = false,
  maxWidth = "md",
  isSubmitOnTop = false,
  isNotAForm = false,
  fullscreen = false,
  loading = false,
  ...rest
}: Props) {
  const [isFullScreen, setIsFullScreen] = React.useState(fullscreen);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        scroll={"paper"}
        fullScreen={isFullScreen}
        // disableBackdropClick={loading}
      >
        {dialogTitle && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 18px",
              }}
            >
              <DialogTitle
                id="alert-dialog-title"
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  fontFamily: lato.style.fontFamily,
                }}
              >
                {dialogTitle}
              </DialogTitle>

              {isSubmitOnTop ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    disableElevation
                    size="large"
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "175px",
                      width: "100%",
                      mr: 2,
                    }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    disableElevation
                    size="large"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "175px",
                      width: "100%",
                    }}
                    onClick={handleAccept}
                    type="submit"
                  >
                    Confirm
                  </Button>
                </Box>
              ) : (
                <Box>
                  <IconButton
                    onClick={() => {
                      setIsFullScreen(!isFullScreen);
                    }}
                  >
                    {isFullScreen ? (
                      <ZoomInMapRounded />
                    ) : (
                      <ZoomOutMapRounded />
                    )}
                  </IconButton>
                  <IconButton onClick={handleClose}>
                    <CloseOutlined />
                  </IconButton>
                </Box>
              )}
            </Box>
            {/* <Divider /> */}
          </>
        )}
        {/* <Box
          sx={{
            padding: "30px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        > */}
        <DialogContent dividers>{children}</DialogContent>
        {/* </Box> */}
        {isFormikForm || isSubmitOnTop || isNotAForm ? null : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "40px",
            }}
          >
            <Button
              disableElevation
              size="large"
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: "100px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "175px",
                width: "100%",
                mr: 2,
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              disableElevation
              size="large"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "100px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "175px",
                width: "100%",
              }}
              onClick={handleAccept}
              type="submit"
              disabled={loading}
            >
              Confirm
            </Button>
          </Box>
        )}
      </Dialog>
    </React.Fragment>
  );
}
