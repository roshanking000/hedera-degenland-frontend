import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  IconButton,
  Grid,
  TextField,
  Badge,
  Avatar,
  LinearProgress,
  Divider,
  Chip,
  CircularProgress,
  Backdrop
} from '@mui/material';

import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowRight,
  SwapHorizontalCircle,
} from '@mui/icons-material';

import { useHashConnect } from "../../../assets/api/HashConnectAPIProvider.tsx";
import { getRequest, postRequest } from "../../../assets/api/apiRequests";

import LandNftCard from '../FriendListDlg/FriendInfoDlg/LandNftCard';
import NormalNftCard from '../FriendListDlg/FriendInfoDlg/NormalNftCard';

import * as env from "../../../env";

const BACKGROUND_COLOR = '#ffc0ff';
const ACTIVE_BADGE_COLOR = '#44b700';
const TEXT_COLOR_1 = '#873135';
const TEXT_COLOR_2 = '#3c617e';
const TEXT_COLOR_3 = '#1976d2';

const HBAR_DECIMAL = 8;
const PAL_DECIMAL = 8;

function EditOfferDlg({
  myData,
  offerInfo,
  myBalanceInfo,
  onClickApproveBtn,
  onClickEditOfferBtn,
  onClickCancelBtn
}) {
  const { walletData, sendHbarAndMultiNftsToTreasury } = useHashConnect();
  const { accountIds } = walletData;

  const [loadingView, setLoadingView] = useState(false);

  const [tickedMyCount, setTickedMyCount] = useState(0);

  const [tickedCount, setTickedCount] = useState(0);
  const [landNftInfo, setLandNftInfo] = useState([]);
  const [normalNftInfo, setNormalNftInfo] = useState([]);

  const [myInfo, setMyInfo] = useState(myData);
  const [offer, setOffer] = useState({ offerInfo });

  // token balance
  const [balanceInfo, setBalanceInfo] = useState(myBalanceInfo);

  const myNft = offer.offerInfo.providerNfts;
  const [selectedMyNftInfo, setSelectedMyNftInfo] = useState(myNft);
  const [sellNftCount, setSellNftCount] = useState(0);

  const receiverHbar = offer.offerInfo.receiverToken.hbar;
  const receiverPal = offer.offerInfo.receiverToken.pal;
  const providerHbar = offer.offerInfo.providerToken.hbar;
  const providerPal = offer.offerInfo.providerToken.pal;

  const [friendHbar, setFriendHbar] = useState(receiverHbar);
  const [friendPal, setFriendPal] = useState(receiverPal);
  const [myHbar, setMyHbar] = useState(providerHbar);
  const [myPal, setMyPal] = useState(providerPal);

  const [uploadDataFlag, setUploadDataFlag] = useState(false); // This flag will true while uploading
  const [countOfWalletNft, setCountOfWalletNft] = useState(0); // Count of NFTs in Wallet
  const [nextLinkOfGetWalletNft, setNextLinkOfGetWalletNft] = useState(null);

  useEffect(() => {
    if (myNft.length == 0)
      setSellNftCount(0);
    else {
      if (myNft[0].tokenId == "")
        setSellNftCount(0);
      else
        setSellNftCount(myNft.length);
    }
  }, []);

  useEffect(() => {
    if (myInfo?.accountId && !uploadDataFlag) {
      getNftData(myInfo.accountId);
      getWalletBalance(myInfo.accountId);
    }
  }, [myInfo]);

  const getWalletBalance = async (accountId_) => {
    let g_hbarBalance, g_palBalance;

    let g_hbarBalanceInfo = await getInfoResponse(env.MIRROR_NET_URL + "/api/v1/balances?account.id=" + accountId_);
    console.log('getWalletBalance log - 1 : ', g_hbarBalanceInfo);
    if (!g_hbarBalanceInfo || g_hbarBalanceInfo.data.balances?.length === 0) {
      g_hbarBalance = 0;
    }
    else {
      g_hbarBalance = g_hbarBalanceInfo.data.balances[0].balance;
    }

    let g_palBalanceInfo = await getInfoResponse(`${env.MIRROR_NET_URL}/api/v1/accounts/${accountId_}/tokens?token.id=${env.PAL_TOKEN_ID}`);

    if (g_palBalanceInfo.data.tokens?.length == 0)
      g_palBalance = 0;
    else
      g_palBalance = g_palBalanceInfo.data.tokens[0].balance;

    setBalanceInfo({
      hbar: g_hbarBalance,
      pal: g_palBalance
    });
  }

  const getNftData = async (accountId_) => {
    setUploadDataFlag(true);
    //        await getServerNftData(accountId_);
    await getWalletNftData(nextLinkOfGetWalletNft, accountId_);
    setUploadDataFlag(false);
  }

  const getNextWalletNftData = async (nextLink_, accountId_) => {
    setUploadDataFlag(true);
    await getWalletNftData(nextLink_, accountId_);
    setUploadDataFlag(false);
  }

  const getWalletNftData = async (nextLink_, accountId_) => {
    let _urlStr;
    if (nextLink_)
      _urlStr = env.MIRROR_NET_URL + nextLink_;
    else
      _urlStr = env.MIRROR_NET_URL + env.GET_ACCOUNT_PREFIX + accountId_ + "/nfts";

    setLoadingView(true);

    let _newNextLink;
    let _newNftCount = countOfWalletNft;
    const _result = await getInfoResponse(_urlStr);
    if (_result) {
      _newNextLink = _result.data.links.next;
      let _tempData = _result.data.nfts;
      let placeInfo = await axios.get(env.SERVER_URL + "/api/place/get_places_info?nftInfo=" + JSON.stringify(_tempData));

      let g_landNftInfo = landNftInfo;
      let g_normalNftInfo = normalNftInfo;

      let flag = 0;
      for (let i = 0; i < _tempData.length; i++) {
        if (_tempData[i].token_id === env.DEGENLAND_NFT_ID ||
          _tempData[i].token_id === env.TYCOON_NFT_ID ||
          _tempData[i].token_id === env.MOGUL_NFT_ID ||
          _tempData[i].token_id === env.INVESTOR_NFT_ID) {

          // check nfts that are in offer list
          for (let j = 0; j < selectedMyNftInfo.length; j++) {
            if (selectedMyNftInfo[j].tokenId == _tempData[i].token_id && selectedMyNftInfo[j].serialNum == _tempData[i].serial_number)
              flag = 1;
          }
          if (flag == 0) {
            const _containResult = containCheck(g_landNftInfo, _tempData[i].token_id, _tempData[i].serial_number);

            if (!_containResult) {
              const g_imgUrl = _tempData[i].token_id === env.DEGENLAND_NFT_ID ? "imgs/front/nfts/degenland.png" :
                _tempData[i].token_id === env.TYCOON_NFT_ID ? "imgs/front/nfts/tycoon.png" :
                  _tempData[i].token_id === env.MOGUL_NFT_ID ? "imgs/front/nfts/mogul.png" : "imgs/front/nfts/investor.png";
  
              const g_name = _tempData[i].token_id === env.DEGENLAND_NFT_ID ? 'Degen-' + _tempData[i].serial_number :
                _tempData[i].token_id === env.TYCOON_NFT_ID ? 'Tycoon-' + _tempData[i].serial_number :
                  _tempData[i].token_id === env.MOGUL_NFT_ID ? 'Mogul-' + _tempData[i].serial_number : 'Investor-' + _tempData[i].serial_number;
  
              //get land nft info here
              let g_buildCount = 0;
              let g_score = 0;
              let g_totalVisitor = 0;
  
              for (let j = 0; j < placeInfo.data.data.length; j++) {
                if (_tempData[i].token_id == placeInfo.data.data[j].token_id && _tempData[i].serial_number == placeInfo.data.data[j].serial_number) {
                  g_buildCount = placeInfo.data.data[j].buildingCount;
                  g_score = placeInfo.data.data[j].score;
                  g_totalVisitor = placeInfo.data.data[j].totalVisitor;
                }
              }
  
              g_landNftInfo.push({
                tokenId: _tempData[i].token_id,
                serialNum: _tempData[i].serial_number,
                nftType: 'land',
                creator: 'Degenlands',
                name: g_name,
                imgUrl: g_imgUrl,
                fallback: 0,
                ticked: false,
                buildingCount: g_buildCount,
                score: g_score,
                totalVisitor: g_totalVisitor
              })
              _newNftCount++;
            }
          }
        } else {
          // check nfts that are in offer list
          for (let j = 0; j < selectedMyNftInfo.length; j++) {
            if (selectedMyNftInfo[j].tokenId == _tempData[i].token_id && selectedMyNftInfo[j].serialNum == _tempData[i].serial_number)
              flag = 1;
          }
          if (flag == 0) {
            const _containResult = containCheck(g_normalNftInfo, _tempData[i].token_id, _tempData[i].serial_number);

            if (!_containResult) {
              let _nftInfoResponse = await getNftInfoFromMirrorNet(_tempData[i].token_id, _tempData[i].serial_number);
  
              if (_nftInfoResponse.result) {
                let _imageUrl = _nftInfoResponse.imageUrl;
                let _nftName = _nftInfoResponse.name;
  
                g_normalNftInfo.push({
                  tokenId: _tempData[i].token_id,
                  serialNum: _tempData[i].serial_number,
                  nftType: 'normal',
                  fallback: 0,
                  nftNo: _newNftCount,
                  name: _nftName,
                  staked: false,
                  ticked: false,
                  imgUrl: _imageUrl
                })
                _newNftCount++;
              }
            }
          }
        }
        flag = 0;
      }

      if (_newNextLink != null) {
        // add plus button
        g_normalNftInfo.push({
          nftNo: _newNftCount,
          nftType: 'normal',
          fallback: 0,
          name: null,
          staked: false,
          ticked: false,
          tokenId: "plus",
          serialNum: null,
          imgUrl: null
        })
      }

      for (let i = 0; i < g_normalNftInfo.length; i++) {
        if (g_normalNftInfo[i].tokenId == "plus" && i != g_normalNftInfo.length - 1)
          g_normalNftInfo.splice(i, 1);
      }

      setCountOfWalletNft(_newNftCount);
      setLandNftInfo(g_landNftInfo);
      setNormalNftInfo(g_normalNftInfo);
      setLoadingView(false);
      setNextLinkOfGetWalletNft(_newNextLink);
    }
  }

  const getNftInfoFromMirrorNet = async (tokenId_, serialNum_) => {
    const g_singleNftInfo = await getInfoResponse(`${env.MIRROR_NET_URL}/api/v1/tokens/${tokenId_}/nfts?serialNumber=${serialNum_}`);
    // console.log("getNftInfo log - 1 : ", _singleNftInfo);
    if (g_singleNftInfo && g_singleNftInfo.data.nfts.length > 0) {
      let g_preMdUrl = base64ToUtf8(g_singleNftInfo.data.nfts[0].metadata).split("//");
      // console.log("getNftInfo log - 2 : ", _preMdUrl);

      let _metadataUrl = env.IPFS_URL + g_preMdUrl[g_preMdUrl.length - 1];
      const _metadataInfo = await getInfoResponse(_metadataUrl); // get NFT metadata
      if (_metadataInfo && _metadataInfo.data.image != undefined) {
        let _imageUrlList = _metadataInfo.data.image.split('/');
        let _imageUrlLen = _imageUrlList?.length;
        const _imageUrl = env.IPFS_URL + _imageUrlList[_imageUrlLen - 2] + "/" + _imageUrlList[_imageUrlLen - 1];

        return { result: true, imageUrl: _imageUrl, name: _metadataInfo.data.name };
      }
      return { result: false };
    }
    return { result: false };
  }

  const containCheck = (nftData_, nftId_, serialNumber_) => {
    let _nftDataLen = nftData_?.length;
    for (let i = 0; i < _nftDataLen; i++) {
      if (nftData_[i].tokenId === nftId_ && nftData_[i].serialNum === serialNumber_)
        return true;
    }
    return false;
  }


  // convert metadata base64 string to utf8
  const base64ToUtf8 = (base64Str_) => {
    // create a buffer
    const _buff = Buffer.from(base64Str_, 'base64');

    // decode buffer as UTF-8
    const _utf8Str = _buff.toString('utf-8');

    return _utf8Str;
  }

  // axios get
  const getInfoResponse = async (urlStr_) => {
    try {
      return await axios.get(urlStr_);
    } catch (error) {
      console.log(error);
    }
  };

  const changeToRealValue = (value_, decimal_) => {
    return parseFloat(value_ / (10 ** decimal_)).toFixed(3);
  }

  // When click all right button
  const handleAllRight = () => {
    let selectedLandNftInfo = [];
    let selectedNormalNftInfo = [];

    // get already selected land nft list
    if (landNftInfo?.length > 0) {
      landNftInfo.map((item, index) => {
        selectedLandNftInfo.push(item);
      })
    }

    // get already selected normal nft list
    if (normalNftInfo?.length > 0) {
      normalNftInfo.map((item, index) => {
        selectedNormalNftInfo.push(item);
      })
    }

    let deleteIndex = [];
    // get selected land list
    if (selectedMyNftInfo?.length > 0) {
      selectedMyNftInfo.map((item, index) => {
        if (item.ticked == true)
          item.ticked = false;
        if (item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID)
          selectedLandNftInfo.push(item);
        else
          selectedNormalNftInfo.push(item);
        deleteIndex.push(index);
      })
    }

    //delete selected nft in my land nft list
    //    for (let i = deleteIndex.length - 1; i >= 0; i--)
    //      selectedMyNftInfo.splice(deleteIndex[i], 1);

    //    setTickedCount(0);
    setTickedMyCount(0);
    setSellNftCount(0);
    setLandNftInfo(selectedLandNftInfo);
    setNormalNftInfo(selectedNormalNftInfo);
    setSelectedMyNftInfo({});
  };

  // When click right button
  const handleCheckedRight = () => {
    let selectedLandNftInfo = [];
    let selectedNormalNftInfo = [];
    let count = 0;

    // get already selected land nft list
    if (landNftInfo?.length > 0) {
      landNftInfo.map((item, index) => {
        selectedLandNftInfo.push(item);
      })
    }

    // get already selected normal nft list
    if (normalNftInfo?.length > 0) {
      normalNftInfo.map((item, index) => {
        selectedNormalNftInfo.push(item);
      })
    }

    let deleteIndex = [];
    // get selected land list
    if (selectedMyNftInfo?.length > 0) {
      selectedMyNftInfo.map((item, index) => {
        if (item.ticked == true) {
          item.ticked = false;

          if (item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID)
            selectedLandNftInfo.push(item);
          else
            selectedNormalNftInfo.push(item);
          deleteIndex.push(index);
          count++;
        }
      })
    }

    //delete selected nft in my land nft list
    let newSelectedMyNftInfo = [];
    let flag = 0;
    for (let i = 0; i < selectedMyNftInfo.length; i++) {
      for (let j = deleteIndex.length - 1; j >= 0; j--) {
        if (i == deleteIndex[j])
          flag = 1;
      }
      if (flag == 0)
        newSelectedMyNftInfo.push(selectedMyNftInfo[i]);
      flag = 0;
    }
    setSelectedMyNftInfo(newSelectedMyNftInfo);

    setTickedMyCount(0);
    setSellNftCount(newSelectedMyNftInfo.length);
    setLandNftInfo(selectedLandNftInfo);
    setNormalNftInfo(selectedNormalNftInfo);
  };

  // When click left button
  const handleCheckedLeft = () => {
    let selectedNftInfo = [];

    // get already selected list
    if (sellNftCount > 0) {
      selectedMyNftInfo.map((item, index) => {
        selectedNftInfo.push(item);
      })
    }

    let deleteIndex = [];
    // get selected land list
    landNftInfo.map((item, index) => {
      if (item.ticked == true) {
        item.ticked = false;
        selectedNftInfo.push(item);
        deleteIndex.push(index);
      }
    })

    //delete selected nft in my land nft list
    for (let i = deleteIndex.length - 1; i >= 0; i--)
      landNftInfo.splice(deleteIndex[i], 1);

    deleteIndex = [];
    // get selected normal list
    normalNftInfo.map((item, index) => {
      if (item.ticked == true) {
        item.ticked = false;
        selectedNftInfo.push(item);
        deleteIndex.push(index);
      }
    })

    //delete selected nft in my normal nft list
    for (let i = deleteIndex.length - 1; i >= 0; i--)
      normalNftInfo.splice(deleteIndex[i], 1);

    setSelectedMyNftInfo(selectedNftInfo);
    setSellNftCount(selectedNftInfo.length);
    setTickedCount(0);
  };

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
    return true;
  }

  const getFallbackFee = async (tokenId_) => {
    let g_fallback = 0;

    const _getNftFee = await getInfoResponse(`${env.MIRROR_NET_URL}/api/v1/tokens/${tokenId_}`);
    // console.log("getNftInfo log - 1 : ", _getNftFee);
    if (_getNftFee.data?.custom_fees?.royalty_fees?.length > 0 && _getNftFee.data.custom_fees.royalty_fees[0].fallback_fee)
      g_fallback = _getNftFee.data.custom_fees.royalty_fees[0].fallback_fee.amount / 100000000;
    return g_fallback;
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
    if (_hbarResult.result == false)
      associateFee = Math.ceil(parseFloat(env.NFT_ASSOCIATE_FEE * _tickedNfts.length) / parseFloat(env.DEFAULT_HBAR_PRICE));
    else {
      if (_hbarResult)
        associateFee = Math.ceil(parseFloat(env.NFT_ASSOCIATE_FEE * _tickedNfts.length) / parseFloat(_hbarResult["hedera-hashgraph"].usd));
      else
        associateFee = Math.ceil(parseFloat(env.NFT_ASSOCIATE_FEE * _tickedNfts.length) / parseFloat(env.DEFAULT_HBAR_PRICE));
    }

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
    setLoadingView(false);
    return true;
  }

  const editOffer = async (oldOfferInfo, friendNftInfo, friendHbar, friendPal, myNftInfo, myHbar, myPal) => {
    const providerToken = {
      hbar: myHbar,
      pal: myPal
    };
    const receiverToken = {
      hbar: friendHbar,
      pal: friendPal
    };
    const newOfferInfo = {
      providerToken: providerToken,
      providerNfts: myNftInfo,
      receiverToken: receiverToken,
      receiverNfts: friendNftInfo
    };
    await axios.post(env.SERVER_URL + "/api/nftswapoffer/edit_offer", { offerId: oldOfferInfo._id, newOfferInfo: newOfferInfo });
  }

  return (
    <>
      <Box sx={{
        minWidth: '1140px',
        width: '100%',
        backgroundColor: `${BACKGROUND_COLOR}`,
        padding: '25px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
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
          }}>
            {/** Friend's exchange HBAR balance */}
            <TextField sx={MAIN_TEXTFIELD_STYLE}
              label="HBAR"
              type="text"
              size="small"
              value={friendHbar}
              onChange={(e) => {
                const regex = /^[0-9\b]+$/;
                if (e.target.value == "" || regex.test(e.target.value))
                  setFriendHbar(e.target.value)
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {/** Friend's exchange PAL balance */}
            <TextField sx={MAIN_TEXTFIELD_STYLE}
              label="PAL"
              type="text"
              size="small"
              value={friendPal}
              onChange={(e) => {
                const regex = /^[0-9\b]+$/;
                if (e.target.value == "" || regex.test(e.target.value))
                  setFriendPal(e.target.value)
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {/** Friend's exchange NFTS */}
            <Box spacing={2}
              sx={SELECTED_NFT_WRAPPER_STYLE}>
              {
                offer.offerInfo.receiverNfts?.length > 0 &&
                offer.offerInfo.receiverNfts.map((item, index) => {
                  return <Grid key={index} item xs={12} sx={{
                    width: '160px',
                    margin: '5px 0',
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
          }}>
            {/** My exchange HBAR balance */}
            <TextField sx={MAIN_TEXTFIELD_STYLE}
              label="HBAR"
              type="text"
              size="small"
              value={myHbar}
              onChange={(e) => {
                const regex = /^[0-9\b]+$/;
                if (e.target.value == "" || regex.test(e.target.value))
                  setMyHbar(e.target.value)
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {/** My exchange PAL balance */}
            <TextField sx={MAIN_TEXTFIELD_STYLE}
              label="PAL"
              type="text"
              size="small"
              value={myPal}
              onChange={(e) => {
                const regex = /^[0-9\b]+$/;
                if (e.target.value == "" || regex.test(e.target.value))
                  setMyPal(e.target.value)
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            {/** My exchange NFTS */}
            <Box sx={SELECTED_NFT_WRAPPER_STYLE}>
              {
                selectedMyNftInfo?.length > 0 &&
                selectedMyNftInfo.map((item, index) => {
                  return <Grid key={index} item xs={12} hidden={item.tokenId == ""} sx={{
                    width: '160px',
                    margin: '5px 0',
                  }}>
                    {item.tokenId == env.DEGENLAND_NFT_ID || item.tokenId == env.TYCOON_NFT_ID || item.tokenId == env.MOGUL_NFT_ID || item.tokenId == env.INVESTOR_NFT_ID ?
                      <LandNftCard singleNftInfo={item} showDoneIcon={true}
                        onClickLandNftCard={() => {
                          item.ticked = item.ticked ? false : true;
                          if (item.ticked == true)
                            setTickedMyCount(tickedMyCount + 1);
                          else
                            setTickedMyCount(tickedMyCount - 1);
                        }}
                      /> :
                      <NormalNftCard singleNftInfo={item} showDoneIcon={true}
                        onClickNormalNftCard={() => {
                          item.ticked = item.ticked ? false : true;
                          if (item.ticked == true)
                            setTickedMyCount(tickedMyCount + 1);
                          else
                            setTickedMyCount(tickedMyCount - 1);
                        }}
                      />
                    }
                  </Grid>
                })
              }
            </Box>
          </Box>
        </Box>
        {/** Exchange Buttons */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '15px',
        }}>
          <IconButton
            sx={SWAP_BTN_STYLE}
            onClick={handleCheckedRight}
          // disabled={tickedMyCount === 0}
          >
            <KeyboardArrowRight />
          </IconButton>
          <IconButton
            sx={SWAP_BTN_STYLE}
            onClick={handleCheckedLeft}
          // disabled={tickedCount === 0 || sellNftCount === 7}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            sx={SWAP_BTN_STYLE}
            onClick={handleAllRight}
          // disabled={sellNftCount === 0}
          >
            <KeyboardDoubleArrowRight />
          </IconButton>
        </Box>
        {/** My NFTS */}
        <div
          style={{
            width: '550px',
            backgroundColor: `${BACKGROUND_COLOR}`,
            padding: '15px',
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
              margin: '0 0 10px 10px',
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
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'top',
              justifyContent: 'top',
              height: 'calc(100vh - 400px)',
              overflowY: 'auto',
              marginTop: 0,
              '&::-webkit-scrollbar': {
                width: '7px',
                height: '7px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
                borderRadius: '100px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#873135e0'
              }
            }}>
              <Divider textAlign="center" sx={{
                paddingTop: '10px',
                paddingBottom: '30px',
              }}>
                <Chip variant="outlined" label="Land NFTs" sx={{
                  fontWeight: 700,
                }} />
              </Divider>
              <Box>
                {
                  landNftInfo?.length == 0 &&
                  <p style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#8b1832',
                    margin: '5px 25px 25px 25px',
                    textTransform: 'none',
                    textAlign: 'center',
                  }}>
                    No NFTs
                  </p>
                }
                {
                  landNftInfo?.length > 0 &&
                  landNftInfo.map((item, index) => {
                    return <Box key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        float: 'left',
                        width: '160px',
                        padding: '5px',
                        margin: '5px'
                      }}>
                      <LandNftCard singleNftInfo={item} showDoneIcon={true}
                        onClickLandNftCard={() => {
                          item.ticked = item.ticked ? false : true;
                          if (item.ticked == true) {
                            console.log(tickedCount, sellNftCount);
                            if ((tickedCount + sellNftCount) < env.NFT_SELECT_LIMIT)
                              setTickedCount(tickedCount + 1);
                            else {
                              item.ticked = item.ticked ? false : true;
                              toast.warning("The maximum number of selectable NFTs is 7.");
                            }
                          }
                          else
                            setTickedCount(tickedCount - 1);
                        }}
                      />
                    </Box>
                  })
                }
              </Box>
              <Divider textAlign="center" sx={{
                paddingTop: '10px',
                paddingBottom: '30px',
              }}>
                <Chip variant="outlined" label="Normal NFTs" sx={{
                  fontWeight: 700,
                }} />
              </Divider>
              <Box>
                {
                  normalNftInfo?.length == 0 &&
                  <p style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#8b1832',
                    margin: '5px 25px 25px 25px',
                    textTransform: 'none',
                    textAlign: 'center',
                  }}>
                    No NFTs
                  </p>
                }
                {
                  normalNftInfo?.length > 0 &&
                  normalNftInfo.map((item, index) => {
                    return <Box key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        float: 'left',
                        width: '160px',
                        padding: '5px',
                        margin: '5px'
                      }}>
                      <NormalNftCard singleNftInfo={item} showDoneIcon={true}
                        onClickPlus={() => {
                          getNextWalletNftData(nextLinkOfGetWalletNft, myInfo.accountId);
                        }}
                        onClickNormalNftCard={() => {
                          item.ticked = item.ticked ? false : true;
                          if (item.ticked == true) {
                            if ((tickedCount + sellNftCount) < env.NFT_SELECT_LIMIT)
                              setTickedCount(tickedCount + 1);
                            else {
                              item.ticked = item.ticked ? false : true;
                              toast.warning("The maximum number of selectable NFTs is 7.");
                            }
                          }
                          else
                            setTickedCount(tickedCount - 1);
                        }}
                      />
                    </Box>
                  })
                }
              </Box>
            </Box>
          </div>
          {/* buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'right',
            margin: '20px 0 0',
            width: '100%',
            paddingRight: '20px',
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
              disabled={sellNftCount == 0}
              onClick={async () => {
                setLoadingView(true);
                landNftInfo.map((item, index) => {
                  item.ticked = false;
                })

                normalNftInfo.map((item, index) => {
                  item.ticked = false;
                })

                let offerCheckResult = await checkOffer(offerInfo._id);
                if (offerCheckResult == true) {
                  //get fallback fee
                  for (let i = 0;i < selectedMyNftInfo.length;i++) {
                    if (selectedMyNftInfo[i].nftType == 'normal')
                      selectedMyNftInfo[i].fallback = await getFallbackFee(selectedMyNftInfo[i].tokenId);
                  }

                  let myHbarBalance = 0;
                  let myPalBalance = 0;
                  let friendHbarBalance = 0;
                  let friendPalBalance = 0;
                  if (myHbar == '')
                    myHbarBalance = 0;
                  else
                    myHbarBalance = parseInt(myHbar, 10);
                  if (myPal == '')
                    myPalBalance = 0;
                  else
                    myPalBalance = parseInt(myPal, 10);
                  if (friendHbar == '')
                    friendHbarBalance = 0;
                  else
                    friendHbarBalance = parseInt(friendHbar, 10);
                  if (friendPal == '')
                    friendPalBalance = 0;
                  else
                    friendPalBalance = parseInt(friendPal, 10);
  
                  if (parseInt(changeToRealValue(balanceInfo.hbar, HBAR_DECIMAL), 10) < myHbarBalance) {
                    toast.error("Insufficient HBAR balance!");
                    setLoadingView(false);
                    return;
                  }
                  if (parseInt(changeToRealValue(balanceInfo.pal, PAL_DECIMAL), 10) < myPalBalance) {
                    toast.error("Insufficient PAL balance!");
                    setLoadingView(false);
                    return;
                  }

                  await editOffer(offerInfo, offer.offerInfo.receiverNfts, friendHbarBalance, friendPalBalance, selectedMyNftInfo, myHbarBalance, myPalBalance);

                  let result = window.confirm('If you approve, you never edit this offer! Do you agree?');
                  if (result) {
                    const approveResult = await onClickApproveNfts(offerInfo._id, "provider", selectedMyNftInfo, myHbarBalance, myPalBalance);
                    onClickApproveBtn(approveResult, offerInfo);
                  }
                  else
                    setLoadingView(false);
                }
              }}
            >
              Approve
            </Button>
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
              disabled={sellNftCount == 0}
              onClick={async () => {
                landNftInfo.map((item, index) => {
                  item.ticked = false;
                })

                normalNftInfo.map((item, index) => {
                  item.ticked = false;
                })

                let offerCheckResult = await checkOffer(offerInfo._id);
                if (offerCheckResult == true) {
                  let myHbarBalance = 0;
                  let myPalBalance = 0;
                  let friendHbarBalance = 0;
                  let friendPalBalance = 0;
                  if (myHbar == '')
                    myHbarBalance = 0;
                  else
                    myHbarBalance = parseInt(myHbar, 10);
                  if (myPal == '')
                    myPalBalance = 0;
                  else
                    myPalBalance = parseInt(myPal, 10);
                  if (friendHbar == '')
                    friendHbarBalance = 0;
                  else
                    friendHbarBalance = parseInt(friendHbar, 10);
                  if (friendPal == '')
                    friendPalBalance = 0;
                  else
                    friendPalBalance = parseInt(friendPal, 10);
  
                  if (parseInt(changeToRealValue(balanceInfo.hbar, HBAR_DECIMAL), 10) < myHbarBalance) {
                    toast.error("Insufficient HBAR balance!");
                    return;
                  }
                  if (parseInt(changeToRealValue(balanceInfo.pal, PAL_DECIMAL), 10) < myPalBalance) {
                    toast.error("Insufficient PAL balance!");
                    return;
                  }
  
                  onClickEditOfferBtn(offerInfo, offer.offerInfo.receiverNfts, friendHbarBalance, friendPalBalance, selectedMyNftInfo, myHbarBalance, myPalBalance);
                }
              }}
            >
              Edit Offer
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
        </div >
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

export default EditOfferDlg;

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

const SWAP_BTN_STYLE = {
  width: 42,
  height: 42,
  borderRadius: '21px',
  textTransform: 'none',
  fontSize: 16,
  fontWeight: 700,
  color: 'white',
  padding: '0',
  margin: '5px 0',
  backgroundColor: '#e74895',
  '&:hover': {
    backgroundColor: '#e74895',
    boxShadow: 'none',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  }
}