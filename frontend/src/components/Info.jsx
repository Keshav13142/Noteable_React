import React, { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import { UserContext } from "../contexts/UserContext";
import MuiAlert from "@mui/material/Alert";

export const Info = () => {
  //Define the filled Alert component
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  //Get the global state variables
  const { info, setInfo } = useContext(UserContext);

  //Executes when the close button on the alert is clicked
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    //Reset global state after closing
    setInfo({ open: false, message: "", type: "info" });
  };
  return (
    <>
      <Snackbar
        //Define the position of the alert
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
