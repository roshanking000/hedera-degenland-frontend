import React, { useState } from 'react';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

function PlayerInfoDlg({
    playerId,
    playerLvl,
    lvlProcess,
    friendFlag,
    isinvited,
    aliveFlag,
    avatarUrl,
    degenlandImgUrl,
    degenlandNftCount,
    tycoonImgUrl,
    tycoonNftCount,
    mogulImgUrl,
    mogulNftCount,
    investorImgUrl,
    investorNftCount,
    onClickSendPVMsgBtn,
    onClickInviteBtn,
    onClickOKBtn,
    onClickInfoBtn,
    onClickCancelBtn
}) {
    const [privateMsgStr, setPrivateMsgStr] = useState('');
    console.log(avatarUrl);

    return (
        <div
            style={{
                backgroundColor: '#ffc0ff',
                width: '480px',
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
                            backgroundColor: `${aliveFlag ? '#44b700' : 'grey'}`,
                            color: `${aliveFlag ? '#44b700' : 'grey'}`,
                            '&::after': {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                animation: `${aliveFlag ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
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
                    <Avatar alt={playerId} src={avatarUrl}
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
                    <p style={{
                        margin: '0',
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#873135',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    }}>
                        {playerId}
                    </p>
                    <LinearProgress variant='determinate' value={lvlProcess} />
                    <p style={{
                        margin: '0',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1976d2',
                        marginBottom: '5px'
                    }}>
                        Level : {playerLvl}
                    </p>
                </div>
                {
                    friendFlag &&
                    <div style={{
                        backgroundColor: '#e74895',
                        position: 'absolute',
                        width: '200px',
                        height: '56px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        padding: '7px 0',
                        rotate: '-45deg',
                        top: '-30px',
                        left: '-102px',
                        boxShadow: '#0000003d 0px 3px 8px'
                    }}>
                        <img alt='' src={require('./imgs/friend-icon.png')}
                            style={{
                                height: '100%'
                            }} />
                    </div>
                }
            </div>
            {/* nfts */}
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
                        <img alt='...' src={degenlandImgUrl}
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
                                {degenlandNftCount}
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
                        <img alt='...' src={tycoonImgUrl}
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
                                {tycoonNftCount}
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
                        <img alt='...' src={mogulImgUrl}
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
                                {mogulNftCount}
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
                        <img alt='...' src={investorImgUrl}
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
                                {investorNftCount}
                            </p>
                        </div>
                    </div >
                </div>
            </div>
            {/* private message */}
            {
                friendFlag &&
                <div style={{
                    marginTop: '20px',
                    padding: '0 10px',
                    position: 'relative'
                }}>
                    <TextField
                        hiddenLabel
                        placeholder='Write private message here.'
                        size='small'
                        value={privateMsgStr}
                        onChange={(e) => { setPrivateMsgStr(e.target.value) }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                onClickSendPVMsgBtn(e.target.value);
                                setPrivateMsgStr('');
                            }
                        }}
                        sx={{
                            width: '100%',
                            '& .MuiInputBase-root': {
                                borderRadius: '30px',
                                '&:hover': {
                                    outline: 'none',
                                    border: 'none'
                                }
                            }
                        }}
                    />
                    <IconButton onClick={() => {
                        onClickSendPVMsgBtn(privateMsgStr);
                        setPrivateMsgStr('');
                    }}
                        sx={{
                            position: 'absolute',
                            right: '11px',
                            '&:focus': {
                                outline: 'none'
                            }
                        }}>
                        <SendIcon />
                    </IconButton>
                </div>
            }
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
                {
                    !friendFlag && !isinvited &&
                    <Button onClick={onClickInviteBtn}
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
                        Invite
                    </Button>
                }
                {
                    !friendFlag && isinvited &&
                    <Button onClick={onClickOKBtn}
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
                        OK
                    </Button>
                }
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

export default PlayerInfoDlg;
