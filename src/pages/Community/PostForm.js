import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import {
  Box,
  Button,
  Switch,
  Card,
  Grid,
  TextField,
  Typography,
  Stack,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TagsAutoComplete from "components/community/TagsAutoComplete";
import CustomBreadcrumbs from "components/CustomBreadcrumbs";
import { useSearchParams, useNavigate } from "react-router-dom";

import db from "../../firebase";
import {
  collectionGroup,
  collection,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
//helpers
import { getDocuments, getDocument } from "../../helpers/DashboardHelper";

const ArabicTypography = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  direction: "rtl",
  fontFamily: theme.typography.arabicFontFamily,
  lineHeight: "125%",
}));

const breadcrumbs = [
  { name: "Requests", href: "/community/posts" },
  { name: "Post Form" },
];

export default function PostForm({ user }) {
  const [departmentList, setDepartmentList] = useState([]);
  const [post, setPost] = useState(null);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const postID = searchParams.get("id");
  const state = searchParams.get("state");

  //refrences
  const depCollection = collection(db, "departments");
  const postsCollection = collection(db, "posts");
  const requestRef = state === "edit" ? doc(postsCollection, postID) : null;

  useEffect(() => getDocument(requestRef, setPost), []);

  const PostSchema = Yup.object().shape({
    title: Yup.string()
      .required("الرجاء كتابة عنوان")
      .max(50, "يجب ان لا يتخطى العنوان 50 حرف"),

    content: Yup.string()
      .required("الرجاء كتابة محتوى")
      .max(2000, "يجب ان لا يتخطى الوصف 2000 حرف"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tags: [],
      publish: false,
      sendAll: false,
    },
    validationSchema: PostSchema,
    onSubmit: (data) => {
      console.log(data);
      if (state == "new") {
        addDoc(postsCollection, {
          ...data,
          date: new Date(),
          publisherName: user.displayName,
          publisherID: user.uid,
          tags: data.sendAll? [..."Computer Studies"] : data.tags 
        });
      } else if (state == "edit") {
        delete data.id;
        updateDoc(requestRef, data);
      }
      navigate(-1)
    },
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setValues,
  } = formik;

  useEffect(
    () =>
      getDocuments(depCollection, (list) => {
        let depList = [];
        list.forEach(function (i) {
          depList.push(i.name);
        });
        setDepartmentList(depList);
      }),
    []
  );
  useEffect(() => {
    if (post) setValues(post);
  }, [post]);

  const handleDelete = () => {};

  const titleError = Boolean(touched.title && errors.title),
    contentError = Boolean(touched.content && errors.content);

    // console.log(getFieldProps("tags"));

  return (
    <Box marginX={1}>
      <CustomBreadcrumbs list={breadcrumbs} />
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card sx={{ padding: 2 }}>
                <ArabicTypography
                  variant="h6"
                  sx={{ marginBottom: 1, paddingInline: 2 }}
                >
                  {state === "new" ? "إنشاء منشور جديد" : "تعديل المنشور"}
                </ArabicTypography>

                <Stack spacing={2} dir="rtl">
                  <TextField
                    name="title"
                    autoFocus
                    required
                    label="العنوان"
                    {...getFieldProps("title")}
                    error={titleError}
                    helperText={
                      titleError
                        ? errors.title
                        : values.title.length + "/50"
                    }
                  />
                  <TextField
                    name="content"
                    required
                    multiline
                    label="المحتوى"
                    {...getFieldProps("content")}
                    error={contentError}
                    helperText={
                      contentError
                        ? errors.content
                        : values.content.length + "/2000"
                    }
                  />
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ padding: 2 }}>
                <Stack spacing={1}>
                  <Typography
                    variant="h6"
                    sx={{ marginBottom: 1, paddingInline: 2 }}
                  >
                    Settings
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.publish}
                        {...getFieldProps("publish")}
                      />
                    }
                    label="Publish"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.sendAll}
                        {...getFieldProps("sendAll")}
                      />
                    }
                    label="Send to all"
                  />

                  <TagsAutoComplete
                    options={departmentList}
                    {...getFieldProps("tags")}
                    value = {formik.values.tags.filter(e => e !== 'Computer Studies')}
                    disabled={values.sendAll}
                  />

                  <Stack spacing={1} direction="row" justifyContent="end">
                    {state === "edit" && (
                      <Button color="error" onClick={handleDelete}>
                        Delete
                      </Button>
                    )}
                    <Button variant="contained" type="submit">
                      {state === "edit" ? "Save" : "Post"}
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
