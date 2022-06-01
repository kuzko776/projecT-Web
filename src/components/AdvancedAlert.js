import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdvancedAlert({ open, handleClose, msgType }) {
  var type, msg;

  switch (msgType) {
    case "update":
      type = "success";
      msg = "Updated Successfuly";
      break;
    case "delete":
      type = "error";
      msg = "Items has been deleted";
      break;
    default:
      type = "warning";
      msg = msgType;
  }
  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {msg}
      </Alert>
    </Snackbar>
  );
}
