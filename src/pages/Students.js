import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

//firebase
import db from "../firebase";
import {
  collection,
  setDoc,
  getDocs,
  updateDoc,
  doc,
  writeBatch,
  onSnapshot,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";

// material
import { Card, Stack, Container, Typography, Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import BatchSelect from "../components/BatchSelect";
import StudentDialog from "../layout/Dashboard/form_dialogs/StudentDialog";
import AdvancedAlert from "../components/AdvancedAlert";
import ModifyButton from "../components/ModifyButton";

//helpers
import {
  handleDocChange,
  onCellEditCommit,
  handleRemoveDoc,
} from "../helpers/DashboardHelper";

const columns = [
  { field: "id", headerName: "ID", width: 150 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    editable: true,
    preProcessEditCellProps: (params) => {
      const value = params.props.value;
      const isValid = value.match(/^.+$/) && value.length < 60;
      return { ...params.props, error: !isValid };
    },
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
    editable: true,
    preProcessEditCellProps: (params) => {
      const value = params.props.value;
      const isValid = value.match(/^\d{9}$/);
      return { ...params.props, error: !isValid };
    },
  },
  {
    field: "labGroup",
    headerName: "Lab Group",
    width: 150,
    editable: true,
    preProcessEditCellProps: (params) => {
      const value = params.props.value;
      const isValid = value.match(/^[A-Z]$/);
      return { ...params.props, error: !isValid };
    },
  },
];

export default function Students() {
  const [studentList, setStudentList] = useState([]);
  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [msgType, setMsgType] = useState(null);

  //refrences
  const batchCollection = collectionGroup(db, "batchs");
  const stdCollection = collection(db, "students");

  const handleBatchSelect = (batch) => {
    console.log(batch);
    setSelectedBatch(batch);
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  //todo edit this... use helpers
  useEffect(() => {
    let dataArray = [];
    const unsubscribe = onSnapshot(batchCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const currentDoc = Object.assign(
          { id: change.doc.id, path: change.doc.ref.path },
          change.doc.data()
        );
        if (change.type === "added") {
          dataArray.push(currentDoc);
        }
        if (change.type === "modified") {
          dataArray = dataArray.map((obj) =>
            obj.id === change.doc.id ? currentDoc : obj
          );
        }
        if (change.type === "removed") {
          const index = dataArray.findIndex(
            (item) => change.doc.id === item.id
          );
          dataArray.splice(index, 1);
        }
        setBatchList([...dataArray]);
      });
    });

    return () => {
      setBatchList([]);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedBatch != null) {
      handleDocChange(
        query(stdCollection, where("batchId", "==", selectedBatch.id)),
        setStudentList
      );
    }
    return () => {
      setStudentList([]);
    };
  }, [selectedBatch]);

  const handleSubmit = () => {
    try {
      const departmentId = doc(db, selectedBatch.path).parent.parent.id;
      const data = Object.assign(
        { batchId: selectedBatch.id, depId: departmentId },
        inputs
      );
      delete data.id;

      setDoc(doc(stdCollection, inputs.id), data);
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
            Students
          </Typography>
        </Stack>

        <StudentDialog
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
            type={"Student"}
            selectionModel={selectionModel}
            onClicked={(type) => {
              if (type === "add") {
                if (selectedBatch) setOpen(true);
                else {
                  setMsgType("Please select a batch first.");
                  setAlertOpen(true);
                }
              } else if (type === "delete") {
                setMsgType("delete");
                setAlertOpen(true);
                handleRemoveDoc(selectionModel, stdCollection);
              }
            }}
          />

          <BatchSelect
            list={batchList}
            value={selectedBatch}
            onBatchChange={handleBatchSelect}
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
          rows={studentList}
          columns={columns}
          selectionModel={selectionModel}
          onCellEditCommit={(params) => {
            setMsgType("update");
            onCellEditCommit(params, setAlertOpen, stdCollection);
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
