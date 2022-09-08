import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

//firebase
import db from "../firebase";
import {
  where,
  collectionGroup,
  collection,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

import SubjectSelect from "../components/SubjectSelect";
import BoardMarksSelect from "../components/BoardMarksSelect";
import AdvancedAlert from "../components/AdvancedAlert";
import BoardMarksDialog from "../layout/Dashboard/form_dialogs/BoardMarksDialog";

//helpers
import {
  handleDocChange,
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
];

const StyledTabs = styled(Tabs)(({ theme }) => {
  return {
    margin: "auto",
    maxWidth: 400,
    borderRadius: theme.shape.borderRadiusMd,
  };
});


export default function MarksBoardTeacher() {
  const [marksList, setMarksList] = useState([]);
  const [stdMarks, setStdMarks] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [inputs, setInputs] = useState({ type: "final", semester: "1" });
  const [alertOpen, setAlertOpen] = useState(false);

  const auth = getAuth();

  //refrences
  const batchCollection = collectionGroup(db, "batchs");
  const subjectCollection = collectionGroup(db, "subjects");
  const marksCollection = collection(db, "marks");
  const studentsCollection = collection(db, "students");
  const stdMarksCollection =
    selectedBoard != null
      ? collection(marksCollection, marksList[selectedBoard].id, "stdMarks")
      : null;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => getDocuments(subjectCollection, setSubjectList, null , where('teacher.id','==', auth.currentUser.uid)), []);
  // useEffect(() => {
  //   setMarksList([]);
  //   setSelectedBoard(null);

  //   if (selectedBatch) {
  //     handleDocChange(
  //       marksCollection,
  //       setMarksList,
  //       null,
  //       where("batchID", "==", selectedBatch.id)
  //     );
  //   }
  // }, [selectedBatch]);

  useEffect(() => {
    setMarksList([]);
    setSelectedBoard(null);

    if (selectedSubject) {
      handleDocChange(
        marksCollection,
        setMarksList,
        null,
        where("subjects.ids", "array-contains", selectedSubject.id)
      );
    }

  }, [selectedSubject]);

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

  return (
    <Container>
      <Card sx={{ paddingTop: 2 }}>
        <Box>
          <Stack alignItems="center">
            <Typography variant="h3" gutterBottom>
              Board Marks
            </Typography>
          </Stack>

          <Stack
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            m={2}
          >
            <SubjectSelect
              list={subjectList}
              value={selectedSubject}
              onSubjectChange={(subject) => {
                setSelectedSubject(subject);
              }}
            />
          </Stack>

          {selectedSubject && (
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
          msgType={"Please select a subject first."}
          handleClose={() => {
            setAlertOpen(false);
          }}
        />
      </Card>
    </Container>
  );
}
