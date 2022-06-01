//react
import { useState, useEffect } from "react";

// material
import {
  TextField,
  Container,
  FormControlLabel,
  Checkbox,
  Stack,
  Autocomplete,
} from "@mui/material";

import { LocalizationProvider, TimePicker } from "@mui/lab";

import DateAdapter from "@mui/lab/AdapterDateFns";

//firebase
import db from "../../../firebase";
import { collection, query, where } from "firebase/firestore";

import { handleDocChange } from "../../../helpers/DashboardHelper";

const LAB_GROUP_LENGTH = 1;

export default function TimeTableDialog({
  onFieldChange,
  appointmentData,
  resources,
  depId,
  semesterNum,
  validateForm,
}) {
  const [subjectList, setSubjectList] = useState([]);
  const [labAvailable, setLabAvailable] = useState(false);
  const [validHall, setValidHall] = useState(true);
  const [hallErrorMsg, setHallErrorMsg] = useState("");
  const [validLabGroup, setValidLabGroup] = useState(true);
  const [labGroupErrorMsg, setLabGroupErrorMsg] = useState("");
  const [validStartDate, setValidStartDate] = useState(true);
  const [validEndDate, setValidEndDate] = useState(true);

  //refrences
  const depCollection = collection(db, "departments");
  const subjectCollectionQuery = depId
    ? query(
        collection(depCollection, depId, "subjects"),
        where("semester", "==", semesterNum)
      )
    : null;

  useEffect(
    () => handleDocChange(subjectCollectionQuery, setSubjectList),
    [depId]
  );

  useEffect(() => {
    const subject = getCurrentSubject();
    setLabAvailable(subject?.hasLab ?? false);
  }, [subjectList]);

  const validForm =
    validHall &&
    appointmentData.hall &&
    appointmentData.name &&
    validStartDate &&
    appointmentData.startDate &&
    validEndDate &&
    appointmentData.endDate &&
    (appointmentData.lab ? validLabGroup && appointmentData.labGroup : true);

  useEffect(() => validateForm(validForm), [validForm]);

  const validateHall = (value) => {
    var hallRE = /^.+$/;
    if (!value.match(hallRE)) {
      setValidHall(false);
      setHallErrorMsg("Please Enter a valid hall.");
    } else if (value.length > 40) {
      setValidHall(false);
      setHallErrorMsg("Hall must be less than 40 character.");
    } else {
      setValidHall(true);
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

  const handleChange = (event) => {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "labGroup") {
      value = value.toUpperCase();
      if (value.length > LAB_GROUP_LENGTH) return;
    }
    onFieldChange({ [name]: value });

    switch (name) {
      case "hall":
        validateHall(value);
        break;
      case "labGroup":
        validateLabGroup(value);
        break;
    }
  };

  const handleCheckBoxChange = (event) => {
    const name = event.target.name;
    const value = event.target.checked;
    onFieldChange({ [name]: value });
  };

  const getCurrentSubject = () => {
    let subject;
    subjectList.forEach((item) => {
      if (item.id == appointmentData.subjectId) {
        subject = item;
        return;
      }
    });
    return subject;
  };

  return (
    <Container>
      <Stack spacing={2}>
        <Autocomplete
          options={subjectList}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            setLabAvailable(newValue?.hasLab ?? false);
            onFieldChange({
              name: newValue?.name,
              teacherId: newValue?.teacher.id,
              teacherName: newValue?.teacher.name,
              semester: newValue?.semester,
              subjectId: newValue?.id,
            });
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          value={getCurrentSubject() ?? null}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Subject" />}
        />

        <LocalizationProvider dateAdapter={DateAdapter}>
          <Stack spacing={2}>
            <TimePicker
              label="Start Time"
              value={appointmentData.startDate}
              onChange={(date) => {
                onFieldChange({ startDate: date });
              }}
              onError={() => setValidStartDate(false)}
              onAccept={() => setValidStartDate(true)}
              renderInput={(params) => <TextField {...params} />}
            />

            <TimePicker
              label="End Time"
              value={appointmentData.endDate}
              onChange={(date) => onFieldChange({ endDate: date })}
              onError={() => setValidEndDate(false)}
              onAccept={() => setValidEndDate(true)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>

        <TextField
          margin="normal"
          name="hall"
          label="Hall"
          type="name"
          fullWidth
          error={!validHall}
          helperText={validHall ? null : hallErrorMsg}
          variant="standard"
          value={appointmentData.hall || ""}
          onChange={handleChange}
        />

        {labAvailable && (
          <Stack>
            <FormControlLabel
              control={
                <Checkbox
                  name="lab"
                  checked={appointmentData?.lab ?? false}
                  onChange={handleCheckBoxChange}
                />
              }
              label="Is Lab?"
            />

            <TextField
              margin="dense"
              name="labGroup"
              label="Lab group"
              type="text"
              fullWidth
              error={!validLabGroup}
              helperText={validLabGroup ? null : labGroupErrorMsg}
              variant="standard"
              disabled={!appointmentData?.lab ?? false}
              value={appointmentData.labGroup || ""}
              onChange={handleChange}
            />
          </Stack>
        )}
      </Stack>
    </Container>
    // </AppointmentForm.BasicLayout>
  );
}
