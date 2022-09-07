import { useEffect, useState } from "react";

//firebase
import db from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

// material
import { Card, Stack, Button, Container, Typography, Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

//components
import StaffDialog from "../layout/Dashboard/form_dialogs/StaffDialog";
import AdvancedAlert from "../components/AdvancedAlert";
import ModifyButton from "../components/ModifyButton";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

//helpers
import {
  handleDocChange,
  onCellEditCommit,
  handleRemoveDoc,
  onStaffNameCellEditCommit,
  onStaffVerifiedCellEditCommit,
} from "../helpers/DashboardHelper";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
  },
  {
    field: "password",
    headerName: "Password",
    width: 150,
  },
  {
    field: "verified",
    headerName: "Verified",
    width: 150,
    type:"boolean",
    editable: true,
  },
];

export default function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [msgType, setMsgType] = useState(null);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  //refrences
  const staffCollection = collection(db, "staff");

  useEffect(() => handleDocChange(staffCollection, setStaffList), []);

  const handleSubmit = () => {
    // const auth = getAuth();
    // createUserWithEmailAndPassword(auth, "kuzko790@gmail.com", "123456")
    //   .then((userCredential) => {
        
        
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //   })
    //   .finally(() => {
    //     setOpen(false);
    //     setInputs({});
    //   });
  };

  return (
    <Container>
      <Card sx={{ paddingTop: 2 }}>
        <Box>
          <Stack alignItems="center">
            <Typography variant="h3" gutterBottom>
              Teaching Staff
            </Typography>
          </Stack>

          <StaffDialog
            open={open}
            inputs={inputs}
            setInputs={setInputs}
            handleClose={() => setOpen(false)}
            handleSubmit={handleSubmit}
          />

          <Stack
            direction={matches ? "column" : "row-reverse"}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            m={2}
          >
            <ModifyButton
              type={"Teacher"}
              selectionModel={selectionModel}
              onClicked={(type) => {
                if (type === "add") {
                  setOpen(true);
                } else if (type === "delete") {
                  setMsgType("delete");
                  setAlertOpen(true);
                  handleRemoveDoc(selectionModel, staffCollection);
                }
              }}
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
            rows={staffList}
            columns={columns}
            selectionModel={selectionModel}
            onCellEditCommit={(params) => {
              setMsgType("update");
              if (params.field === "name")
                onStaffNameCellEditCommit(params, setAlertOpen, params.id);
                if(params.field ==="verified")
                onStaffVerifiedCellEditCommit(params, setAlertOpen, params.id)
              onCellEditCommit(params, setAlertOpen, staffCollection);
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
