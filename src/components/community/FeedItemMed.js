import {
  Avatar,
  Stack,
  Typography,
  Chip,
  Divider,
  Card,
  IconButton,
  CardActionArea,
} from "@mui/material";
import { styled } from "@mui/material";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";

const ArabicTypography = styled(Typography)(({ theme }) => ({
  textAlign: "right",
  direction: "rtl",
  fontFamily: theme.typography.arabicFontFamily,
}));
export default function FeedItemMed({ props }) {
  return (
    <Card sx={{ maxWidth: 600, margin: "auto" }}>
      <Stack marginY={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          marginX={1}
        >
          <IconButton>
            <Icon icon="ant-design:edit-filled" />
          </IconButton>
          <Stack flexGrow={1} margin={1}>
            <ArabicTypography variant="subtitle2">
              {props.publisherName}
            </ArabicTypography>
            <ArabicTypography variant="caption">date</ArabicTypography>
          </Stack>
          <Avatar></Avatar>
        </Stack>
        <CardActionArea
          sx={{ padding: 1 }}
          component={NavLink}
          to="/community/posts/1"
        >
          <ArabicTypography variant="h6">{props.title}</ArabicTypography>
          <ArabicTypography variant="subtitle2">
            {props.description}
          </ArabicTypography>
          <ArabicTypography variant="body2">{props.content}</ArabicTypography>
        </CardActionArea>
        <Divider>
          <Stack spacing={1} paddingTop direction="row">
            {props.tags.map((item) => {
              return <Chip label={item} size="small" />;
            })}
            
          </Stack>
        </Divider>
      </Stack>
    </Card>
  );
}
