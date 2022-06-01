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

import db from "../../firebase";
import {
  collectionGroup,
  collection,
  addDoc,
} from "firebase/firestore";
//helpers
import { getDocuments } from "../../helpers/DashboardHelper";

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
  const [batchList, setBatchList] = useState([]);

  //refrences
  const batchCollection = collectionGroup(db, "batchs");
  const postsCollection = collection(db, "posts");

  const PostSchema = Yup.object().shape({
    title: Yup.string()
      .required("الرجاء كتابة عنوان")
      .max(50, "يجب ان لا يتخطى العنوان 50 خانة"),
    description: Yup.string().required("الرجاء كتابة وصف"),
    content: Yup.string().required("الرجاء كتابة محتوى"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      content: "",
      tags: [],
      publish: false,
      sendAll: false,
    },
    validationSchema: PostSchema,
    onSubmit: (data) => {
      const tags = data.tags.map((option) => {
        return option.depName +" "+ option.number;
      });

      addDoc(postsCollection, {
        ...data,
        date: new Date(),
        publisherName: user.displayName,
        publisherID: user.uid,
        tags: data.sendAll ? ["Computer Studies"] : tags,
      });
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;

  useEffect(() => getDocuments(batchCollection, setBatchList), []);
  console.log(user);
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
                  إنشاء منشور جديد
                </ArabicTypography>

                <Stack spacing={2} dir="rtl">
                  <TextField
                    name="title"
                    autoFocus
                    required
                    label="العنوان"
                    {...getFieldProps("title")}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                  <TextField
                    name="description"
                    required
                    label="الوصف"
                    {...getFieldProps("description")}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <TextField
                    name="content"
                    required
                    multiline
                    label="المحتوى"
                    {...getFieldProps("content")}
                    error={Boolean(touched.content && errors.content)}
                    helperText={touched.content && errors.content}
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
                      <Switch name="publish" {...getFieldProps("publish")} />
                    }
                    label="Publish"
                  />
                  <FormControlLabel
                    control={
                      <Switch name="sendAll" {...getFieldProps("sendAll")} />
                    }
                    label="Send to all"
                  />

                  <TagsAutoComplete
                    options={batchList}
                    {...getFieldProps("tags")}
                    disabled={values.sendAll}
                  />

                  <Stack spacing={1} direction="row" justifyContent="end">
                    <Button>Preview</Button>
                    <Button variant="contained" type="submit">
                      Post
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
