import {
  Avatar,
  Chip,
  Stack,
  Typography,
  styled,
  IconButton,
} from "@mui/material";
import { Icon } from "@iconify/react";
import RippleEffect from "components/RippleEffect";
import { NavLink } from "react-router-dom";

const ArabicTypography = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  direction: "rtl",
  fontFamily: theme.typography.arabicFontFamily,
  lineHeight: "125%",
}));

const ReqIcon = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.primary.dark,
}));

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
      name = "دخول مركبة";
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

function getRequestIcon(type) {
  let iconName = null;
  switch (type) {
    case "mercy":
      iconName = "bxs:donate-heart";
      break;
    case "review-exam":
      iconName = "bx:refresh";
      break;
    case "freeze":
      iconName = "iconoir:snow-flake";
      break;
    case "registration":
      iconName = "bi:person-check-fill";
      break;
    case "data-editing":
      iconName = "fluent:calendar-edit-20-filled";
      break;
    case "vehicle":
      iconName = "fluent:vehicle-car-profile-rtl-16-filled";
      break;
    case "medical-excuse":
      iconName = "carbon:reminder-medical";
      break;
    case "complaint":
      iconName = "emojione-monotone:right-anger-bubble";
      break;
  }
  return iconName;
}

export default function RequestItem({ props }) {
  var icon = "",
    stateColor = "info";

  switch (props?.state) {
    case "rejected":
      icon = "akar-icons:circle-x";
      stateColor = "error";
      break;
    case "waiting":
      icon = "akar-icons:clock";
      stateColor = "warning";
      break;
    case "accepted":
      icon = "akar-icons:circle-check";
      stateColor = "success";
      break;
  }
  return (
    <RippleEffect component={NavLink} to={"/community/requests/" + props.id}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <IconButton color={stateColor}>
          <Icon icon={icon} />
        </IconButton>
        <Stack direction="row" alignItems="center">
          <Stack margin={1}>
            <ArabicTypography variant="body2">
              {getRequestName(props.type)}
            </ArabicTypography>
            <ArabicTypography variant="subtitle1">
              {props.stdName}
            </ArabicTypography>
            <ArabicTypography variant="caption">{(new Date(props?.date.seconds * 1000)).toLocaleString()}</ArabicTypography>
          </Stack>
          <ReqIcon variant="rounded">
            <Icon icon={getRequestIcon(props.type)} height="32" />
          </ReqIcon>
        </Stack>
      </Stack>
    </RippleEffect>
  );
}
