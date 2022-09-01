import { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import CustomBreadcrumbs from "components/CustomBreadcrumbs";
import FeedItemMed from "components/community/FeedItemMed";
import {  useParams } from 'react-router-dom';
//helpers
import { getDocument } from "helpers/DashboardHelper";

import db from "../../firebase";
import { doc } from "firebase/firestore";

export default function FullPost({}) {
  const [post, setPost] = useState(null);
  let { postId } = useParams();

  const breadcrumbs = [
    { name: "Posts", href: "/community/posts" },
    { name: "Post " + postId },
  ];

  //refrences
  const requestRef = doc(db, "posts", postId);

  useEffect(() => getDocument(requestRef, setPost), []);
  return (
    <Box marginX={2}>
      <CustomBreadcrumbs list={breadcrumbs} />
      <FeedItemMed props={post} />
    </Box>
  );
}
