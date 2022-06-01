import { useState, useEffect } from "react";
import { Box, Grid, Card, styled, Typography } from "@mui/material";
import RequestItem from "components/community/RequestItem";
import CustomBreadcrumbs from "components/CustomBreadcrumbs";
import db from "../../firebase";
import { collection } from "firebase/firestore";
//helpers
import { getDocuments } from "../../helpers/DashboardHelper";

const ArabicTypography = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  direction: "rtl",
  fontFamily: theme.typography.arabicFontFamily,
}));

const breadcrumbs = [{ name: "Requests" }];

export default function AllRequests({}) {
  const [requestsList, setRequestsList] = useState([]);

  //refrences
  const requestsCollection = collection(db, "requests");

  useEffect(() => getDocuments(requestsCollection, setRequestsList), []);

  return (
    <Box margin="auto" paddingX={2} maxWidth={1200}>
      <CustomBreadcrumbs list={breadcrumbs} />
      <Card sx={{ padding: 2 }}>
        <ArabicTypography
          variant="h6"
          sx={{ marginBottom: 1, paddingInline: 2 }}
        >
          جميع الطلبات
        </ArabicTypography>
        <Grid container spacing={4} justifyContent='flex-end'>
          {requestsList.map((props) => {
            return (
              <Grid item xs={12} sm={6} lg={4}>
                <RequestItem props={props} />
              </Grid>
            );
          })}
        </Grid>
      </Card>
    </Box>
  );
}
