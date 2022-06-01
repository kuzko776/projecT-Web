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
    <Stack sx={{ marginBottom:1 }}>
      <CardActionArea
        sx={{paddingX: 2, marginBottom:1}}
        component={NavLink}
        to="/community/posts/1"
      >
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <ArabicTypography variant="caption">date</ArabicTypography>
          <Stack flexGrow={1} margin={1}>
            <ArabicTypography variant="subtitle1">
              {props.title}
            </ArabicTypography>
            <ArabicTypography variant="body1">
              {props.description}
            </ArabicTypography>
          </Stack>
          <Avatar></Avatar>
        </Stack>
      </CardActionArea>
      <Divider>
        <Stack spacing={1} direction="row">
          {props.tags.map((item) => {
            return <Chip label={item} size="small" />;
          })}
        </Stack>
      </Divider>
    </Stack>
  );
}
