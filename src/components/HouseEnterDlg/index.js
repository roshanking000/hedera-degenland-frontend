import React, { useState } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';

import PersonIcon from '@mui/icons-material/Person';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as env from "../../env";

const TITLE_COLOR = '#8b1832';

function HouseEnterDlg({
  buildingInfo,
  ownerInfo,
  onClickEnterBtn,
  onClickCancelBtn
}) {
  const playerinfoStore = useSelector(state => state.playerinfo);
  const buildinginfoStore = useSelector(state => state.buildinginfo);

  const [loadingView, setLoadingView] = useState(false);

  const checkTicket = async (accountId_) => {
    setLoadingView(true);

    let g_nextLink = null;
    let g_WNinfo = await getInfoResponse(env.MIRROR_NET_URL + "/api/v1/accounts/" + accountId_ + "/nfts");
    if (g_WNinfo && g_WNinfo.data.nfts.length > 0)
      g_nextLink = g_WNinfo.data.links.next;

    while (1) {
      let g_tempNftInfo = g_WNinfo.data.nfts;
      for (let i = 0; i < g_tempNftInfo.length; i++) {
        if (g_tempNftInfo[i].token_id === buildinginfoStore.ticket.ticketId) {
          return true;
        }
      }

      if (!g_nextLink || g_nextLink === null) break;

      g_WNinfo = await getInfoResponse(env.MIRROR_NET_URL + g_nextLink);
      g_nextLink = null;
      if (g_WNinfo && g_WNinfo.data.nfts.length > 0)
        g_nextLink = g_WNinfo.data.links.next;
    }
    setLoadingView(false);
    return false;
  }

  // axios get
  const getInfoResponse = async (urlStr_) => {
    try {
      return await axios.get(urlStr_);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffc0ff',
        width: '480px',
        padding: '15px',
        overflow: 'hidden'
      }}>
      {/* building info */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: '20px 0 20px 20px',
        position: 'relative',
      }}>
        <Avatar alt="building" src={env.IMG_URL + buildingInfo.url} variant="square"
          sx={{
            width: 192,
            height: 164,
            fontSize: '64px',
            backgroundColor: '#e0e0e0',
            border: '2px solid white'
          }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '20px'
        }}>
          <p style={{
            margin: '0',
            fontSize: '24px',
            fontWeight: '700',
            color: '#873135'
          }}>
            {buildingInfo.name}
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '180px',
            marginTop: '5px'
          }}>
          </div>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: '2px',
          backgroundColor: `${TITLE_COLOR}`,
          position: 'relative'
        }}
      >
        <PersonIcon style={{
          color: 'white',
          backgroundColor: `${TITLE_COLOR}`,
          width: '42px',
          height: '42px',
          borderRadius: '21px',
          padding: '2px',
          position: 'absolute',
          top: '-20px',
          left: 'calc(50% - 21px)'
        }} />
      </div>
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
              backgroundColor: `${ownerInfo.connectState ? '#44b700' : 'grey'}`,
              color: `${ownerInfo.connectState ? '#44b700' : 'grey'}`,
              '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: `${ownerInfo.connectState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
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
          <Avatar alt={ownerInfo.playerId} src={env.SERVER_URL + ownerInfo.avatarUrl}
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
            width: 180,
            margin: '0',
            fontSize: '24px',
            fontWeight: '700',
            color: '#873135',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {ownerInfo.playerId}
          </p>
          <LinearProgress variant='determinate' value={(ownerInfo.currentLevelScore / ownerInfo.targetLevelScore) * 100} />
          <p style={{
            margin: '0',
            fontSize: '18px',
            fontWeight: '700',
            color: '#1976d2',
            marginBottom: '5px'
          }}>
            Level : {ownerInfo.level}
          </p>
        </div>
      </div>
      {
        buildinginfoStore.ticket !== null && buildinginfoStore.ticket.ticketId !== null &&
        <div>
          <div
            style={{
              width: '100%',
              height: '2px',
              backgroundColor: `${TITLE_COLOR}`,
              position: 'relative'
            }}
          >
            <StickyNote2Icon style={{
              color: 'white',
              backgroundColor: `${TITLE_COLOR}`,
              width: '42px',
              height: '42px',
              borderRadius: '21px',
              padding: '2px',
              position: 'absolute',
              top: '-20px',
              left: 'calc(50% - 21px)'
            }} />
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            margin: '20px 0 20px 20px',
            position: 'relative',
          }}>
            <img alt='ticket' src={buildinginfoStore.ticket?.imgUrl}
              style={{
                width: '128px',
                height: '128px',
                border: '2px solid #873135',
                borderRadius: '5px'
              }}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '20px'
            }}>
              <p style={{
                color: '#873135',
                fontWeight: '700',
                margin: '0 0 0 5px',
                borderBottom: '2px solid #873135',
              }}>
                This is the Nightclub ticket
              </p>
              <p style={{
                fontSize: '20px',
                color: '#2b3283',
                fontWeight: '700',
              }}>
                {buildinginfoStore.ticket.ticketId}
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '180px',
                marginTop: '5px'
              }}>
              </div>
            </div>
          </div>
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
        <Button onClick={async () => {
          if (buildinginfoStore.ticket.ticketId != null) {
            const res = await checkTicket(playerinfoStore.data.accountId);
            if (!res)
              toast.error("You have no ticket!");
            else
              onClickEnterBtn();
          }
          else
            onClickEnterBtn();
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
          Enter
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
      <ToastContainer autoClose={5000} draggableDirection="x" />
    </div>
  );
}

export default HouseEnterDlg;