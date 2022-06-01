import * as React from "react";
import { useField } from 'formik';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function TagsAutoComplete({...props }) {

  const [field, meta, helpers] = useField(props.name);

  const { setValue } = helpers;
  return (
    <Autocomplete
      {...props}
      multiple
      id="tags-standard"
      onChange={(event,value)=>{setValue(value)}}
      groupBy={(option) => option.depName}
      getOptionLabel={(option) => option.depName + " " + option.number}
      renderInput={(params) => (
        <TextField {...params} variant="standard" label="Send to" />
      )}
    />
  );
}
