import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PersonIcon from '@mui/icons-material/Person';
//Icon
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { useHashConnect } from "../../../assets/api/HashConnectAPIProvider.tsx";
import * as env from "../../../env";

const TITLE_COLOR = '#8b1832';

function ProfileDlg({
    onClickEditBtn,
    onClickCancelBtn
}) {
    const history = useHistory();
    const myProfile = useSelector(state => state.playerinfo.data);
    const { disconnect } = useHashConnect();

    const onClickDisconnectWalletBtn = () => {
        disconnect();
        history.push('/login');
    }

    const onClickLogoutBtn = () => {
        history.push('/login');
    }

    return (
        <div
            style={{
                backgroundColor: '#ffc0ff',
                padding: '15px',
                overflow: 'hidden'
            }}>
            {/* account info */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                margin: '20px 0 20px 20px',
                position: 'relative'
            }}>
                <Badge
                    overlap='circular'
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant='dot'
                    sx={{
                        '& .MuiBadge-badge': {
                            width: '32px',
                            height: '32px',
                            borderRadius: '16px',
                            margin: '3px',
                            backgroundColor: `${myProfile.connectState ? '#44b700' : 'grey'}`,
                            color: `${myProfile.connectState ? '#44b700' : 'grey'}`,
                            '&::after': {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                animation: `${myProfile.connectState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
                                border: '1px solid currentColor',
                                content: '""',
                            },
                        },
                        '@keyframes ripple': {
                            '0%': {
                                transform: 'scale(.8)',
                                opacity: 1,
                            },
                            '100%': {
                                transform: 'scale(2.4)',
                                opacity: 0,
                            },
                        },
                    }}
                >
                    <Avatar alt={myProfile.playerId} src={env.SERVER_URL + myProfile.avatarUrl}
                        sx={{
                            width: 128,
                            height: 128,
                            fontSize: '64px',
                            backgroundColor: '#e0e0e0',
                            border: '2px solid white'
                        }} />
                </Badge>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <p style={{
                            width: 180,
                            margin: '0',
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#873135',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {myProfile.playerId}
                        </p>
                        <Button onClick={onClickEditBtn}
                            sx={{
                                height: '25px',
                                borderRadius: '21px',
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 700,
                                color: 'white',
                                padding: '0 25px',
                                backgroundColor: '#e74895',
                                marginRight: '5px',
                                '&:hover': {
                                    backgroundColor: 'grey',
                                    boxShadow: 'none',
                                },
                                '&:focus': {
                                    outline: 'none',
                                    boxShadow: 'none',
                                }
                            }}>
                            Edit
                        </Button>
                    </div>
                    <LinearProgress variant='determinate' value={(myProfile.currentLevelScore / myProfile.targetLevelScore) * 100} />
                    <p style={{
                        margin: '0',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1976d2',
                        marginBottom: '5px'
                    }}>
                        Level : {myProfile.level}
                    </p>
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '450px',
                    heigh: '110px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{
                        width: '215px',
                        heigh: '100px',
                        margin: '0 5px',
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img alt='...' src="imgs/front/nfts/degenland.png"
                            style={{
                                margin: '5px',
                                width: '100px',
                                height: '100px',
                                border: '2px solid #873135',
                                borderRadius: '5px'
                            }} />
                        <div>
                            <p style={{
                                color: '#873135',
                                fontWeight: '700',
                                margin: '0 0 0 5px',
                                padding: '10px 0 5px 0',
                                borderBottom: '2px solid #873135'
                            }}>
                                Degen
                            </p>
                            <p style={{
                                fontSize: '20px',
                                color: '#2b3283',
                                fontWeight: '700',
                                margin: '5px 0 0 5px'
                            }}>
                                {myProfile.degenlandCount}
                            </p>
                        </div>
                    </div >
                    <div style={{
                        width: '215px',
                        heigh: '100px',
                        margin: '0 5px',
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img alt='...' src="imgs/front/nfts/tycoon.png"
                            style={{
                                margin: '5px',
                                width: '100px',
                                height: '100px',
                                border: '2px solid #873135',
                                borderRadius: '5px'
                            }} />
                        <div>
                            <p style={{
                                color: '#873135',
                                fontWeight: '700',
                                margin: '0 0 0 5px',
                                padding: '10px 0 5px 0',
                                borderBottom: '2px solid #873135'
                            }}>
                                Tycoon
                            </p>
                            <p style={{
                                fontSize: '20px',
                                color: '#2b3283',
                                fontWeight: '700',
                                margin: '5px 0 0 5px'
                            }}>
                                {myProfile.tycoonCount}
                            </p>
                        </div>
                    </div >
                </div>
                <div style={{
                    width: '450px',
                    heigh: '110px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{
                        width: '215px',
                        heigh: '100px',
                        margin: '0 5px',
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img alt='...' src="imgs/front/nfts/mogul.png"
                            style={{
                                margin: '5px',
                                width: '100px',
                                height: '100px',
                                border: '2px solid #873135',
                                borderRadius: '5px'
                            }} />
                        <div>
                            <p style={{
                                color: '#873135',
                                fontWeight: '700',
                                margin: '0 0 0 5px',
                                padding: '10px 0 5px 0',
                                borderBottom: '2px solid #873135'
                            }}>
                                Mogul
                            </p>
                            <p style={{
                                fontSize: '20px',
                                color: '#2b3283',
                                fontWeight: '700',
                                margin: '5px 0 0 5px'
                            }}>
                                {myProfile.mogulCount}
                            </p>
                        </div>
                    </div >
                    <div style={{
                        width: '215px',
                        heigh: '100px',
                        margin: '0 5px',
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <img alt='...' src="imgs/front/nfts/investor.png"
                            style={{
                                margin: '5px',
                                width: '100px',
                                height: '100px',
                                border: '2px solid #873135',
                                borderRadius: '5px'
                            }} />
                        <div>
                            <p style={{
                                color: '#873135',
                                fontWeight: '700',
                                margin: '0 0 0 5px',
                                padding: '10px 0 5px 0',
                                borderBottom: '2px solid #873135'
                            }}>
                                Investor
                            </p>
                            <p style={{
                                fontSize: '20px',
                                color: '#2b3283',
                                fontWeight: '700',
                                margin: '5px 0 0 5px'
                            }}>
                                {myProfile.investorCount}
                            </p>
                        </div>
                    </div >
                </div>
            </div>
            {/* buttons */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'right',
                margin: '20px 0',
                width: '100%',
                padding: '0 20px'
            }}>
                <Button onClick={onClickCancelBtn}
                    variant='outlined'
                    sx={{
                        height: '42px',
                        borderRadius: '21px',
                        textTransform: 'none',
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#e74895',
                        padding: '0 25px',
                        border: '3px solid #e74895',
                        '&:hover': {
                            backgroundColor: 'grey',
                            border: '3px solid grey',
                            color: 'white',
                            boxShadow: 'none',
                        },
                        '&:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                        }
                    }}>
                    Cancel
                </Button>
            </div>
        </div >
    );
}

export default ProfileDlg;

/*
                <Button onClick={onClickDisconnectWalletBtn}
                    sx={{
                        height: '42px',
                        borderRadius: '21px',
                        textTransform: 'none',
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'white',
                        padding: '0 25px',
                        backgroundColor: '#e74895',
                        marginRight: '20px',
                        '&:hover': {
                            backgroundColor: 'grey',
                            boxShadow: 'none',
                        },
                        '&:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                        }
                    }}>
                    Disconnect Wallet
                </Button>
                <Button onClick={onClickLogoutBtn}
                    sx={{
                        height: '42px',
                        borderRadius: '21px',
                        textTransform: 'none',
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'white',
                        padding: '0 25px',
                        backgroundColor: '#e74895',
                        marginRight: '20px',
                        '&:hover': {
                            backgroundColor: 'grey',
                            boxShadow: 'none',
                        },
                        '&:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                        }
                    }}>
                    Logout
                </Button>
*/