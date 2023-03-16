import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

import {
    Box,
} from '@mui/material';

import {
    PersonOutline,
    LocalGroceryStoreOutlined,
    LeaderboardOutlined,
    CollectionsOutlined,
    AutoAwesomeMosaicOutlined,
} from '@mui/icons-material';

export default function NavBar() {
    let history = useHistory();

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
                    '& p': {
                        display: 'none',
                    },
                    '&:hover': {
                        width: '15rem',
                        '& p': {
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
                            src={process.env.PUBLIC_URL + "/imgs/logo.png"}
                        >
                        </img>
                        <p style={{
                            margin: 0,
                            marginLeft: '15px',
                            fontSize: '20px',
                            color: 'rgba(209,213,219,1)',
                            fontWeight: '600',
                        }}>Degenland</p>
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
                            <Box sx={APPBAR_STYLE} onClick={() => history.push('/marketplace/1')}>
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
                            <Box sx={APPBAR_STYLE} onClick={() => history.push('/auctions')}>
                                <AutoAwesomeMosaicOutlined fontSize='medium' sx={{
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
                                }}>Auctions</p>
                            </Box>
                            <Box sx={APPBAR_STYLE} onClick={() => history.push('/collections')}>
                                <CollectionsOutlined fontSize='medium' sx={{
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
                                }}>Collections</p>
                            </Box>
                            <Box sx={APPBAR_STYLE} onClick={() => history.push('/sold')}>
                                <LeaderboardOutlined fontSize='medium' sx={{
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
                                }}>Sold</p>
                            </Box>
                            <Box sx={APPBAR_STYLE} onClick={() => history.push('/profiles')}>
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

const APPBAR_STYLE = {
    display: 'flex',
    marginTop: '0.25rem',
    marginBottom: '0.25rem',
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
};