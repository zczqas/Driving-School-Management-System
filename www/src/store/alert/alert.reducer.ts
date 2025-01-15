const INITIAL_STATE = {
  openAlert: false,
  message: "",
  severity: "",
};

const alertReducer = (state = INITIAL_STATE, action: { type: any; payload: any; }) => {
  const { type, payload } = action;

  switch (type) {
    case "OPEN_ALERT":
      return {
        openAlert: true,
        message: payload.message,
        severity: payload.severity,
      };
    case "CLOSE_ALERT":
      return { ...state, openAlert: false };
    default:
      return state;
  }
};

export default alertReducer;
