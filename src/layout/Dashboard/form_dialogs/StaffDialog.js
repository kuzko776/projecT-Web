import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormDialog({
  open,
  handleClose,
  handleSubmit,
  inputs,
  setInputs,
}) {
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    validateName(value);
  };

  const [validName, setValidName] = useState(true);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const validateName = (value) => {
    var nameRE = /^.+$/;
    if (!value.match(nameRE)) {
      setValidName(false);
      setNameErrorMsg("Please Enter a valid name.");
    } else if (value.length > 60) {
      setValidName(false);
      setNameErrorMsg("Name must be less than 60 character.");
    } else {
      setValidName(true);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Teacher</DialogTitle>
      <DialogContent>
        <form action="/" method="POST" onSubmit={(e) => e.preventDefault}>
          <TextField
            margin="dense"
            name="name"
            label="name"
            type="name"
            fullWidth
            error={!validName}
            helperText={validName ? null : nameErrorMsg}
            variant="standard"
            value={inputs.name || ""}
            onChange={handleChange}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>CANCEL</Button>
        <Button
          onClick={() => {
            if (validName && inputs.name) {
              handleSubmit();
            }
          }}
        >
          ADD
        </Button>
      </DialogActions>
    </Dialog>
  );
}
