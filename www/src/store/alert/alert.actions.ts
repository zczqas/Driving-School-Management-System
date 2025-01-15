import { AlertColor } from "@mui/material";

export const openAlert = (message: string, severity: AlertColor) => ({
  type: "OPEN_ALERT",
  payload: { message, severity },
});
export const closeAlert = () => ({
  type: "CLOSE_ALERT",
});
