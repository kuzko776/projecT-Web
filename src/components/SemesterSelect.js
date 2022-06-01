import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function SemesterSelect({ list, value, onSemesterChange }) {
  return (
    <Autocomplete
      id="grouped-demo"
      options={list}
      groupBy={(option) => option.depName}
      getOptionLabel={(option) => "Semester " + option.number}
      value={value}
      sx={{ width: 300 }}
      onChange={(event, newValue) => {
        onSemesterChange(newValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={value ? value.depName : "Select Semester"} />
      )}
    />
  );
}
