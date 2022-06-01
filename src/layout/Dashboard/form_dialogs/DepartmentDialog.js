//react
import { useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { values } from "lodash";

export default function FormDialog({
  open,
  handleClose,
  handleSubmit,
  inputs,
  setInputs,
}) {
  const [validName, setValidName] = useState(true);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "semesters") {
      if (value > 16) value = 16;
      if (value < 1) value = 1;
    }
    setInputs((values) => ({ ...values, [name]: value }));

    if (name === "name") validateName(value);
  };

  const validateName = (value) => {
    var nameRE = /^.+$/;
    if (!value.match(nameRE)) {
      setValidName(false);
      setNameErrorMsg("Please Enter a valid name.");
    } else if (value.length > 50) {
      setValidName(false);
      setNameErrorMsg("Name must be less than 50 character.");
    } else {
      setValidName(true);
    }
  };

  const validForm = validName && inputs.name && inputs.semesters;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Department</DialogTitle>
      <DialogContent>
        <form action="/" method="POST" onSubmit={(e) => e.preventDefault}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="name"
            fullWidth
            error={!validName}
            helperText={validName ? null : nameErrorMsg}
            variant="standard"
            value={inputs.name || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="semesters"
            label="Semesters"
            type="number"
            fullWidth
            variant="standard"
            value={inputs.semesters || ""}
            onChange={handleChange}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>CANCEL</Button>
        <Button
          onClick={() => {
            if (validForm) {
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
