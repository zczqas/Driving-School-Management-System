import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SnackbarProvider, useSnackbar } from "notistack";
import { closeAlert } from "../store/alert/alert.actions";

interface Props {
  position?: any;
  alert?: any;
  onCloseAlert?: () => void;
}

// ============================|| CUSTOM ALERT ||============================ //

const CustomAlert = ({
  position = { vertical: "bottom", horizontal: "right" },
}: Props) => {
  const { openAlert, severity, message } = useSelector(
    (state: any) => state.alert
  );

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const alertShownRef = React.useRef(false); // Ref to track if alert has been shown

  React.useEffect(() => {
    if (openAlert && !alertShownRef.current) {
      enqueueSnackbar(message, {
        variant: severity,
        anchorOrigin: position,
        autoHideDuration: 3000,
        onClose: () => {
          dispatch(closeAlert());
          alertShownRef.current = false; // Reset ref after alert is closed
        },
      });
      alertShownRef.current = true; // Set ref to true after showing alert
    }
  }, [openAlert, severity, message, position, enqueueSnackbar, dispatch]);

  return null; // No need to return a component as notistack handles it
};

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <CustomAlert />
    </SnackbarProvider>
  );
}
