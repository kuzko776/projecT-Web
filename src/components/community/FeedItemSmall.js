import {
  Avatar,
  Stack,
  Typography,
  Chip,
  Divider,
  CardActionArea,
} from "@mui/material";
import { styled } from "@mui/material";
import { NavLink } from "react-router-dom";

const ArabicTypography = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  direction: "rtl",
  fontFamily: theme.typography.arabicFontFamily,
  lineHeight: "125%",
}));

export default function FeedItemSmall({ props }) {
  return (
    <Stack sx={{ marginBottom: 1 }}>
      <CardActionArea
        sx={{ paddingX: 2, marginBottom: 1 }}
        component={NavLink}
        to={"/community/posts/" + props.id}
      >
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <ArabicTypography variant="caption">{(new Date(props?.date.seconds * 1000)).toLocaleString()}</ArabicTypography>
          <ArabicTypography variant="subtitle1" flexGrow={1} margin={1}>
            {props.title}
          </ArabicTypography>
          <Avatar></Avatar>
        </Stack>
      </CardActionArea>
      <Divider>
        <Stack spacing={1} direction="row">
          {props?.tags?.map((item) => {
            return <Chip label={item} size="small" />;
          })}
        </Stack>
      </Divider>
    </Stack>
  );
}
