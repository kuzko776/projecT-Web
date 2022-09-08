import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

//firebase
import db from "../firebase";
import {
  where,
  collectionGroup,
  collection,
  addDoc,
  runTransaction,
  writeBatch,
  doc,
} from "firebase/firestore";

// material
import {
  Card,
  Stack,
  Container,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  Button,
  Tabs,
  Tab,
  styled,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import BatchSelect from "../components/BatchSelect";
import BoardMarksSelect from "../components/BoardMarksSelect";
import AdvancedAlert from "../components/AdvancedAlert";
import BoardMarksDialog from "../layout/Dashboard/form_dialogs/BoardMarksDialog";

//helpers
import {
  handleDocChange,
  getDocumentsWithParentID,
  getDocuments,
  onGpaCellEditCommit,
} from "../helpers/DashboardHelper";
import { margin } from "@mui/system";

var columns = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "visible",
    headerName: "Visible?",
    width: 150,
    editable: true,
    type: "boolean",
  },
  {
    field: "smesterGPA",
    headerName: "Semester GPA",
    width: 150,
    editable: true,
  },
  {
    field: "cumuHours",
    headerName: "Cumulative Hours",
    width: 150,
    editable: true,
  },
  {
    field: "score",
    headerName: "Score",
    width: 150,
    editable: true,
  },
  {
    field: "cumuScore",
    headerName: "Cumulative Score",
    width: 150,
    editable: true,
  },
  {
    field: "creditHours",
    headerName: "Credit Hours",
    width: 150,
    editable: true,
  },
  {
    field: "gpa",
    headerName: "GPA",
    width: 150,
    editable: true,
  },
];

const StyledTabs = styled(Tabs)(({ theme }) => {
  return {
    margin: "auto",
    maxWidth: 400,
    borderRadius: theme.shape.borderRadiusMd,
  };
});


export default function MarksBoard() {
  const [marksList, setMarksList] = useState([]);
  const [stdMarks, setStdMarks] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [inputs, setInputs] = useState({ type: "final", semester: "1" });
  const [alertOpen, setAlertOpen] = useState(false);

  //refrences
  const batchCollection = collectionGroup(db, "batchs");
  const marksCollection = collection(db, "marks");
  const studentsCollection = collection(db, "students");
  const stdMarksCollection =
    selectedBoard != null
      ? collection(marksCollection, marksList[selectedBoard].id, "stdMarks")
      : null;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => getDocumentsWithParentID(batchCollection, setBatchList), []);
  useEffect(() => {
    setMarksList([]);
    setSelectedBoard(null);

    if (selectedBatch) {
      handleDocChange(
        marksCollection,
        setMarksList,
        null,
        where("batchID", "==", selectedBatch.id)
      );
    }
  }, [selectedBatch]);

  useEffect(() => {
    setStdMarks([]);
    handleDocChange(stdMarksCollection, setStdMarks);
  }, [selectedBoard]);

  const getTableHeader = () => {
    if (selectedBoard != null) {
      const subjects = marksList[selectedBoard].subjects;
      const subjectsHeader = subjects.names.map((item, index) => {
        return {
          field: subjects.ids[index],
          headerName: item,
          width: 150,
          editable: true,
        };
      });

      return columns.concat(subjectsHeader);
    }
    return columns;
  };

  const handleNewBoard = () => {
    try {
      runTransaction(db, async (Transaction) => {
        const subjectsCollection = collection(
          db,
          "departments",
          selectedBatch.parentID,
          "subjects"
        );

        const ids = [];
        const names = [];
        const stds = [];

        await getDocuments(subjectsCollection, (items) =>
          items.map((subject) => {
            ids.push(subject.id);
            names.push(subject.name);
          })
        ,null, where("semester","==",inputs.semester));

        const docRef = await addDoc(marksCollection, {
          batchID: selectedBatch.id,
          batchNum: selectedBatch.number.toString(),
          open: "false",
          publish: "false",
          semester: inputs.semester,
          type: inputs.type,
          subjects: {
            ids,
            names,
          },
        });

        const batch = writeBatch(db);

        getDocuments(studentsCollection, (items) => {
          items.map((std) => {
            batch.set(doc(docRef, "stdMarks", std.id), {
              name: std.name,
              visible: true,
            });
          });
          batch.commit();
        }, null, where("batchId", "==", selectedBatch.id));
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Container>
      <Card sx={{ paddingTop: 2 }}>
        <Box>
          <Stack alignItems="center">
            <Typography variant="h3" gutterBottom>
              Board Marks
            </Typography>
          </Stack>

          <BoardMarksDialog
            open={openDialog}
            inputs={inputs}
            setInputs={setInputs}
            handleClose={() => setOpenDialog(false)}
            handleSubmit={handleNewBoard}
          />

          <Stack
            direction={matches ? "column" : "row-reverse"}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            m={2}
          >
            <Button
              variant="contained"
              onClick={() => {
                if (selectedBatch) setOpenDialog(true);
                else setAlertOpen(true);
              }}
              startIcon={<Icon icon={"akar-icons:plus"} />}
            >
              New board marks
            </Button>

            <BatchSelect
              list={batchList}
              value={selectedBatch}
              onBatchChange={(batch) => {
                setSelectedBatch(batch);
              }}
            />
          </Stack>

          {selectedBatch && (
            <StyledTabs
              value={selectedBoard}
              onChange={(event, newValue) => setSelectedBoard(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {marksList.map((item, index) => {
                return (
                  <Tab
                    key={index}
                    label={"Semester " + item.semester + " " + item.type}
                  />
                );
              })}
            </StyledTabs>
          )}

          {selectedBoard != null && (
            <Stack justifyContent="space-between" direction="row" m={2}>
              <Box>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Open for teachers"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Publish for students"
                />
              </Box>
              {/* <Box>
              <Button variant="text" color="inherit">
                Cancel
              </Button>
              <Button variant="outlined">Save</Button>
            </Box> */}
            </Stack>
          )}
        </Box>
        {selectedBoard != null && (
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
              disableSelectionOnClick
              rows={stdMarks}
              columns={getTableHeader()}
              selectionModel={selectionModel}
              components={{
                Toolbar: GridToolbar,
              }}
              onCellEditCommit={({ id, field, value }) => {
                onGpaCellEditCommit(id, field, value, stdMarksCollection);
              }}
            />
          </Box>
        )}

        <AdvancedAlert
          open={alertOpen}
          msgType={"Please select a batch first."}
          handleClose={() => {
            setAlertOpen(false);
          }}
        />
      </Card>
    </Container>
  );
}