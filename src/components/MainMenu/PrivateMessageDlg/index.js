import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Pagination from '@mui/material/Pagination';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import {
  Chat,
  CallMade,
  CallReceived,
  DeleteForever
} from '@mui/icons-material';

import * as env from "../../../env";

const BACKGROUND_COLOR = '#ffc0ff';
const ACTIVE_BADGE_COLOR = '#44b700';
const TEXT_COLOR_1 = '#873135';
const TEXT_COLOR_2 = '#3c617e';
const TEXT_COLOR_3 = '#3c617e';

const pagenationDisplayCount = 5;

function PrivateMessageDlg({
  myInfo,
  messageList,
  countOfMessage,
  onClickChatBtn,
//  onClickChatDeleteBtn,
  onClickCancelBtn
}) {
  const [messagePageIndex, setMessagePageIndex] = useState(1);
  const [currentPageMessageList, setCurrentPageMessageList] = useState([]);

  useEffect(() => {
    resetMessageListToDisplay(1, messageList);
  }, []);

  const resetMessageListToDisplay = (pageIndex_, messageList_) => {
    let _startIndex = (pageIndex_ - 1) * pagenationDisplayCount;
    let _endIndex = pageIndex_ * pagenationDisplayCount > messageList_.length ? messageList_.length : pageIndex_ * pagenationDisplayCount;
    setCurrentPageMessageList(messageList_.slice(_startIndex, _endIndex));
  }

  return (
    <div
      style={{
        width: '570px',
        backgroundColor: `${BACKGROUND_COLOR}`,
        padding: '25px 25px 15px',
        overflow: 'hidden'
      }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
              backgroundColor: `${myInfo.connectState ? '#44b700' : 'grey'}`,
              color: `${myInfo.connectState ? '#44b700' : 'grey'}`,
              '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: `${myInfo.connectState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
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
          <Avatar alt={myInfo.playerId} src={env.SERVER_URL + myInfo?.avatarUrl}
            sx={{
              width: 96,
              height: 96,
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
            {myInfo.playerId}
          </p>
          <LinearProgress variant='determinate' value={(myInfo.currentLevelScore / myInfo.targetLevelScore) * 100} />
          <p style={{
            margin: '0',
            fontSize: '18px',
            fontWeight: '700',
            color: '#1976d2',
            marginBottom: '5px'
          }}>
            Level : {myInfo.level}
          </p>
        </div>
      </div>
      {
        messageList.length > 0 &&
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
            page={messagePageIndex}
            onChange={(event, value) => {
              resetMessageListToDisplay(value, messageList);
              setMessagePageIndex(value);
            }}
            count={parseInt(countOfMessage / pagenationDisplayCount) + (countOfMessage % pagenationDisplayCount !== 0 ? 1 : 0)}
            variant="outlined" />
        </div>
      }
      {
        messageList.length == 0 &&
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
          No messages
        </div>
      }
      {
        currentPageMessageList.length > 0 &&
        currentPageMessageList.map((item, index) => {
          return <Box key={index} sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 0,
            padding: '10px 0',
            position: 'relative',
            borderBottom: `${index < currentPageMessageList.length - 1 ? '1px solid grey' : 'none'}`,
          }}>
            {
              item.type == 'send' &&
              <CallMade fontSize='small' sx={{
                margin: '0 5px 0 0',
              }} />
            }
            {
              item.type == 'receive' &&
              <CallReceived fontSize='small' sx={{
                margin: '0 5px 0 0',
              }} />
            }
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant='dot'
              sx={{
                '& .MuiBadge-badge': {
                  width: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  backgroundColor: `${item.playerInfo.connectState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
                  color: `${item.playerInfo.connectState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
                  '&::after': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    animation: `${item.playerInfo.connectState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
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
              <Avatar alt={item.playerInfo.playerId} src={env.SERVER_URL + item.playerInfo.avatarUrl}
                sx={{
                  width: 48,
                  height: 48,
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
                {item.playerInfo.playerId}
              </p>
              <LinearProgress variant='determinate' value={(item.playerInfo.currentLevelScore / item.playerInfo.targetLevelScore) * 100} />
              <p style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '700',
                color: '#1976d2'
              }}>
                Level : {item.playerInfo.level}
              </p>
            </div>
            <div style={{
              margin: '5px 0 0 0',
              width: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left'
            }}>
              <p style={{
                color: `${TEXT_COLOR_2}`,
                fontWeight: '700',
                margin: '0 0 0 10px',
                padding: '0',
                fontSize: '16px'
              }}>
                {item.message}
              </p>
            </div>
            {
              myInfo.accountId !== item.playerInfo.accountId &&
              <IconButton
                onClick={(e) => {
                  onClickChatBtn(item.playerInfo);
                }}
                sx={{
                  margin: '0 0 0 10px',
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
            }
          </Box>
        })
      }
      {
        messageList.length > 0 &&
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
            page={messagePageIndex}
            onChange={(event, value) => {
              resetMessageListToDisplay(value, messageList);
              setMessagePageIndex(value);
            }}
            count={parseInt(countOfMessage / pagenationDisplayCount) + (countOfMessage % pagenationDisplayCount !== 0 ? 1 : 0)}
            variant="outlined" />
        </div>
      }
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'right'
      }}>
        <Button onClick={() => {
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

export default PrivateMessageDlg;

/**
 *             {
              myInfo.accountId !== item.playerInfo.accountId &&
              <IconButton
                onClick={(e) => {
                  onClickChatDeleteBtn(item.playerInfo);
                }}
                sx={{
                  margin: '0 0 0 10px',
                  backgroundColor: `${ACTIVE_BADGE_COLOR}`,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: `${ACTIVE_BADGE_COLOR}`
                  },
                  '&:focus': {
                    outline: 'none'
                  }
                }}>
                <DeleteForever sx={{
                  width: 32,
                  height: 32
                }} />
              </IconButton>
            }
 */