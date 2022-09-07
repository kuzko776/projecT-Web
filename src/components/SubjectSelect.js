import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SubjectSelect({ list, value, onSubjectChange }) {
  return (
    <Autocomplete
      id="grouped-demo"
      options={list}
      getOptionLabel={(option) => option.name}
      value={value}
      sx={{ width: 300 }}
      onChange={(event, newValue) => {
        onSubjectChange(newValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={value ? value.name : "Select Subject"} />
      )}
    />
  );
}
