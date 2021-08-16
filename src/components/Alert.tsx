import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

const AlertComponent = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Alert: React.FC<{
  open: boolean;
  handleClose: () => void;
  message: string;
  color: string;
}> = (props) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={6000}
      onClose={props.handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <AlertComponent
        onClose={props.handleClose}
        severity={props.color === "green" ? "success" : "error"}
      >
        {props.message}
      </AlertComponent>
    </Snackbar>
  );
};

export default Alert;
