import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { InputAdornment, inputClasses } from "@mui/material";

const STUDENT_ID_LENGTH = 3;
const LAB_GROUP_LENGTH = 1;

export default function FormDialog({
  open,
  handleClose,
  handleSubmit,
  inputs,
  setInputs,
}) {
  const [validName, setValidName] = useState(true);
  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [validId, setValidId] = useState(true);
  const [idErrorMsg, setIdErrorMsg] = useState("");
  const [validPhone, setValidPhone] = useState(true);
  const [phoneErrorMsg, setPhoneErrorMsg] = useState("");
  const [validLabGroup, setValidLabGroup] = useState(true);
  const [labGroupErrorMsg, setLabGroupErrorMsg] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "phone" && value.length > 9) return;
    if (name === "id" && value.length > STUDENT_ID_LENGTH) return;
    if (name === "labGroup") {
      value = value.toUpperCase();
      if (value.length > LAB_GROUP_LENGTH) return;
    }

    setInputs((values) => ({ ...values, [name]: value }));

    switch (name) {
      case "name":
        validateName(value);
        break;
      case "phone":
        validatePhone(value);
        break;
      case "id":
        validateId(value);
        break;
      case "labGroup":
        validateLabGroup(value);
        break;
    }
  };

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

  const validatePhone = (value) => {
    var phoneRE = /^\d{9}$/;
     if (!value.match(phoneRE)) {
      setValidPhone(false);
      setPhoneErrorMsg("Please Enter a valid phone number.");
    } else {
      setValidPhone(true);
    }
  };

  const validateId = (value) => {
    var phoneRE = /^\d{3}$/;
    if (value.length < STUDENT_ID_LENGTH) {
      setValidId(false);
      setIdErrorMsg("ID must be " + STUDENT_ID_LENGTH + " digits.");
    } else if (!value.match(phoneRE)) {
      setValidId(false);
      setIdErrorMsg("Please Enter a valid ID.");
    } else {
      setValidId(true);
    }
  };

  const validateLabGroup = (value) => {
    var labGroupRE = /^[A-Z]$/;
     if (!value.match(labGroupRE)) {
      setValidLabGroup(false);
      setLabGroupErrorMsg("Please Enter one [A-Z] character.");
    } else {
      setValidLabGroup(true);
    }
  };

  const validForm = validId && inputs.id && validName && inputs.name && validPhone && inputs.phone && validLabGroup && inputs.labGroup;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Student</DialogTitle>
      <DialogContent>
        <form action="/" method="POST" onSubmit={(e) => e.preventDefault}>
          <TextField
            autoFocus
            margin="dense"
            name="id"
            label="id"
            fullWidth
            error={!validId}
            helperText={validId ? null : idErrorMsg}
            variant="standard"
            value={inputs.id}
            onChange={handleChange}
          />
          <TextField
            autoFocus
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
            name="phone"
            label="phone"
            type="phone"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+249</InputAdornment>
              ),
            }}
            fullWidth
            error={!validPhone}
            helperText={validPhone ? null : phoneErrorMsg}
            variant="standard"
            value={inputs.phone || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="labGroup"
            label="Lab Group"
            type="text"
            fullWidth
            error={!validLabGroup}
            helperText={validLabGroup ? null : labGroupErrorMsg}
            variant="standard"
            value={inputs.labGroup || ""}
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
