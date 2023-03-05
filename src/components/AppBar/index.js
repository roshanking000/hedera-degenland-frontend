import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

import {
    Button,
    IconButton,
    Badge,
    Divider,
    Menu,
    MenuItem,
} from '@mui/material';

import {
    NotificationsOutlined
} from '@mui/icons-material';

export default function AppBar({
    alertInfo,
}) {
    let history = useHistory();

    const [alertMenuAnchor, setAlertMenuAnchor] = useState(null);
    const alertMenuOpenFlag = Boolean(alertMenuAnchor);

    const onClickAlertMenuItem = async (alertItemInfo) => {
    }

    return (
        <>
            <div style={{
                display: 'flex',
                position: 'sticky',
                justifyContent: 'end',
                alignItems: 'center',
                height: '4rem',
                backgroundColor: '#121212',
                zIndex: '40',
                top: 0,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: '0.5rem',
                    marginRight: '1rem',
                }}>
                    <IconButton
                        sx={{
                            color: 'gray',
                            '&:hover': {
                                color: 'whitesmoke',
                                cursor: 'pointer',
                            },
                            '&:focus': {
                                outline: 'none',
                                boxShadow: 'none',
                            },
                        }}
                        onClick={(e) => {
                            setAlertMenuAnchor(e.currentTarget);
                        }}
                    >
                        <Badge
                            sx={{
                                'z-index': '0'
                            }}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={alertInfo.length}
                            color='success'
                        >
                            <NotificationsOutlined fontSize='large' />
                        </Badge>
                    </IconButton>
                    <Button onClick={() => {
                        history.push('/profiles');
                    }}
                        variant='outlined'
                        sx={{
                            color: 'blueviolet',
                            fontWeight: '700',
                            padding: '0.25rem 1rem 0.25rem 1rem',
                            backgroundColor: 'rgba(17,24,39,1)',
                            borderColor: 'blueviolet',
                            borderWidth: '2px',
                            borderRadius: '0.5rem',
                            lineHeight: 'inherit',
                            fontSize: '100%',
                            '&:hover': {
                                color: 'white',
                                backgroundColor: 'blueviolet',
                                borderColor: 'blueviolet',
                            },
                            '&:focus': {
                                outline: 'none',
                                boxShadow: 'none',
                            }
                        }}>
                        Profile
                    </Button>
                    <Button onClick={() => {
                        history.push('/login');
                    }}
                        variant='outlined'
                        sx={{
                            color: 'gray',
                            fontWeight: '700',
                            padding: '0.25rem 1rem 0.25rem 1rem',
                            backgroundColor: 'rgba(17,24,39,1)',
                            borderColor: 'gray',
                            borderWidth: '2px',
                            borderRadius: '0.5rem',
                            lineHeight: 'inherit',
                            fontSize: '100%',
                            '&:hover': {
                                borderWidth: '2px',
                                color: 'whitesmoke',
                                borderColor: 'whitesmoke',
                            },
                            '&:focus': {
                                outline: 'none',
                                boxShadow: 'none',
                            }
                        }}>
                        Logout
                    </Button>
                </div>
            </div>
            <Menu
                anchorEl={alertMenuAnchor}
                id='account-menu'
                open={alertMenuOpenFlag}
                onClick={() => {
                    setAlertMenuAnchor(null);
                }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: 16,
                            width: 10,
                            height: 10,
                            backgroundColor: 'white',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                {
                    alertInfo.length > 0 &&
                    alertInfo.map((item, index) => {
                        return <div key={index}>
                            <MenuItem onClick={() => { onClickAlertMenuItem(item) }}>
                                <p style={{
                                    fontSize: 13,
                                    margin: '0 0 0 5px',
                                    textTransform: 'none'
                                }}>
                                    Got offer from $asdf
                                </p>
                            </MenuItem>
                            {
                                index < alertInfo.length - 1 &&
                                <Divider />
                            }
                        </div>
                    })
                }
                {
                    alertInfo?.length == 0 &&
                    <div>
                        <MenuItem>
                            <p style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: '#8b1832',
                                margin: '0 0 0 5px',
                                textTransform: 'none'
                            }}>
                                No notification
                            </p>
                        </MenuItem>
                    </div>
                }
            </Menu>
        </>
    );
}
