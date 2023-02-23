import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

import {
    Box,
    Backdrop,
    Toolbar,
    List,
    CssBaseline,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CircularProgress
} from '@mui/material';

import {
    Menu,
    ChevronLeft,
    ChevronRight,
    PersonOutline,
    LocalGroceryStoreOutlined
} from '@mui/icons-material';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});

export default function NavBar() {
    let history = useHistory();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                bottom: 0,
                zIndex: '50',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 1 0%',
                    minHeight: 0,
                    backgroundColor: 'rgba(17,24,39,1)',
                    borderColor: 'rgba(75,85,99,1)',
                    borderRightWidth: '1px',
                    width: '5rem',
                    '& p':{
                        display: 'none',
                    },
                    '&:hover': {
                        width: '15rem',
                        '& p':{
                            display: 'flex',
                        }
                    },
                }}>
                    <div style={{
                        display: 'flex',
                        height: '4rem',
                        flexShrink: 0,
                        fontWeight: '700',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        backgroundColor: 'rgba(17,24,39,1)',
                        alignItems: 'center',
                    }}>
                        <img style={{
                            display: 'block',
                            verticalAlign: 'middle',
                            paddingRight: '0.25rem',
                            width: 'auto',
                            height: '3rem',
                            maxWidth: '100%'
                        }}
                            src="https://zuse.market/img/zuse_logo.2031c4b5.png"
                        >
                        </img>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '1 1 0%',
                        overflowY: 'auto',
                    }}>
                        <nav style={{
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            paddingLeft: '0.5rem',
                            paddingRight: '0.5rem',
                            flex: '1 1 0%',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                marginLeft: '0.25rem',
                                marginRight: '0.75rem',
                                color: 'rgba(209,213,219,1)',
                                fontWeight: '500',
                                fontSize: '.875rem',
                                lineHeight: '1.25rem',
                                paddingLeft: '0.5rem',
                                paddingRight: '0.5rem',
                                paddingTop: '0.5rem',
                                paddingBottom: '0.5rem',
                                borderRadius: '0.375rem',
                                alignItems: 'center',
                                textDecoration: 'inherit',
                                '&:hover': {
                                    backgroundColor: 'rgba(55,65,81,1)',
                                    boxShadow: 'none',
                                    cursor: 'pointer',
                                },
                            }}
                                onClick={() => history.push('/marketplace')}
                            >
                                <LocalGroceryStoreOutlined fontSize='medium' sx={{
                                    display: 'block',
                                    verticalAlign: 'middle',
                                    color: 'rgba(156,163,175,1)',
                                    flexShrink: 0,
                                    width: '1.5rem',
                                    height: '1.5rem',
                                }} />
                                <p style={{
                                    margin: 0,
                                    marginLeft: '15px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                }}>Marketplace</p>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                marginLeft: '0.25rem',
                                marginRight: '0.75rem',
                                color: 'rgba(209,213,219,1)',
                                fontWeight: '500',
                                fontSize: '.875rem',
                                lineHeight: '1.25rem',
                                paddingLeft: '0.5rem',
                                paddingRight: '0.5rem',
                                paddingTop: '0.5rem',
                                paddingBottom: '0.5rem',
                                borderRadius: '0.375rem',
                                alignItems: 'center',
                                textDecoration: 'inherit',
                                '&:hover': {
                                    backgroundColor: 'rgba(55,65,81,1)',
                                    boxShadow: 'none',
                                    cursor: 'pointer',
                                },
                            }}
                                onClick={() => history.push('/profiles')}
                            >
                                <PersonOutline fontSize='medium' sx={{
                                    display: 'block',
                                    verticalAlign: 'middle',
                                    color: 'rgba(156,163,175,1)',
                                    flexShrink: 0,
                                    width: '1.5rem',
                                    height: '1.5rem',
                                }} />
                                <p style={{
                                    margin: 0,
                                    marginLeft: '15px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                }}>Profile</p>
                            </Box>
                        </nav>
                    </div>
                </Box>
            </Box>
        </Box>
    );
}
/**
 *                     <List>
                        <ListItem disablePadding sx={{ display: 'block' }} onClick={() => history.push('/marketplace')}>
                            <ListItemButton
                                sx={{
                                    minHeight: 24,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <LocalGroceryStoreOutlined fontSize='large' />
                                </ListItemIcon>
                                <ListItemText primary={"Marketplace"} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ display: 'block' }} onClick={() => history.push('/profiles')}>
                            <ListItemButton
                                sx={{
                                    minHeight: 24,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <PersonOutline fontSize='large' />
                                </ListItemIcon>
                                <ListItemText primary={"Profile"} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
 */