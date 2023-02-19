import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getRequest, postRequest } from "../../../assets/api/apiRequests";

import {
  Box,
  Button,
  TextField,
  Badge,
  Avatar,
  LinearProgress,
  CircularProgress,
  Backdrop
} from '@mui/material';

import { useHashConnect } from "../../../assets/api/HashConnectAPIProvider.tsx";

import * as env from "../../../env";

const BACKGROUND_COLOR = '#ffc0ff';
const TEXT_COLOR_1 = '#873135';
const TEXT_COLOR_2 = '#3c617e';

const HBAR_DECIMAL = 8;
const PAL_DECIMAL = 8;

function BuyPalToken({
  myData,
  onClickBuyBtn,
  onClickCancelBtn
}) {
  const { sendHbarToTreasury, autoAssociate } = useHashConnect();

  const [loadingView, setLoadingView] = useState(false);
  const [myInfo, setMyInfo] = useState(myData);
  const [balanceInfo, setBalanceInfo] = useState({ hbar: 0, pal: 0 });

  const [hbarAmount, setHbarAmount] = useState(0);
  const [palAmount, setPalAmount] = useState(0);

  useEffect(() => {
    if (myInfo?.accountId)
      getWalletBalance(myInfo.accountId);
  }, [myInfo]);

  const changeToRealValue = (value_, decimal_) => {
    return parseFloat(value_ / (10 ** decimal_)).toFixed(3);
  }

  const getWalletBalance = async (accountId_) => {
    setLoadingView(true);
    let g_hbarBalance, g_palBalance;

    let g_hbarBalanceInfo = await getInfoResponse(env.MIRROR_NET_URL + "/api/v1/balances?account.id=" + accountId_);
    if (!g_hbarBalanceInfo || g_hbarBalanceInfo.data.balances?.length === 0) {
      g_hbarBalance = 0;
    }
    else {
      g_hbarBalance = g_hbarBalanceInfo.data.balances[0].balance;
    }

    const g_palBalanceInfo = await getInfoResponse(`${env.MIRROR_NET_URL}/api/v1/accounts/${accountId_}/tokens?token.id=${env.PAL_TOKEN_ID}`);

    if (g_palBalanceInfo.data.tokens?.length == 0)
      g_palBalance = 0;
    else
      g_palBalance = g_palBalanceInfo.data.tokens[0].balance;

    setBalanceInfo({
      hbar: g_hbarBalance,
      pal: g_palBalance
    });
    setLoadingView(false);
  }

  const getWalletBalanceOfTreasury = async (accountId_) => {
    let g_palBalance;

    const g_palBalanceInfo = await getInfoResponse(`${env.MIRROR_NET_URL}/api/v1/accounts/${accountId_}/tokens?token.id=${env.PAL_TOKEN_ID}`);

    if (g_palBalanceInfo.data.tokens?.length == 0)
      g_palBalance = 0;
    else
      g_palBalance = g_palBalanceInfo.data.tokens[0].balance;

    return g_palBalance;
  }

  const associateCheck = async (accountId, tokenId) => {
    try {
      const associateInfo = await getInfoResponse(`${env.MIRROR_NET_URL}/api/v1/accounts/${accountId}/tokens?token.id=${tokenId}`);

      // already associated
      if (associateInfo.data.tokens?.length > 0)
        return { result: true, associated: true };

      return { result: true, associated: false };
    } catch (error) {
      return { result: false, error: error.message };
    }
  }

  const buyPalToken = async (hbarAmount, palAmount) => {
    const _approveResult = await sendHbarToTreasury(hbarAmount);

    if (!_approveResult) {
      setLoadingView(false);
      toast.error("something wrong with approve!");
      return false;
    }

    setLoadingView(true);
    const nftData = {
      a: btoa(myInfo.accountId),
      b: btoa(hbarAmount),
      c: btoa(palAmount),
      d: btoa(myInfo.playerId)
    };

    const _postResult = await postRequest(env.SERVER_URL + "/api/stake/buy_pal_token", nftData);

    if (!_postResult) {
      toast.error("Something wrong with server!");
      setLoadingView(false);
      return false;
    }

    if (!_postResult.result) {
      toast.error(_postResult.error);
      setLoadingView(false);
      return false;
    }

    return true;
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
    <div style={{
      backgroundColor: `${BACKGROUND_COLOR}`,
      padding: '25px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
              {myInfo.playerId}
            </p>
            <p style={{
              margin: '0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#1976d2',
              marginBottom: '5px'
            }}>
              Level : {myInfo.level}
            </p>
            <LinearProgress variant='determinate' value={(myInfo.currentLevelScore / myInfo.targetLevelScore) * 100} />
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0 0 0 20px'
        }}>
          <Button variant='outlined' sx={{
            fontSize: 12,
            color: `${TEXT_COLOR_1}`,
            fontWeight: 700,
            padding: '0 7px',
            margin: '5px 0',
            borderRadius: 16,
            borderColor: `${TEXT_COLOR_1}`,
            '&:hover': {
              borderColor: `${TEXT_COLOR_1}`,
            },
            '&:focus': {
              outline: 'none'
            }
          }}>
            {changeToRealValue(balanceInfo.hbar, HBAR_DECIMAL)} HBAR
          </Button>
          <Button variant='outlined' sx={{
            fontSize: 12,
            color: `${TEXT_COLOR_2}`,
            fontWeight: 700,
            padding: '0 7px',
            margin: '5px 0',
            borderRadius: 16,
            borderColor: `${TEXT_COLOR_2}`,
            '&:hover': {
              borderColor: `${TEXT_COLOR_2}`,
            },
            '&:focus': {
              outline: 'none'
            }
          }}>
            {changeToRealValue(balanceInfo.pal, PAL_DECIMAL)} PAL
          </Button>
        </div>
      </div>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/** HBAR balance */}
        <TextField sx={MAIN_TEXTFIELD_STYLE}
          label="HBAR"
          type="text"
          size="small"
          pattern="[0-9]*"
          value={hbarAmount}
          onChange={(e) => {
            const regex = /^[0-9\b]+$/;
            if (e.target.value == "" || regex.test(e.target.value)) {
              setHbarAmount(e.target.value);
              setPalAmount(e.target.value * env.PAL_TOKEN_RATIO);
            }
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        {/** PAL balance */}
        <TextField sx={PAL_FIELD_STYLE}
          label="PAL"
          type="number"
          size="small"
          value={palAmount}
          InputLabelProps={{
            shrink: true,
          }}
          disabled
        />
      </Box>
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
        <Button
          onClick={async () => {
            const hbarBalance = parseInt(hbarAmount, 10);
            const palBalance = parseInt(palAmount, 10);
            setLoadingView(true);

            // balance check
            if (hbarBalance > changeToRealValue(balanceInfo.hbar, HBAR_DECIMAL)) {
              toast.error("Insufficient HBAR balance!");
              setLoadingView(false);
              return;
            }

            const palBalanceOfTreasury = await getWalletBalanceOfTreasury(env.TREASURY_ID);
            if (palBalance > changeToRealValue(palBalanceOfTreasury, PAL_DECIMAL)) {
              toast.error("Insufficient PAL balance!");
              setLoadingView(false);
              return;
            }
            // associate check
            const getResult = await associateCheck(myInfo.accountId, env.PAL_TOKEN_ID);
            if (!getResult.result) {
              toast.error(getResult.error);
              setLoadingView(false);
              return;
            }
            if (getResult.associated == false) {
              const _associateResult = await autoAssociate();

              if (!_associateResult) {
                setLoadingView(false);
                toast.error("something wrong with associate!");
                return false;
              }
            }
            // check success
            setLoadingView(false);
            const result = await buyPalToken(hbarBalance, palBalance);
            if (result == true) {
              setLoadingView(false);
              await getWalletBalance(myInfo.accountId);
              toast.success("success!");
              onClickBuyBtn();
            }
          }} sx={{
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
          disabled={hbarAmount <= 0}
        >
          Buy
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
      <div style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingView}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer autoClose={5000} draggableDirection="x" />
    </div >
  );
}

export default BuyPalToken;

// styles

const MAIN_TEXTFIELD_STYLE = {
  width: 175,
  height: 42,
  margin: '10px 0',
  '& .MuiInputBase-root': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#873135',
    },
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#873135',
      }
    }
  },
  '& .MuiFormLabel-root': {
    color: '#873135',
    fontWeight: '700',
  },
}

const PAL_FIELD_STYLE = {
  width: 175,
  height: 42,
  margin: '10px 0',
  '& .MuiInputBase-root': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#873135',
    },
  },
  '& .MuiFormLabel-root': {
    color: '#873135',
    fontWeight: '700',
  },
}