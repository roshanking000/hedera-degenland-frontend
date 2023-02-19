import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  Badge,
  Avatar,
  LinearProgress,
  Grid,
  TextField,
  CircularProgress,
  Backdrop
} from '@mui/material';

import {
  SwapHorizontalCircle
} from '@mui/icons-material';

import LandNftCard from './LandNftCard';
import NormalNftCard from './NormalNftCard';

import * as env from "../../../../env";

import { useHashConnect } from "../../../../assets/api/HashConnectAPIProvider.tsx";
import { getRequest, postRequest } from "../../../../assets/api/apiRequests";

const BACKGROUND_COLOR = '#ffc0ff';
const ACTIVE_BADGE_COLOR = '#44b700';
const TEXT_COLOR_1 = '#873135';

const HBAR_DECIMAL = 8;
const PAL_DECIMAL = 8;

function OfferDetailDlg({
  providerInfo,
  offerInfo,
  isStaked,
  offerState,
  claimableState,
  offerType,
  onClickFriend,
  onClickClaimBtn,
  onClickAcceptBtn,
  onClickDeclineBtn,
  onClickCancelBtn
}) {
  const { walletData, receiveMultipleNfts, sendHbarAndMultiNftsToTreasury } = useHashConnect();
  const { accountIds } = walletData;

  const [loadingView, setLoadingView] = useState(false);
  const [offer, setOffer] = useState({ offerInfo });

  const getWalletBalance = async (accountId_) => {
    let g_hbarBalance, g_palBalance;

    let g_hbarBalanceInfo = await getRequest(env.MIRROR_NET_URL + "/api/v1/balances?account.id=" + accountId_);
    if (!g_hbarBalanceInfo || g_hbarBalanceInfo.balances?.length === 0) {
      g_hbarBalance = 0;
    }
    else {
      g_hbarBalance = g_hbarBalanceInfo.balances[0].balance;
    }

    let g_palBalanceInfo = await getRequest(`${env.MIRROR_NET_URL}/api/v1/accounts/${accountId_}/tokens?token.id=${env.PAL_TOKEN_ID}`);

    if (g_palBalanceInfo.tokens?.length == 0)
      g_palBalance = 0;
    else
      g_palBalance = g_palBalanceInfo.tokens[0].balance;

    const balanceInfo = {
      hbar: g_hbarBalance,
      pal: g_palBalance
    };

    return balanceInfo;
  }

  const changeToRealValue = (value_, decimal_) => {
    return parseFloat(value_ / (10 ** decimal_)).toFixed(3);
  }

  /**
   * Claim Request
   */
  const onClickClaimCollectionButton = async (swapId, token, offerId, state) => {
    setLoadingView(true);
    if (!accountIds) {
      toast.error("Connect wallet!");
      setLoadingView(false);
      return false;
    }

    const _getClaimNfts = await getRequest(env.SERVER_URL + "/api/stake/get_listed_nfts?swapId=" + btoa(swapId));

    if (!_getClaimNfts || _getClaimNfts?.length === 0) {
      toast.error("Something wrong with NFTs");
      setLoadingView(false);
      return false;
    }

    const _nftData = _getClaimNfts.data;

    const _getClaimState = await getRequest(env.SERVER_URL + "/api/nftswapoffer/get_claim_state?offerId=" + offerId + "&accountId=" + accountIds[0]);
    if (!_getClaimState.result) {
      toast.error(_getClaimState.error);
      setLoadingView(false);
      return false;
    }

    if (_getClaimState.data == false) {
      const _claimRequestResult = await postRequest(env.SERVER_URL + "/api/stake/claim_request", { swapId: btoa(swapId) });
      if (!_claimRequestResult.result) {
        toast.error(_claimRequestResult.error);
        return false;
      }
      else {
        const claimData = {
          offerId: offerId,
          accountId: accountIds[0],
          state: true
        }
        const _setClaimRequest = await postRequest(env.SERVER_URL + "/api/nftswapoffer/set_claim_state", claimData);
        if (!_setClaimRequest.result) {
          toast.error(_setClaimRequest.error);
          return false;
        }
      }
    }

    const _receiveResult = await receiveMultipleNfts(_nftData, token.hbar, token.pal);
    if (!_receiveResult) {
      toast.error(`Something wrong with claim!`);
      setLoadingView(false);
      return false;
    }

    await postRequest(env.SERVER_URL + "/api/nft/add_nft_list", { accountId: btoa(accountIds[0]), nftData: btoa(JSON.stringify(_nftData)) });
    await postRequest(env.SERVER_URL + "/api/stake/delete_collection", { swapId: btoa(swapId), offerId: btoa(offerId), accountId: btoa(accountIds[0]), state: btoa(state) });

    toast.success("Claim success!");
    setLoadingView(false);
    return true;
  }

  /**
 * Click approve button
 */
  const onClickApproveNfts = async (_offerId, _type, _tickedNfts, myHbar, myPal) => {
    if (!accountIds) {
      toast.warning("You need to connect wallet for approve!");
      setLoadingView(false);
      return false;
    }

    let associateFee = 0;
    const _hbarResult = await getRequest('https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd');
    console.log(_hbarResult);
    if (_hbarResult.result == false)
      associateFee = Math.ceil(parseFloat(env.NFT_ASSOCIATE_FEE * _tickedNfts.length) / parseFloat(env.DEFAULT_HBAR_PRICE));
    else {
      if (_hbarResult)
        associateFee = Math.ceil(parseFloat(env.NFT_ASSOCIATE_FEE * _tickedNfts.length) / parseFloat(_hbarResult["hedera-hashgraph"].usd));
      else
        associateFee = Math.ceil(parseFloat(env.NFT_ASSOCIATE_FEE * _tickedNfts.length) / parseFloat(env.DEFAULT_HBAR_PRICE));
    }
    console.log(associateFee);

    myHbar = parseInt(myHbar, 10);

    let _hbarAmount = myHbar + associateFee;
    let _fallbackFee = 0;
    for (let i = 0; i < _tickedNfts.length; i++)
      _fallbackFee += parseInt(_tickedNfts[i].fallback, 10);
    _hbarAmount += _fallbackFee;
    const _approveResult = await sendHbarAndMultiNftsToTreasury(_tickedNfts, _hbarAmount, myPal);

    if (!_approveResult) {
      toast.error("something wrong with approve!");
      setLoadingView(false);
      return false;
    }

    // make post data
    let _nftData = [];
    //        let _newStakedNftInfo = stakedNftInfo;
    let _newStakedNftInfo = [];
    for (let i = 0; i < _tickedNfts.length; i++) {
      _nftData.push({
        tokenId: _tickedNfts[i].tokenId,
        serialNum: _tickedNfts[i].serialNum
      });
      _newStakedNftInfo.push({
        tokenId: _tickedNfts[i].tokenId,
        serialNum: _tickedNfts[i].serialNum,
        creator: _tickedNfts[i].creator,
        name: _tickedNfts[i].name,
        imgUrl: _tickedNfts[i].imgUrl,
        fallback: _tickedNfts[i].fallback,
        ticked: false,
        staked: true,
        stakedDays: 0
      })
    }

    const nftData = {
      offerId: btoa(_offerId),
      type: btoa(_type),
      accountId: btoa(accountIds[0]),
      nftInfo: btoa(JSON.stringify(_nftData)),
      hbarAmount: btoa(myHbar),
      palAmount: btoa(myPal),
      fee: btoa(associateFee + _fallbackFee)
    };
    const _postResult = await postRequest(env.SERVER_URL + "/api/stake/stake_new_nfts", nftData);
    console.log("stake_new_nfts log---------", _postResult);
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

  /** Final
 * Click Accept Button
 * Swap Nfts
 */
  const swapNfts = async (offerId, providerAccountId, receiverAccountId, swapIds) => {
    const _postData = {
      providerAccountId: providerAccountId,
      receiverAccountId: receiverAccountId,
      providerSwapId: swapIds.data.data.providerSwapId,
      receiverSwapId: swapIds.data.data.receiverSwapId
    }

    const postData = {
      providerAccountId: btoa(_postData.providerAccountId),
      receiverAccountId: btoa(_postData.receiverAccountId),
      providerSwapId: btoa(_postData.providerSwapId),
      receiverSwapId: btoa(_postData.receiverSwapId)
    };
    const _postResult = await postRequest(env.SERVER_URL + "/api/stake/approve_swap_offer", postData);
    //        const _postResult = await axios.post(env.SERVER_URL + "/api/stake/approve_swap_offer", { providerAccountId: _postData.providerAccountId, receiverAccountId: _postData.receiverAccountId, providerSwapId: _postData.providerSwapId, receiverSwapId: _postData.receiverSwapId });
    if (!_postResult || !_postResult.result) {
      toast.error(_postResult.error);
      setLoadingView(false);
      return;
    }

    if (_postResult.result) {
      await updateOffer(offerId, 'accepted', true);
    }

    toast.success("Now, you can claim the NFTs!");
    setLoadingView(false);
  }

  const updateOffer = async (offerId, state, claimableState) => {
    await axios.post(env.SERVER_URL + "/api/nftswapoffer/update_offer", { offerId: offerId, state: state, claimableState: claimableState });
  }

  /**
   * Check offer state
   */
  const checkOffer = async (_offerId) => {
    const _postResult = await getRequest(env.SERVER_URL + "/api/nftswapoffer/get_offer_state?offerId=" + _offerId);
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
    return _postResult.data;
  }

  return (
    <>
      <Box sx={{
        backgroundColor: `${BACKGROUND_COLOR}`,
        padding: '15px',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '15px',
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* Friend account info */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              position: 'relative'
            }}>
              <Badge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant='dot'
                sx={{
                  '& .MuiBadge-badge': {
                    width: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    backgroundColor: `${offer.offerInfo.receiverInfo.connectState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
                    color: `${offer.offerInfo.receiverInfo.connectState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
                    '&::after': {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      animation: `${offer.offerInfo.receiverInfo.connectState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
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
                <Avatar alt={offer.offerInfo.receiverInfo.playerId} src={env.SERVER_URL + offer.offerInfo.receiverInfo.avatarUrl}
                  onClick={() => {
                    onClickFriend(offer.offerInfo.receiverInfo.accountId);
                  }}
                  sx={{
                    width: 64,
                    height: 64,
                    fontSize: '32px',
                    backgroundColor: '#e0e0e0',
                    border: '2px solid white',
                    cursor: 'pointer',
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
                  width: '90px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}>
                  {offer.offerInfo.receiverInfo.playerId}
                </p>
                <LinearProgress variant='determinate' value={(offer.offerInfo.receiverInfo.currentLevelScore / offer.offerInfo.receiverInfo.targetLevelScore) * 100} />
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#1976d2'
                }}>
                  Level : {offer.offerInfo.receiverInfo.level}
                </p>
              </div>
            </div>
            {/** Friend's exchange HBAR balance */}
            {
              claimableState == true && offerState == "accepted" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="HBAR"
                type="text"
                size="small"
                value={offer.offerInfo.providerToken.hbar}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == true && offerState == "declined" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="HBAR"
                type="text"
                size="small"
                value={offer.offerInfo.receiverToken.hbar}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == true && offerState == "approved" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="HBAR"
                type="text"
                size="small"
                value={offer.offerInfo.receiverToken.hbar}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == false &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="HBAR"
                type="text"
                size="small"
                value={offer.offerInfo.receiverToken.hbar}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {/** Friend's exchange PAL balance */}
            {
              claimableState == true && offerState == "accepted" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="PAL"
                type="text"
                size="small"
                value={offer.offerInfo.providerToken.pal}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == true && offerState == "declined" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="PAL"
                type="text"
                size="small"
                value={offer.offerInfo.receiverToken.pal}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == true && offerState == "approved" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="PAL"
                type="text"
                size="small"
                value={offer.offerInfo.receiverToken.pal}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == false &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="PAL"
                type="text"
                size="small"
                value={offer.offerInfo.receiverToken.pal}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {/** Friend's exchange NFTS */}
            <Box spacing={2}
              sx={SELECTED_NFT_WRAPPER_STYLE}>
              {
                claimableState == true && offerState == "accepted" &&
                offer.offerInfo.providerNfts?.length > 0 &&
                offer.offerInfo.providerNfts.map((item, index) => {
                  return <Grid key={index} item xs={12} sx={{
                    width: '160px'
                  }}>
                    {item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID ? <LandNftCard singleNftInfo={item} showDoneIcon={false} /> : <NormalNftCard singleNftInfo={item} showDoneIcon={false} />}
                  </Grid>
                })
              }
              {
                claimableState == true && offerState == "declined" &&
                offer.offerInfo.receiverNfts?.length > 0 &&
                offer.offerInfo.receiverNfts.map((item, index) => {
                  return <Grid key={index} item xs={12} sx={{
                    width: '160px'
                  }}>
                    {item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID ? <LandNftCard singleNftInfo={item} showDoneIcon={false} /> : <NormalNftCard singleNftInfo={item} showDoneIcon={false} />}
                  </Grid>
                })
              }
              {
                claimableState == true && offerState == "approved" &&
                offer.offerInfo.receiverNfts?.length > 0 &&
                offer.offerInfo.receiverNfts.map((item, index) => {
                  return <Grid key={index} item xs={12} sx={{
                    width: '160px'
                  }}>
                    {item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID ? <LandNftCard singleNftInfo={item} showDoneIcon={false} /> : <NormalNftCard singleNftInfo={item} showDoneIcon={false} />}
                  </Grid>
                })
              }
              {
                claimableState == false &&
                offer.offerInfo.receiverNfts?.length > 0 &&
                offer.offerInfo.receiverNfts.map((item, index) => {
                  return <Grid key={index} item xs={12} sx={{
                    width: '160px'
                  }}>
                    {item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID ? <LandNftCard singleNftInfo={item} showDoneIcon={false} /> : <NormalNftCard singleNftInfo={item} showDoneIcon={false} />}
                  </Grid>
                })
              }
            </Box>
          </Box>
          <Box sx={{
            width: 80,
            height: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Box sx={{
              width: '2px',
              height: '45%',
              backgroundColor: '#873135',
            }} />
            <SwapHorizontalCircle sx={{
              fontSize: '42px',
              color: '#873135'
            }} />
            <Box sx={{
              width: '2px',
              height: '45%',
              backgroundColor: '#873135',
            }} />
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* My account info */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              position: 'relative'
            }}>
              <Badge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant='dot'
                sx={{
                  '& .MuiBadge-badge': {
                    width: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    backgroundColor: `${offer.offerInfo.providerInfo.connectState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
                    color: `${offer.offerInfo.providerInfo.connectState ? `${ACTIVE_BADGE_COLOR}` : 'grey'}`,
                    '&::after': {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      animation: `${offer.offerInfo.providerInfo.connectState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
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
                <Avatar alt={offer.offerInfo.providerInfo.playerId} src={env.SERVER_URL + offer.offerInfo.providerInfo.avatarUrl}
                  onClick={() => {
                    onClickFriend(offer.offerInfo.providerInfo.accountId);
                  }}
                  sx={{
                    width: 64,
                    height: 64,
                    fontSize: '32px',
                    backgroundColor: '#e0e0e0',
                    border: '2px solid white',
                    cursor: 'pointer',
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
                  width: '90px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}>
                  {offer.offerInfo.providerInfo.playerId}
                </p>
                <LinearProgress variant='determinate' value={(offer.offerInfo.providerInfo.currentLevelScore / offer.offerInfo.providerInfo.targetLevelScore) * 100} />
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#1976d2'
                }}>
                  Level : {offer.offerInfo.providerInfo.level}
                </p>
              </div>
            </div>
            {/** My exchange HBAR balance */}
            {
              claimableState == true && offerState == "accepted" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="HBAR"
                type="text"
                size="small"
                value={offer.offerInfo.receiverToken.hbar}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == true && offerState == "declined" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="HBAR"
                type="text"
                size="small"
                value={offer.offerInfo.providerToken.hbar}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == true && offerState == "approved" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="HBAR"
                type="text"
                size="small"
                value={offer.offerInfo.providerToken.hbar}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == false &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="HBAR"
                type="text"
                size="small"
                value={offer.offerInfo.providerToken.hbar}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {/** My exchange PAL balance */}
            {
              claimableState == true && offerState == "accepted" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="PAL"
                type="text"
                size="small"
                value={offer.offerInfo.receiverToken.pal}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == true && offerState == "declined" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="PAL"
                type="text"
                size="small"
                value={offer.offerInfo.providerToken.pal}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == true && offerState == "approved" &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="PAL"
                type="text"
                size="small"
                value={offer.offerInfo.providerToken.pal}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {
              claimableState == false &&
              <TextField sx={MAIN_TEXTFIELD_STYLE}
                label="PAL"
                type="text"
                size="small"
                value={offer.offerInfo.providerToken.pal}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            }
            {/** My exchange NFTS */}
            <Box sx={SELECTED_NFT_WRAPPER_STYLE}>
              {
                claimableState == true && offerState == "accepted" &&
                offer.offerInfo.receiverNfts?.length > 0 &&
                offer.offerInfo.receiverNfts.map((item, index) => {
                  return <Grid key={index} item xs={12} sx={{
                    width: '160px'
                  }}>
                    {item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID ? <LandNftCard singleNftInfo={item} showDoneIcon={false} /> : <NormalNftCard singleNftInfo={item} showDoneIcon={false} />}
                  </Grid>
                })
              }
              {
                claimableState == true && offerState == "declined" &&
                offer.offerInfo.providerNfts?.length > 0 &&
                offer.offerInfo.providerNfts.map((item, index) => {
                  return <Grid key={index} item xs={12} sx={{
                    width: '160px'
                  }}>
                    {item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID ? <LandNftCard singleNftInfo={item} showDoneIcon={false} /> : <NormalNftCard singleNftInfo={item} showDoneIcon={false} />}
                  </Grid>
                })
              }
              {
                claimableState == true && offerState == "approved" &&
                offer.offerInfo.providerNfts?.length > 0 &&
                offer.offerInfo.providerNfts.map((item, index) => {
                  return <Grid key={index} item xs={12} sx={{
                    width: '160px'
                  }}>
                    {item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID ? <LandNftCard singleNftInfo={item} showDoneIcon={false} /> : <NormalNftCard singleNftInfo={item} showDoneIcon={false} />}
                  </Grid>
                })
              }
              {
                claimableState == false &&
                offer.offerInfo.providerNfts?.length > 0 &&
                offer.offerInfo.providerNfts.map((item, index) => {
                  return <Grid key={index} item xs={12} sx={{
                    width: '160px'
                  }}>
                    {item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID ? <LandNftCard singleNftInfo={item} showDoneIcon={false} /> : <NormalNftCard singleNftInfo={item} showDoneIcon={false} />}
                  </Grid>
                })
              }
            </Box>
          </Box>
        </Box>
        {/* buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px 0',
          width: '100%',
          padding: '0 20px'
        }}>
          {
            claimableState == true && offerType != "receivedOffer" &&
            <Button onClick={async () => {
              let swapId;
              let token;
              let state;
              let offerId = offer.offerInfo._id;
              let dbOfferState = await checkOffer(offerId);
              if (dbOfferState == false)
                return;

              if (dbOfferState == "accepted") {
                if (offerType == "myOffer") {
                  swapId = offer.offerInfo.receiverSwapId;
                  token = offer.offerInfo.receiverToken;
                }
                else if (offerType == "receivedOffer") {
                  swapId = offer.offerInfo.providerSwapId;
                  token = offer.offerInfo.providerToken;
                }
                state = 'accepted';

                const result = await onClickClaimCollectionButton(swapId, token, offerId, state);
                if (result == true)
                  onClickClaimBtn(true);
                else
                  onClickClaimBtn(false);
              }
              else if (dbOfferState == "approved") {
                let result = window.confirm('If you claim, this offer is canceled! Do you agree?');
                if (result) {
                  swapId = offer.offerInfo.providerSwapId;
                  token = offer.offerInfo.providerToken;
                  state = 'canceled';
                  const result = await onClickClaimCollectionButton(swapId, token, offerId, state);
                  if (result == true)
                    onClickClaimBtn(true);
                  else
                    onClickClaimBtn(false);
                }
              }
              else if (dbOfferState == "declined") {
                swapId = offer.offerInfo.providerSwapId;
                token = offer.offerInfo.providerToken;
                state = 'declined';
                const result = await onClickClaimCollectionButton(swapId, token, offerId, state);
                if (result == true)
                  onClickClaimBtn(true);
                else
                  onClickClaimBtn(false);
              }
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
              Claim
            </Button>
          }
          {
            claimableState == true && offerType == "receivedOffer" && offerState == "accepted" &&
            <Button onClick={async () => {
              let swapId;
              let token;
              let state;
              let offerId = offer.offerInfo._id;

              let dbOfferState = await checkOffer(offerId);
              if (dbOfferState == false)
                return;

              if (dbOfferState == "accepted") {
                if (offerType == "myOffer") {
                  swapId = offer.offerInfo.receiverSwapId;
                  token = offer.offerInfo.receiverToken;
                }
                else if (offerType == "receivedOffer") {
                  swapId = offer.offerInfo.providerSwapId;
                  token = offer.offerInfo.providerToken;
                }
                state = 'accepted';

                const result = await onClickClaimCollectionButton(swapId, token, offerId, state);
                if (result == true)
                  onClickClaimBtn(true);
                else
                  onClickClaimBtn(false);
              }
              else if (dbOfferState == "approved") {
                let result = window.confirm('If you claim, this offer is canceled! Do you agree?');
                if (result) {
                  swapId = offer.offerInfo.providerSwapId;
                  token = offer.offerInfo.providerToken;
                  state = 'canceled';
                  const result = await onClickClaimCollectionButton(swapId, token, offerId, state);
                  if (result == true)
                    onClickClaimBtn(true);
                  else
                    onClickClaimBtn(false);
                }
              }
              else if (dbOfferState == "declined") {
                swapId = offer.offerInfo.providerSwapId;
                token = offer.offerInfo.providerToken;
                state = 'declined';
                const result = await onClickClaimCollectionButton(swapId, token, offerId, state);
                if (result == true)
                  onClickClaimBtn(true);
                else
                  onClickClaimBtn(false);
              }
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
              Claim
            </Button>
          }
          {
            offerType == "receivedOffer" && offerState != 'accepted' &&
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
              onClick={async () => {
                setLoadingView(true);

                let offerCheckResult = await checkOffer(offer.offerInfo._id);
                if (offerCheckResult != false) {
                  const offerInfo = offer.offerInfo;
                  const receiverBalance = await getWalletBalance(offerInfo.receiverInfo.accountId);
  
                  const myHbarBalance = parseInt(offerInfo.receiverToken.hbar, 10);
                  const myPalBalance = parseInt(offerInfo.receiverToken.pal, 10);
  
                  if (parseInt(changeToRealValue(receiverBalance.hbar, HBAR_DECIMAL), 10) < myHbarBalance) {
                    toast.error("Insufficient HBAR balance!");
                    setLoadingView(false);
                    return;
                  }
                  if (parseInt(changeToRealValue(receiverBalance.pal, PAL_DECIMAL), 10) < myPalBalance) {
                    toast.error("Insufficient PAL balance!");
                    setLoadingView(false);
                    return;
                  }
  
                  const result = await onClickApproveNfts(offerInfo._id, "receiver", offerInfo.receiverNfts, myHbarBalance, myPalBalance);
                  if (result == true) {
                    const swapIds = await axios.get(env.SERVER_URL + "/api/nftswapoffer/get_swapid?offerId=" + offerInfo._id);
                    await swapNfts(offerInfo._id, offerInfo.providerInfo.accountId, offerInfo.receiverInfo.accountId, swapIds);
                  }
                  onClickAcceptBtn(offer.offerInfo, result);
                }
              }}
              disabled={isStaked === false}
            >
              Accept
            </Button>
          }
          {
            offerType == "receivedOffer" && offerState != 'accepted' &&
            <Button onClick={async () => {
              let result = window.confirm('Do you decline this offer?');
              if (result)
              {
                let offerCheckResult = await checkOffer(offer.offerInfo._id);
                if (offerCheckResult != false) {
                  onClickDeclineBtn(offer.offerInfo);
                }
              }
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
                marginRight: '20px',
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
              Decline
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
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingView}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default OfferDetailDlg;

// styles

const MAIN_TEXTFIELD_STYLE = {
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

const SELECTED_NFT_WRAPPER_STYLE = {
  width: '175px',
  height: '500px',
  overflowX: 'hidden',
  overflowY: 'auto',
  border: '1px solid #873135',
  padding: '5px',
  '&::-webkit-scrollbar': {
    width: '5px',
    height: '5px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
    borderRadius: '100px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#873135e0'
  }
}
