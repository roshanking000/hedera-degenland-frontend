import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';

import {
    Chat,
    PinDrop,
} from '@mui/icons-material';


import * as env from "../../../env";
import { Box } from '@mui/material';

const BACKGROUND_COLOR = '#ffc0ff';
const ACTIVE_BADGE_COLOR = '#44b700';
const TEXT_COLOR_1 = '#873135';
const TEXT_COLOR_2 = '#3c617e';
const TEXT_COLOR_3 = '#3c617e';

const SORT_TYPE_ASCENDING = 'asc'; //ascending
const SORT_TYPE_DESCENDING = 'des'; //descending
const SORT_TYPE_NONE = 'none'; //none

const pagenationDisplayCount = 5;

function FriendListDlg({
    friendList,
    countOfFriend,
    onClickChatBtn,
    onClickMeetFriendBtn,
    onClickFriendInfo,
    onClickAddFriendBtn,
    onClickCancelBtn,
    onClickSortBtn,
    searchByStr
}) {
    const [_friendList, setFriendList] = useState(friendList);
    const [searchStr, setSearchStr] = useState('');
    const [sortType, setSortType] = useState(SORT_TYPE_NONE);
    const [friendPageIndex, setFriendPageIndex] = useState(1);
    const [currentPageFriendList, setCurrentPageFriendList] = useState([]);

    const friendsStore = useSelector(state => state.friends);

    //Get friendList from store
    useEffect(() => {
        if (_friendList?.length > 0)
            resetFriendListToDisplay(1, _friendList);
    }, []);

    const resetFriendListToDisplay = (pageIndex_, friendList_) => {
        let _startIndex = (pageIndex_ - 1) * pagenationDisplayCount;
        let _endIndex = pageIndex_ * pagenationDisplayCount > friendList_.length ? friendList_.length : pageIndex_ * pagenationDisplayCount;
        setCurrentPageFriendList(friendList_.slice(_startIndex, _endIndex));
    }

    return (
        <div
            style={{
                width: '600px',
                backgroundColor: `${BACKGROUND_COLOR}`,
                padding: '25px 25px 15px',
                overflow: 'hidden'
            }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'right'
            }}>
            </div>
            {
                _friendList?.length > 0 &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'right',
                    paddingTop: '10px',
                    paddingRight: '10px',
                }}>
                    <Pagination
                        sx={{
                            '& li': {
                                padding: '0',
                                '& button': {
                                    '&:focus': {
                                        outline: 'none',
                                    },
                                },
                            },
                        }}
                        page={friendPageIndex}
                        onChange={(event, value) => {
                            resetFriendListToDisplay(value, _friendList);
                            setFriendPageIndex(value);
                        }}
                        count={parseInt(countOfFriend / pagenationDisplayCount) + (countOfFriend % pagenationDisplayCount !== 0 ? 1 : 0)}
                        variant="outlined" />
                </div>
            }
            {
                currentPageFriendList?.length == 0 &&
                <div style={{
                    display: 'flex',
                    font: '13px',
                    fontWeight: '700',
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 0,
                    padding: '10px 0',
                    position: 'relative',
                    borderBottom: 'none',
                    justifyContent: 'center'
                }}>
                    No friends
                </div>
            }
            {
                currentPageFriendList?.length > 0 &&
                currentPageFriendList.map((item, index) => {
                    return <Box key={index} sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 0,
                        padding: '10px 0',
                        position: 'relative',
                        borderBottom: `${index < currentPageFriendList.length - 1 ? '1px solid grey' : 'none'}`,
                        cursor: 'pointer',
                    }}
                        onClick={() => {
                            onClickFriendInfo(item);
                        }}
                    >
                        <Badge
                            overlap='circular'
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant='dot'
                            sx={{
                                '& .MuiBadge-badge': {
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '8px',
                                    backgroundColor: `${item.loginState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
                                    color: `${item.loginState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
                                    '&::after': {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        animation: `${item.loginState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
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
                            <Avatar alt={item.playerId} src={env.SERVER_URL + item.avatarUrl}
                                sx={{
                                    width: 64,
                                    height: 64,
                                    fontSize: '32px',
                                    backgroundColor: '#e0e0e0',
                                    border: '2px solid white'
                                }} />
                        </Badge>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: '10px'
                        }}>
                            <p style={{
                                margin: '0',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: `${TEXT_COLOR_1}`,
                                width: '85px',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden'
                            }}>
                                {item.playerId}
                            </p>
                            <LinearProgress variant='determinate' value={(item.currentLevelScore / item.targetLevelScore) * 100} />
                            <p style={{
                                margin: 0,
                                fontSize: '14px',
                                fontWeight: '700',
                                color: '#1976d2'
                            }}>
                                Level : {item.level}
                            </p>
                        </div>
                        <div style={{
                            margin: '5px 0 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <p style={{
                                color: `${TEXT_COLOR_2}`,
                                fontWeight: '700',
                                margin: '0 0 0 5px',
                                padding: '0',
                                borderBottom: '2px solid #3c617e',
                                fontSize: '16px'
                            }}>
                                Degen
                            </p>
                            <p style={{
                                fontSize: '16px',
                                color: `${TEXT_COLOR_3}`,
                                fontWeight: '700',
                                margin: '0'
                            }}>
                                {item.degenlandCount}
                            </p>
                        </div >
                        <div style={{
                            margin: '5px 0 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <p style={{
                                color: `${TEXT_COLOR_2}`,
                                fontWeight: '700',
                                margin: '0 0 0 5px',
                                padding: '0',
                                borderBottom: '2px solid #3c617e',
                                fontSize: '16px'
                            }}>
                                Tycoon
                            </p>
                            <p style={{
                                fontSize: '16px',
                                color: `${TEXT_COLOR_3}`,
                                fontWeight: '700',
                                margin: '0'
                            }}>
                                {item.tycoonCount}
                            </p>
                        </div >
                        <div style={{
                            margin: '5px 0 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <p style={{
                                color: `${TEXT_COLOR_2}`,
                                fontWeight: '700',
                                margin: '0 0 0 5px',
                                padding: '0',
                                borderBottom: '2px solid #3c617e',
                                fontSize: '16px'
                            }}>
                                Mogul
                            </p>
                            <p style={{
                                fontSize: '16px',
                                color: `${TEXT_COLOR_3}`,
                                fontWeight: '700',
                                margin: '0'
                            }}>
                                {item.mogulCount}
                            </p>
                        </div >
                        <div style={{
                            margin: '5px 0 0 0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <p style={{
                                color: `${TEXT_COLOR_2}`,
                                fontWeight: '700',
                                margin: '0 0 0 5px',
                                padding: '0',
                                borderBottom: '2px solid #3c617e',
                                fontSize: '16px'
                            }}>
                                Investor
                            </p>
                            <p style={{
                                fontSize: '16px',
                                color: `${TEXT_COLOR_3}`,
                                fontWeight: '700',
                                margin: '0'
                            }}>
                                {item.investorCount}
                            </p>
                        </div >
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickChatBtn(item);
                            }}
                            sx={{
                                margin: '0 0 0 20px',
                                backgroundColor: `${ACTIVE_BADGE_COLOR}`,
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: `${ACTIVE_BADGE_COLOR}`
                                },
                                '&:focus': {
                                    outline: 'none'
                                }
                            }}>
                            <Chat sx={{
                                width: 32,
                                height: 32
                            }} />
                        </IconButton>
                    </Box>
                })
            }
            {
                _friendList?.length > 0 &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'right',
                    paddingRight: '10px',
                    paddingBottom: '10px',
                }}>
                    <Pagination
                        sx={{
                            '& li': {
                                padding: '0',
                                '& button': {
                                    '&:focus': {
                                        outline: 'none',
                                    },
                                },
                            },
                        }}
                        page={friendPageIndex}
                        onChange={(event, value) => {
                            resetFriendListToDisplay(value, _friendList);
                            setFriendPageIndex(value);
                        }}
                        count={parseInt(countOfFriend / pagenationDisplayCount) + (countOfFriend % pagenationDisplayCount !== 0 ? 1 : 0)}
                        variant="outlined" />
                </div>
            }
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'right',
            }}>
                <Button
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
                    }}
                    onClick={() => {
                        onClickAddFriendBtn();
                    }}
                >
                    Add Friend
                </Button>
                <Button onClick={() => {
                    setSearchStr('');
                    setSortType(SORT_TYPE_NONE);
                    onClickCancelBtn();
                }}
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

export default FriendListDlg;

/**
 *                         {
                            item.loginState &&
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClickMeetFriendBtn(item);
                                }}
                                sx={{
                                    margin: '0 0 0 20px',
                                    backgroundColor: `${ACTIVE_BADGE_COLOR}`,
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: `${ACTIVE_BADGE_COLOR}`
                                    },
                                    '&:focus': {
                                        outline: 'none'
                                    }
                                }}>
                                <PinDrop sx={{
                                    width: 32,
                                    height: 32
                                }} />
                            </IconButton>
                        }
 */

/* 
                <div style={{
                    width: 240,
                    padding: '0 10px',
                    position: 'relative'
                }}>
                    <TextField
                        hiddenLabel
                        placeholder='Write here to search.'
                        size='small'
                        value={searchStr}
                        onChange={(e) => { setSearchStr(e.target.value) }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                searchByStr(e.target.value, sortType);
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
                        searchByStr(searchStr, sortType);
                    }}
                        sx={{
                            position: 'absolute',
                            right: '11px',
                            '&:focus': {
                                outline: 'none'
                            }
                        }}>
                        <SearchIcon />
                    </IconButton>
                </div>
                <IconButton
                    onClick={() => {
                        setSortType(SORT_TYPE_ASCENDING);
                        onClickSortBtn(searchStr, SORT_TYPE_ASCENDING);
                    }}
                    sx={{
                        width: 42,
                        height: 42,
                        margin: '0 0 0 10px',
                        border: '2px solid #0000008a',
                        color: '#0000008a',
                        backgroundColor: `${sortType === SORT_TYPE_ASCENDING ? '#e74895' : 'transparent'}`,
                        '&:hover': {
                            backgroundColor: `${sortType === SORT_TYPE_ASCENDING ? '#e74895' : 'transparent'}`
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}>
                    <i className="fa fa-sort-numeric-up" />
                </IconButton>
                <IconButton
                    onClick={() => {
                        setSortType(SORT_TYPE_DESCENDING);
                        onClickSortBtn(searchStr, SORT_TYPE_DESCENDING);
                    }}
                    sx={{
                        width: 42,
                        height: 42,
                        margin: '0 0 0 5px',
                        border: '2px solid #0000008a',
                        color: '#0000008a',
                        backgroundColor: `${sortType === SORT_TYPE_DESCENDING ? '#e74895' : 'transparent'}`,
                        '&:hover': {
                            backgroundColor: `${sortType === SORT_TYPE_DESCENDING ? '#e74895' : 'transparent'}`
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    }}>
                    <i className="fa fa-sort-numeric-down" />
                </IconButton>
*/