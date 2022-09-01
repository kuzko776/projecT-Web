import { useEffect, useState } from "react";

//firebase
import db from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// material
import { Card, Stack, Button, Container, Typography, Box } from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import DepartmentSelect from "../components/DepartmentSelect";
import SubjectDialog from "../layout/Dashboard/form_dialogs/SubjectDialog";
import AdvancedAlert from "../components/AdvancedAlert";
import ModifyButton from "../components/ModifyButton";

//helpers
import {
  handleDocChange,
  onCellEditCommit,
  handleRemoveDoc,
  getDocuments,
  onSubjectNameCellEditCommit,
} from "../helpers/DashboardHelper";

const DEAFULT_INPUT = { hasLab: false };

export default function Subjects() {
  const [subjectList, setSubjectList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedDep, setSelectedDep] = useState(null);
  const [depList, setDepList] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState(DEAFULT_INPUT);
  const [alertOpen, setAlertOpen] = useState(false);
  const [msgType, setMsgType] = useState(null);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  //refrences
  const depCollection = collection(db, "departments");
  const staffCollection = collection(db, "staff");
  const subjectCollection = selectedDep
    ? collection(depCollection, selectedDep.id.toString(), "subjects")
    : null;

  useEffect(() => handleDocChange(depCollection, setDepList), []);

  useEffect(() => getDocuments(staffCollection, setStaffList), []);

  useEffect(
    () => handleDocChange(subjectCollection, setSubjectList),
    [selectedDep]
  );

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: true,
      preProcessEditCellProps: (params) => {
        const value = params.props.value;
        const isValid = value.match(/^.+$/) && value.length < 50;
        return { ...params.props, error: !isValid };
      },
    },
    {
      field: "semester",
      headerName: "Semester",
      width: 150,
      editable: true,
      type: "number",
      preProcessEditCellProps: (params) => {
        const value = params.props.value;

        const isValid = value <= selectedDep.semesters && value > 0;
        return { ...params.props, error: !isValid };
      },
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 150,
      editable: true,
      type: "number",
      preProcessEditCellProps: (params) => {
        const value = params.props.value;
        const isValid = value <= 10 && value > 0;
        return { ...params.props, error: !isValid };
      },
    },
    {
      field: "teacher",
      headerName: "Teacher",
      width: 150,
      type: "text",
      valueGetter: (params) => {
        return params.row.teacher.name;
      },
    },
    {
      field: "hasLab",
      headerName: "Has Lab",
      width: 150,
      type: "boolean",
    },
  ];

  const handleDepChange = (dep) => {
    setSelectedDep(dep);
  };

  const handleSubmit = () => {
    try {
      const fixedInput = Object.assign(inputs, {
        semester: parseInt(inputs.semester),
      });
      const docRef = addDoc(subjectCollection, fixedInput);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setOpen(false);
      setInputs({});
    }
  };

  return (
    <Container>
      <Card sx={{ paddingTop: 2 }}>
        <Box>
          <Stack alignItems="center">
            <Typography variant="h3" gutterBottom>
              Subjects
            </Typography>
          </Stack>

          <SubjectDialog
            open={open}
            inputs={inputs}
            setInputs={setInputs}
            staffList={staffList}
            handleClose={() => setOpen(false)}
            handleSubmit={handleSubmit}
            maxSemesters={selectedDep?.semesters}
          />

          <Stack
            direction={matches ? "column" : "row-reverse"}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            m={2}
          >
            <ModifyButton
              type={"Subject"}
              selectionModel={selectionModel}
              onClicked={(type) => {
                if (type === "add") {
                  if (selectedDep) setOpen(true);
                  else {
                    setMsgType("Please select a department first.");
                    setAlertOpen(true);
                  }
                } else if (type === "delete") {
                  setMsgType("delete");
                  setAlertOpen(true);
                  handleRemoveDoc(selectionModel, subjectCollection);
                }
              }}
            />

            <DepartmentSelect
              list={depList}
              value={selectedDep}
              onDepChange={handleDepChange}
            />
          </Stack>
        </Box>

        <Box
          sx={{
            height: "80vh",

            "& .MuiDataGrid-cell--editing": {
              bgcolor: "rgb(255,215,115, 0.19)",
              color: "#1a3e72",
              "& .MuiInputBase-root": {
                height: "100%",
              },
            },
            "& .Mui-error": {
              bgcolor: (theme) =>
                `rgb(126,10,15, ${theme.palette.mode === "dark" ? 0 : 0.1})`,
              color: (theme) =>
                theme.palette.mode === "dark" ? "#ff4343" : "#750f0f",
            },
          }}
        >
          <DataGrid
            checkboxSelection
            disableSelectionOnClick
            rows={subjectList}
            columns={columns}
            selectionModel={selectionModel}
            onCellEditCommit={(params) => {
              setMsgType("update");
              if (params.field === "name")
                onSubjectNameCellEditCommit(params, params.id);
              onCellEditCommit(params, setAlertOpen, subjectCollection);
            }}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Box>
      </Card>
      <AdvancedAlert
          open={alertOpen}
          msgType={msgType}
          handleClose={() => {
            setAlertOpen(false);
          }}
        />
    </Container>
  );
}
