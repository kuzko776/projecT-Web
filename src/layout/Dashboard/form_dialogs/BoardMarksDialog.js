//react
import { useState } from "react";

import {
  FormControl,
  DialogTitle,
  DialogContent,
  Dialog,
  Button,
  InputLabel,
  Select,
  Autocomplete,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  TextField,
} from "@mui/material";
import { values } from "lodash";


export default function FormDialog({
  open,
  handleClose,
  handleSubmit,
  inputs,
  setInputs,
}) {
  return (
    <form action="/" method="POST" onSubmit={(e) => e.preventDefault()}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Board</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Stack>
            <Autocomplete
              defaultValue={1}
              options={Array.from({ length: 100 }, (_, i) => i + 1)}
              getOptionLabel={(option) => "Semester " + option}
              onChange={(event,newValue) =>
                setInputs((values) => ({
                  ...values,
                  semester: newValue,
                }))
              }
              sx={{ width: 300, my: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Semester" />
              )}
            />

            <ToggleButtonGroup
              sx={{ m: "auto" }}
              color="primary"
              value={inputs.type}
              exclusive
              onChange={(event, newAlignment) =>
                setInputs((values) => ({
                  ...values,
                  type: newAlignment,
                }))
              }
            >
              <ToggleButton value="final">Final</ToggleButton>
              <ToggleButton value="re-exam">Re-exam</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCEL</Button>
          <Button onClick={handleSubmit}>ADD</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
