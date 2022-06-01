import * as React from "react";
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
  maxSemesters,
}) {
  const handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;

    if (value < 1) value = 1;
    if (name === "semester" && value > maxSemesters) value = maxSemesters;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Batch</DialogTitle>
      <DialogContent>
        <form action="/" method="POST" onSubmit={(e) => e.preventDefault}>
          <TextField
            autoFocus
            margin="dense"
            name="number"
            label="Batch(N)"
            type="number"
            fullWidth
            variant="standard"
            value={inputs.number || ""}
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>CANCEL</Button>
        <Button onClick={handleSubmit}>ADD</Button>
      </DialogActions>
    </Dialog>
  );
}
