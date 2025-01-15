import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  handleClose: () => void;
  handleAccept: () => void;
  open: boolean;
  dialogTitle?: string;
  children: React.ReactNode;
  isFormikForm?: boolean;
}

export default function CustomDialog({
  handleClose,
  handleAccept,
  open,
  children,
  dialogTitle,
  isFormikForm,
  ...rest
}: Props) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {dialogTitle && (
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              fontSize: "1.5rem",
            }}
          >
            {dialogTitle}
          </DialogTitle>
        )}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        {isFormikForm ? null : (
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAccept} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
