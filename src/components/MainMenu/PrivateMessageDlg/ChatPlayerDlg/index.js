import React, { useState } from 'react';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

import * as env from "../../../../env";

function ChatPlayerDlg({
  friendInfo,
  onClickSendPVMsgBtn,
  onClickOKBtn,
  onClickDetailBtn,
  onClickCancelBtn
}) {
  const [privateMsgStr, setPrivateMsgStr] = useState('');

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
              backgroundColor: `${friendInfo.connectState ? '#44b700' : 'grey'}`,
              color: `${friendInfo.connectState ? '#44b700' : 'grey'}`,
              '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: `${friendInfo.connectState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
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
          <Avatar alt={friendInfo.playerId} src={env.SERVER_URL + friendInfo?.avatarUrl}
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
            {friendInfo.playerId}
          </p>
          <LinearProgress variant='determinate' value={(friendInfo.currentLevelScore / friendInfo.targetLevelScore) * 100} />
          <p style={{
            margin: '0',
            fontSize: '18px',
            fontWeight: '700',
            color: '#1976d2',
            marginBottom: '5px'
          }}>
            Level : {friendInfo.level}
          </p>
        </div>
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
                {friendInfo.degenlandCount}
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
                {friendInfo.tycoonCount}
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
                {friendInfo.mogulCount}
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
                {friendInfo.investorCount}
              </p>
            </div>
          </div >
        </div>
      </div>
      {/* private message */}
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
              onClickSendPVMsgBtn(e.target.value, friendInfo.accountId, friendInfo.playerId);
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
          onClickSendPVMsgBtn(privateMsgStr, friendInfo.accountId, friendInfo.playerId);
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
        <Button onClick={() => {
          onClickDetailBtn(friendInfo);
        }}
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
          Detail
        </Button>
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

export default ChatPlayerDlg;
