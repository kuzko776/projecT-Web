import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Checkbox, FormControlLabel } from "@mui/material";

const MAX_HOURS = 10;

export default function FormDialog({
  open,
  handleClose,
  handleSubmit,
  inputs,
  setInputs,
  staffList,
  maxSemesters,
}) {
  const [validName, setValidName] = useState(true);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "semester") {
      if (value < 1) value = 1;
      else if (value > maxSemesters) value = maxSemesters;
    }

    if (name === "hours") {
      if (value < 1) value = 1;
      else if (value > MAX_HOURS) value = MAX_HOURS;
    }

    setInputs((values) => ({ ...values, [name]: value }));

    switch (name) {
      case "name":
        validateName(value);
        break;
    }
  };

  const handleCheckBoxChange = (event) => {
    const name = event.target.name;
    const value = event.target.checked;
    setInputs((values) => ({ ...values, [name]: value }));
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

  const validForm = validName && inputs.name && inputs.hours && inputs.semester && inputs.teacher;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Subject</DialogTitle>
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

          <TextField
            margin="dense"
            name="semester"
            label="Semester(N)"
            type="number"
            fullWidth
            variant="standard"
            value={inputs.semester || ""}
            onChange={handleChange}
          />

          <TextField
            autoFocus
            margin="dense"
            name="hours"
            label="Hours"
            type="number"
            fullWidth
            variant="standard"
            value={inputs.hours || ""}
            onChange={handleChange}
          />

          <Autocomplete
            disablePortal
            options={staffList}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              setInputs((values) => ({ ...values, teacher: newValue }));
            }}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Teacher" />}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={inputs?.hasLab ?? false}
                onChange={handleCheckBoxChange}
                name="hasLab"
              />
            }
            label="Has Lab?"
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
