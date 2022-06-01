import { useState, useRef, useEffect } from "react";
import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
} from "@mui/material";
import CustomBreadcrumbs from "components/CustomBreadcrumbs";
import { styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";

import db from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { observeDocument } from "../../helpers/DashboardHelper";

import { useReactToPrint } from "react-to-print";

const ArabicTypography = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  direction: "rtl",
  fontFamily: theme.typography.arabicFontFamily,
  lineHeight: "125%",
}));

const ArabicTypographyCenter = styled(ArabicTypography)(({ theme }) => ({
  textAlign: "center",
}));

const PrintCard = styled(Card)(({ theme }) => ({
  maxWidth: theme.breakpoints.values.sm,
  margin: "auto",
}));

const PrintStack = styled(Stack)(({ theme }) => ({
  padding: 16,
  justifyContent: "space-between",
  "@media print": {
    height: "100vh",
  },
}));

function DataItem({ title, content }) {
  return (
    <Grid item xs={6}>
      <ArabicTypography variant="subtitle2">{title}</ArabicTypography>
      <ArabicTypography variant="body2">{content}</ArabicTypography>
    </Grid>
  );
}

export default function FullRequest({}) {
  const [request, setRequest] = useState(null);
  const [qr, setQR] = useState(null);

  let requestID = window.location.pathname.split("/").pop();

  //refrences
  const requestRef = doc(db, "requests", requestID);

  const handleStatusChange = (event, newStatus) => {
    setDoc(
      requestRef,
      {
        state: newStatus,
      },
      { merge: true }
    );
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const generateQr = (data) => {
    const qr = `http://api.qrserver.com/v1/create-qr-code/?data=${data}&size=48x48`;
    setQR(qr);
  };

  useEffect(() => observeDocument(requestRef, setRequest), []);

  var stateLabel = "",
    stateColor = "info";

  const breadcrumbs = [
    { name: "Requests", href: "/community/requests" },
    { name: "Request " + requestID },
  ];

  switch (request?.state) {
    case "rejected":
      stateLabel = "تم الرفض";
      stateColor = "error";
      break;
    case "waiting":
      stateLabel = "تحت المراجعه";
      stateColor = "warning";
      break;
    case "accepted":
      stateLabel = "تم القبول";
      stateColor = "success";
      break;
  }

  function getRequestName(type) {
    let name = null;
    switch (type) {
      case "mercy":
        name = "استرحام";
        break;
      case "review-exam":
        name = "مراجعة اختبار";
        break;
      case "freeze":
        name = "تجميد سنة دراسية";
        break;
      case "registration":
        name = "شهادة قيد";
        break;
      case "data-editing":
        name = "تعديل بيانات";
        break;
      case "vehicle":
        name = "اذن دخول مركبة";
        break;
      case "medical-excuse":
        name = "اثبات عذر طبي";
        break;
      case "complaint":
        name = "تقديم شكوى";
        break;
    }
    return "طلب " + name;
  }

  useEffect(() => {
    generateQr(requestID);
  }, []);

  return (
    <Box marginX={2}>
      <CustomBreadcrumbs list={breadcrumbs} />
      <Stack
        direction="row"
        maxWidth={600}
        margin="auto"
        marginBottom={1}
        justifyContent="space-between"
      >
        <Stack direction="row">
          {/* <IconButton>
            <Icon icon="ant-design:edit-filled" />
          </IconButton> */}
          <IconButton onClick={handlePrint}>
            <Icon icon="fluent:print-20-filled" />
          </IconButton>
        </Stack>

        <ToggleButtonGroup
          color="primary"
          value={request?.state ?? null}
          exclusive
          size="small"
          onChange={handleStatusChange}
        >
          <ToggleButton value="rejected">مرفوض</ToggleButton>
          <ToggleButton value="waiting">انتظار</ToggleButton>
          <ToggleButton value="accepted">مقبول</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <PrintCard>
        <PrintStack ref={componentRef}>
          <Box>
            <Stack direction="row" justifyContent="space-between">
              <Chip
                label={stateLabel}
                color={stateColor}
                variant="outlined"
              />
              <Stack>
                <ArabicTypography variant="h6">
                  {getRequestName(request?.type)}
                </ArabicTypography>
                <ArabicTypography variant="caption">
                  8 اغسطس 2022 الساعه 7:30 صباحاً
                </ArabicTypography>
              </Stack>
            </Stack>
            <Grid container spacing={1}>
              <Grid item xs={12} marginY={1}>
                <ArabicTypographyCenter variant="body2">
                  بسم الله الرحمن الرحيم
                </ArabicTypographyCenter>
              </Grid>
              <DataItem
                title="الطلب الى"
                content="سعادة امين الشئون العلمية المحترم"
              />
              <DataItem title="الطلب من" content={request?.stdName} />
              <DataItem title="الرقم الجامعي" content={request?.stdID} />
              <DataItem title="الجنسية" content={request?.nationality} />
              <DataItem title="الفصل الدراسي" content={request?.semester} />
              <DataItem title="رقم الهاتف" content={request?.phone} />
              <Grid item xs={12}>
                <ArabicTypography variant="subtitle2">
                  الغرض من الطلب
                </ArabicTypography>
                <ArabicTypography variant="body2">
                  {request?.content}
                </ArabicTypography>
              </Grid>
            </Grid>
          </Box>
          <Stack alignItems="center">
            <Box component="img" src={qr} sx={{ width: 48, height: 48 }} />
            <ArabicTypographyCenter variant="body2">
              رقم الطلب
            </ArabicTypographyCenter>
            <ArabicTypographyCenter variant="subtitle2">
              {requestID}
            </ArabicTypographyCenter>
          </Stack>
        </PrintStack>
      </PrintCard>
    </Box>
  );
}
