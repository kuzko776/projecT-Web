import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, createTheme } from "@mui/material/styles";
import db from "../firebase";
import {
  collection,
  addDoc,
} from "firebase/firestore";


// material
import { Card, Stack, Container, Typography, Box } from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import DepartmentDialog from "../layout/Dashboard/form_dialogs/DepartmentDialog";
import AdvancedAlert from "../components/AdvancedAlert";

//helpers
import {
  handleDocChange,
  onCellEditCommit,
  handleRemoveDoc,
  onDepNameCellEditCommit,
} from "../helpers/DashboardHelper";
import ModifyButton from "../components/ModifyButton";

const columns = [
  //{ field: 'id', headerName: 'ID', width: 150, filterable: false },
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
    field: "semesters",
    headerName: "Semesters",
    width: 150,
    type: "number",
  },
];

export default function Departments() {
  const [departmentList, setDepartmentList] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [msgType, setMsgType] = useState(null);
  const [inputs, setInputs] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  //refrences
  const depCollection = collection(db, "departments");

  useEffect(() => handleDocChange(depCollection, setDepartmentList), []);

  const handleSubmit = () => {
    try {
      const fixedInput = Object.assign({}, inputs);
      fixedInput["semesters"] = parseInt(fixedInput["semesters"]);

      const docRef = addDoc(collection(db, "departments"), fixedInput);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setOpen(false);
      setInputs({});
    }
  };

  return (
    <Container >
      <Card sx={{ paddingTop: 2 }}>
        <Box>
          <Stack>
            <Typography variant="h3" margin="auto" gutterBottom>
              Departments
            </Typography>
          </Stack>

          <DepartmentDialog
            open={open}
            inputs={inputs}
            setInputs={setInputs}
            handleClose={() => setOpen(false)}
            handleSubmit={handleSubmit}
          />
          
          <Stack alignItems={matches ? "center" : "end"} m={2}>
            <ModifyButton
              type={"Department"}
              selectionModel={selectionModel}
              onClicked={(type) => {
                if (type === "add") {
                  setOpen(true);
                } else if (type === "delete") {
                  setMsgType("delete");
                  setAlertOpen(true);
                  handleRemoveDoc(selectionModel, depCollection);
                }
              }}
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
            rows={departmentList}
            columns={columns}
            selectionModel={selectionModel}
            onCellEditCommit={(params) => {
              setMsgType("update");
              if (params.field === "name")
                onDepNameCellEditCommit(params, setAlertOpen, depCollection);
              else onCellEditCommit(params, setAlertOpen, depCollection);
            }}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Box>

        <AdvancedAlert
          open={alertOpen}
          msgType={msgType}
          handleClose={() => {
            setAlertOpen(false);
          }}
        />
      </Card>
    </Container>
  );
}
