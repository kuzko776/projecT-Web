import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
// components
import NavSection from "../../components/NavSection";
import MHidden from "../../components/MHidden";
//
import sidebarConfig from "./SidebarConfig";
import sidebarConfigTeacher from "./SidebarConfigTeacher";

import ribat_logo from "../../images/ribat_logo.png";
import logo from "../../images/logo.svg";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_DESKTOP = 0;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
    border: 30,
  },
  ".css-p0dwok-MuiPaper-root-MuiDrawer-paper": {
    borderRight: 0,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar, user }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Box>
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/" sx={{m:"auto" }}>
          <Box
            component="img"
            src={logo}
            sx={{ width: "100%", height: 80 }}
          />
        </Box>
      </Box>

      <NavSection navConfig={user.uid =="eZwATTrW79V94exjNsML0R5k1Mc2" ? sidebarConfig : sidebarConfigTeacher} />
    </Box>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
              top: APPBAR_DESKTOP,
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
