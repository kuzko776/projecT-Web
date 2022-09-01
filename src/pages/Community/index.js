import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FeedItem from "components/community/FeedItemSmall";
import RequestItem from "components/community/RequestItem";
import CustomBreadcrumbs from "components/CustomBreadcrumbs";
import { useNavigate } from "react-router-dom";

import db from "../../firebase";
import { collection, where } from "firebase/firestore";
//helpers
import { getDocuments } from "../../helpers/DashboardHelper";


const breadcrumbs = [{name:"Dashboard"}]

const ArabicTypography = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  direction: "rtl",
  fontFamily: theme.typography.arabicFontFamily,
  lineHeight: "125%",
}));

function ViewMore({to}) {
  let navigate = useNavigate();
  return (
    <Box textAlign="center">
      <Button onClick={()=>navigate(to,{replace:true})}>
        <ArabicTypography variant="button">مشاهدة الكل</ArabicTypography>
      </Button>
    </Box>
  );
}



export default function Community({}) {
  const [requestsList, setRequestsList] = useState([]);
  const [postsList, setPostsList] = useState([]);

  //refrences
  const requestsCollection = collection(db, "requests");
  const postsCollection = collection(db, "posts");

  let navigate = useNavigate();
  useEffect(() => getDocuments(requestsCollection, setRequestsList,8,where("state", "==", "waiting")), []);
  useEffect(() => getDocuments(postsCollection, setPostsList,8), []);
  return (
    <Box marginX={2}>
      <CustomBreadcrumbs list={breadcrumbs}/>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ paddingY: 2 }}>
            <Stack direction="row" sx={{ marginBottom: 1, paddingInline: 2 }}>
              <Typography variant="h6" flexGrow={1}>
                News Update
              </Typography>
              <Button
                variant="contained"
                onClick={()=>navigate("../post_form?state=new")}
              >
                New Post
              </Button>
            </Stack>
            {postsList.map((props) => {
              return <FeedItem props={props} />;
            })}
            <ViewMore to="../posts"/>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ paddingY: 2 }}>
            <ArabicTypography
              variant="h6"
              sx={{ marginBottom: 1, paddingInline: 2 }}
            >
              آخر الطلبات
            </ArabicTypography>
            {requestsList.map((props) => {
              return <RequestItem props={props} />;
            })}
            <ViewMore to="../requests"/>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
