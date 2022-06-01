import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function BatchSelect({ list, value, onBatchChange }) {
  return (
    <Autocomplete
      id="grouped-demo"
      options={list}
      groupBy={(option) => option.depName}
      getOptionLabel={(option) => "Batch " + option.number}
      value={value}
      sx={{ width: 300 }}
      onChange={(event, newValue) => {
        onBatchChange(newValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={value ? value.depName : "Select Batch"} />
      )}
    />
  );
}
