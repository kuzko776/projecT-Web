import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function BatchSelect({ list, value, onBoardChange }) {
  return (
    <Autocomplete
      id="grouped-demo"
      options={list}
      getOptionLabel={(option) => "Semester " + option.semester + ", " +option.type}
      value={value}
      sx={{ width: 300 }}
      onChange={(event, newValue) => {
        onBoardChange(newValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={value ? value.depName : "Select Board Marks"} />
      )}
    />
  );
}
