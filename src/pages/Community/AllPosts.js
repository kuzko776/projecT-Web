import { useState, useEffect } from "react";
import { Box, Grid, Button, Stack } from "@mui/material";
import FeedItemMed from "components/community/FeedItemMed";
import CustomBreadcrumbs from "components/CustomBreadcrumbs";
import { useNavigate } from "react-router";

import db from "../../firebase";
import { collection } from "firebase/firestore";
//helpers
import { getDocuments } from "../../helpers/DashboardHelper";


const breadcrumbs = [{ name: "Posts" }];

export default function AllPosts({}) {

  const [postsList, setPostsList] = useState([]);
  //refrences
  const postsCollection = collection(db, "posts");

  useEffect(() => getDocuments(postsCollection, setPostsList), []);

  let navigate = useNavigate();
  return (
    <Box margin="auto" paddingX={2} maxWidth={1200} >
      <CustomBreadcrumbs list={breadcrumbs} />
      <Stack alignItems='center' margin>
      <Button
        variant="contained"
        onClick={() => navigate("../post_form", { replace: true })}
      >
        New Post
      </Button>
      </Stack>
      <Grid container spacing={4} justifyContent='flex-end'>
        {postsList.map((props) => {
          return (
            <Grid item xs={12} lg={6}>
              <FeedItemMed props={props} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
