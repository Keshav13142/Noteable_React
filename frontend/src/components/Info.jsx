import React, { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import { UserContext } from "../contexts/UserContext";
import MuiAlert from "@mui/material/Alert";

export const Info = () => {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const { info, setInfo } = useContext(UserContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setInfo({ open: false, message: "", type: "info" });
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={info.open}
        autoHideDuration={1700}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={info.type}
          sx={{ width: "100%" }}
        >
          {info.message}
        </Alert>
      </Snackbar>
    </>
  );
};
