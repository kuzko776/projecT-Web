import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import db from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
// material
import { Card, Stack, Button, Container, Typography, Box } from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import DepartmentSelect from "../components/DepartmentSelect";
import BatchDialog from "../layout/Dashboard/form_dialogs/BatchDialog";
import AdvancedAlert from "../components/AdvancedAlert";

import ModifyButton from "../components/ModifyButton";

import { margin, padding, styled } from "@mui/system";

//helpers
import {
  handleDocChange,
  onCellEditCommit,
  handleRemoveDoc,
} from "../helpers/DashboardHelper";

const DEAFULT_INPUT = { semester: 1, number: 1 };

export default function Batchs() {
  const [batchList, setBatchList] = useState([]);
  const [selectedDep, setSelectedDep] = useState(null);
  const [depList, setDepList] = useState([]);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [msgType, setMsgType] = useState(null);
  const [inputs, setInputs] = useState(DEAFULT_INPUT);
  const [selectionModel, setSelectionModel] = useState([]);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  //refrences
  const depCollection = collection(db, "departments");
  const batchCollection = selectedDep
    ? collection(depCollection, selectedDep.id.toString(), "batchs")
    : null;

  useEffect(() => handleDocChange(depCollection, setDepList), []);

  useEffect(
    () => handleDocChange(batchCollection, setBatchList),
    [selectedDep]
  );

  const columns = [
    {
      field: "number",
      headerName: "Batch(N)",
      width: 150,
      type: "number",
    },
    {
      field: "semester",
      headerName: "Semester(N)",
      width: 150,
      editable: true,
      type: "number",
      preProcessEditCellProps: (params) => {
        const value = params.props.value;
        const isValid = value <= selectedDep.semesters && value > 0;
        return { ...params.props, error: !isValid };
      },
    },
  ];

  const handleDepChange = (dep) => {
    setSelectedDep(dep);
  };

  const handleSubmit = () => {
    try {
      const editedInput = Object.assign(inputs, {
        depName: selectedDep.name,
        semester: parseInt(inputs.semester),
      });
      const docRef = addDoc(batchCollection, editedInput);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setOpen(false);
      setInputs(DEAFULT_INPUT);
    }
  };

  return (
    <Container>
      <AdvancedAlert
          open={alertOpen}
          msgType={msgType}
          handleClose={() => {
            setAlertOpen(false);
          }}
        />
      <Card sx={{ paddingTop: 2 }}>
        <Box>
          <Stack alignItems="center">
            <Typography variant="h3" gutterBottom>
              Batchs
            </Typography>
          </Stack>

          <BatchDialog
            open={open}
            inputs={inputs}
            setInputs={setInputs}
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
              type={"Batch"}
              selectionModel={selectionModel}
              onClicked={(type) => {
                if (type === "add") {
                  if (selectedDep) setOpen(true);
                  else {
                    setMsgType("Please select a batch first.");
                    setAlertOpen(true);
                  }
                } else if (type === "delete") {
                  setMsgType("delete");
                  setAlertOpen(true);
                  handleRemoveDoc(selectionModel, batchCollection);
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
            width: 1,
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
            rows={batchList}
            columns={columns}
            selectionModel={selectionModel}
            onCellEditCommit={(params) => {
              setMsgType("update");
              onCellEditCommit(params, setAlertOpen, batchCollection);
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
    </Container>
  );
}
