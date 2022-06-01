import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Chip, Container, styled, emphasize } from "@mui/material";
import { NavLink } from "react-router-dom";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.grey[100];
  return {
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

export default function CustomBreadcrumbs({ list }) {
  return (
    <Breadcrumbs
      sx={{ display: "flex", justifyContent: "center", margin: 1 }}
      separator="›"
    >
      {list?.map((item) => {
        return (
          <NavLink key="1" style={{textDecoration:"none"}} to={item.href ?? "#"}>
          <StyledBreadcrumb   label={item.name}  />
          </NavLink>
        );
      })}
    </Breadcrumbs>
  );
}
