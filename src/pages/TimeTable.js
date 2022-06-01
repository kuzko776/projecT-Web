import * as React from "react";
import { useState, useEffect } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import db from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { Box } from "@mui/system";

// material
import { Stack, Paper, Grid, Typography, Card, Container } from "@mui/material";

import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import { connectProps } from "@devexpress/dx-react-core";

//iconify
import { Icon } from "@iconify/react";

//scheudlar
import {
  Scheduler,
  WeekView,
  Appointments,
  DragDropProvider,
  AppointmentForm,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";

import TimeTableDialog from "../layout/Dashboard/form_dialogs/TimeTableDialog";
import CommandLayout from "../components/SchedulerCommandLayout";

//helpers
import {
  convertTimeTableFromFirebase,
  convertToFirebase,
  createSemesterList,
} from "../helpers/TypeConverterHelper";

//helpers
import { handleDocChange } from "../helpers/DashboardHelper";

//other componenets
import SemesterSelect from "../components/SemesterSelect";

const Appointment = ({ children, style, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: restProps.data.lab ? "#3366FF" : "#00AB55",
      borderRadius: "8px",
    }}
  >
    {restProps.data.lab && (
      <Typography
        sx={{ textAlign: "center", color: "white" }}
        variant="subtitle2"
        component="div"
      >
        Lab({restProps.data.labGroup})
      </Typography>
    )}

    {children}
  </Appointments.Appointment>
);

const Content = ({ children, appointmentData, ...restProps }) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Grid container alignItems="center">
      <Grid item xs={2} sx={{ textAlign: "center" }}>
        <Icon icon="fluent:building-bank-16-regular" width="24" height="24" />
      </Grid>
      <Grid item xs={10}>
        <span>{appointmentData.hall}</span>
      </Grid>
      <Grid item xs={2} sx={{ textAlign: "center" }}>
        <Icon icon="la:chalkboard-teacher" width="24" height="24" />
      </Grid>
      <Grid item xs={10}>
        <span>{appointmentData?.teacherName}</span>
      </Grid>
    </Grid>
  </AppointmentTooltip.Content>
);

export default function Timetable() {
  const [data, setData] = useState([]);
  const [currentDate, setCurrentDate] = useState("2019-06-27");
  const [semesterList, setSemesterList] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [validForm, setValidForm] = useState(false);
  const [timetableDialog, setTimetableDialog] = useState({});

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const formProps = connectProps(TimeTableDialog, () => {
      return {
        depId: selectedSemester?.depId,
        semesterNum: selectedSemester?.number,
        validateForm: setValidForm,
      };
    });
    setTimetableDialog({ dialog: formProps });
  }, [selectedSemester]);

  const saveButtonProps = connectProps(CommandLayout, () => {
    return {
      disableSave: !validForm,
    };
  });

  //refrences
  const depCollection = collection(db, "departments");
  const timetableRef = selectedSemester
    ? collection(depCollection, selectedSemester?.depId, "Timetable")
    : null;

  const timetableRefQuery = selectedSemester
    ? query(timetableRef, where("semester", "==", selectedSemester.number))
    : null;

  const handleSemesterSelect = (semester) => {
    setData([]);
    setSelectedSemester(semester);
  };

  useEffect(
    () =>
      handleDocChange(depCollection, (listData) =>
        setSemesterList(createSemesterList(listData))
      ),
    []
  );

  useEffect(() => {
    setValidForm(!validForm);
    console.log(validForm);
  }, [selectedSemester]);

  useEffect(
    () =>
      handleDocChange(timetableRefQuery, (listData) => {
        setData(convertTimeTableFromFirebase(listData));
      }),
    [selectedSemester]
  );

  const handleSubmit = (inputs) => {
    try {
      addDoc(timetableRef, inputs);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleUpdate = (id, inputs) => {
    try {
      setDoc(doc(timetableRef, id.toString()), inputs);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const commitChanges = ({ added, changed, deleted }) => {
    let newData = data.concat();
    if (changed && added) {
      handleUpdate(added.tempId, convertToFirebase(added));
    } else if (added) {
      handleSubmit(convertToFirebase(added));
    } else if (changed) {
    }

    if (deleted !== undefined) {
      newData = newData.filter((appointment) => appointment.id !== deleted);
    }
    setData(newData);
  };

  return (
    <Container
      sx={{
        ".css-1pdu5xc.Container-container": {
          height: 0,
        },
        ".css-jrrpff.Layout-root": {
          maxWidth: 650,
        },
      }}
    >
      <Card sx={{ paddingTop: 2, }}>
        <Box>
          <Stack alignItems="center">
            <Typography variant="h3" gutterBottom>
              Timetable
            </Typography>
          </Stack>

          <Stack alignItems={matches ? "center" : "start"} m={2}>
            <SemesterSelect
              list={semesterList}
              value={selectedSemester}
              onSemesterChange={handleSemesterSelect}
            />
          </Stack>
        </Box>

        {selectedSemester && (
          <Scheduler data={data}>
            <ViewState defaultCurrentDate={currentDate} />
            <EditingState onCommitChanges={commitChanges} />
            <IntegratedEditing />
            <WeekView
              startDayHour={0}
              endDayHour={24}
              sx={{ backgroundColor: "FFAAFF" }}
            />
            <Appointments appointmentComponent={Appointment} />
            <AppointmentTooltip
              showOpenButton
              showDeleteButton
              contentComponent={Content}
            />
            <DragDropProvider
              draftAppointmentComponent={({ style, data, ...restProps }) => {
                return (
                  <DragDropProvider.DraftAppointment
                    style={{
                      ...style,
                      backgroundColor: data.lab ? "#3366FF" : "#00AB55",
                      borderRadius: "8px",
                    }}
                    data={data}
                    {...restProps}
                  >
                    {data.lab && (
                      <Typography
                        sx={{ textAlign: "center", color: "white" }}
                        variant="subtitle2"
                        component="div"
                      >
                        Lab({data.labGroup})
                      </Typography>
                    )}
                  </DragDropProvider.DraftAppointment>
                );
              }}
            />

            <AppointmentForm
              basicLayoutComponent={timetableDialog.dialog}
              commandLayoutComponent={saveButtonProps}
              recurrenceLayoutComponent={() => {
                return <div></div>;
              }}
            />
          </Scheduler>
        )}
      </Card>
    </Container>
  );
}
