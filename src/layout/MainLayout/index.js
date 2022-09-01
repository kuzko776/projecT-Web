import { useState } from 'react';
import { styled } from '@mui/material/styles';

import DashboardNavbar from 'layout/Dashboard/DashboardNavbar';
import DashboardSidebar from 'layout/Dashboard/DashboardSidebar';
import { Outlet } from 'react-router-dom';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 64;

const RootStyle = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100vh',
    paddingTop:24,
    marginTop: APP_BAR_MOBILE,
    paddingBottom: theme.spacing(10),
    backgroundColor:theme.palette.primary.lighter,
    borderTopRightRadius: "16px",
    borderTopLeftRadius: "16px",                                                                                       
    [theme.breakpoints.up('lg')]: {
        marginTop: APP_BAR_DESKTOP,
    }
}));

export default function MainLayout() {

    const [open, setOpen] = useState(false);
    return (
        <RootStyle>
            <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
            <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
             <MainStyle>
             <Outlet/>
            </MainStyle>
        </RootStyle>
    );
}