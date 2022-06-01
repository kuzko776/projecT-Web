import * as React from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


export default function DepartmentSelect({list, value, onDepChange}) {
  return (
    <div>
      <Autocomplete
        disablePortal
        options={list}
        value={value}
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          onDepChange(newValue)
        }}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Department" />}
      />
    </div>
  );
}