import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    Badge,
    Avatar,
    LinearProgress,
    CircularProgress,
    Backdrop,
    Button,
    Box
} from '@mui/material';

import NormalNftCard from '../FriendListDlg/FriendInfoDlg/NormalNftCard';
import { getRequest, postRequest } from "../../../assets/api/apiRequests";
import * as env from '../../../env';


const BACKGROUND_COLOR = '#ffc0ff';
const ACTIVE_BADGE_COLOR = '#44b700';
const TEXT_COLOR_1 = '#873135';
const TEXT_COLOR_2 = '#3c617e';
const TEXT_COLOR_3 = '#1976d2';

function SetTicketDlg({
    myInfo,
    buildingId,
    onClickSetTicketBtn,
    onClickCancelBtn
}) {
    const [loadingView, setLoadingView] = useState(false);
    const [tickedNftInfo, setTickedNftInfo] = useState(null);

    const [normalNftInfo, setNormalNftInfo] = useState([]);

    const [myData, setMyData] = useState(myInfo);
    const [uploadDataFlag, setUploadDataFlag] = useState(false); // This flag will true while uploading
    const [countOfWalletNft, setCountOfWalletNft] = useState(0); // Count of NFTs in Wallet
    const [nextLinkOfGetWalletNft, setNextLinkOfGetWalletNft] = useState(null);

    useEffect(() => {
        if (myData?.accountId && !uploadDataFlag)
            getNftData(myData.accountId);
    }, [myData]);

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

            let g_normalNftInfo = normalNftInfo;

            for (let i = 0; i < _tempData.length; i++) {
                if (_tempData[i].token_id !== env.DEGENLAND_NFT_ID &&
                    _tempData[i].token_id !== env.TYCOON_NFT_ID &&
                    _tempData[i].token_id !== env.MOGUL_NFT_ID &&
                    _tempData[i].token_id !== env.INVESTOR_NFT_ID) {
                    const _containResult = containCheck(g_normalNftInfo, _tempData[i].token_id, _tempData[i].serial_number);

                    if (!_containResult) {
                        let _nftInfoResponse = await getNftInfoFromMirrorNet(_tempData[i].token_id, _tempData[i].serial_number);

                        if (_nftInfoResponse.result) {
                            let _imageUrl = _nftInfoResponse.imageUrl;
                            let _nftName = _nftInfoResponse.name;

                            g_normalNftInfo.push({
                                nftNo: _newNftCount,
                                nftType: 'normal',
                                fallback: 0,
                                name: _nftName,
                                staked: false,
                                ticked: false,
                                tokenId: _tempData[i].token_id,
                                serialNum: _tempData[i].serial_number,
                                imgUrl: _imageUrl
                            })
                            _newNftCount++;
                        }
                    }
                }
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
                                backgroundColor: `${myData.connectState ? '#44b700' : 'grey'}`,
                                color: `${myData.connectState ? '#44b700' : 'grey'}`,
                                '&::after': {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    animation: `${myData.connectState ? 'ripple 1.2s infinite ease-in-out' : 'none'}`,
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
                        <Avatar alt={myData.playerId} src={env.SERVER_URL + myData?.avatarUrl}
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
                            {myData.playerId}
                        </p>
                        <p style={{
                            margin: '0',
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1976d2',
                            marginBottom: '5px'
                        }}>
                            Level : {myData.level}
                        </p>
                        <LinearProgress variant='determinate' value={(myData.currentLevelScore / myData.targetLevelScore) * 100} />
                    </div>
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
                                            getNextWalletNftData(nextLinkOfGetWalletNft, myData.accountId);
                                        }}
                                        onClickNormalNftCard={() => {
                                            for (let i = 0;i < normalNftInfo.length;i++) {
                                                if (normalNftInfo[i].tokenId != item.tokenId || normalNftInfo[i].serialNum != item.serialNum)
                                                    normalNftInfo[i].ticked = false;
                                            }
                                            item.ticked = true;
                                            setTickedNftInfo({ tokenId: item.tokenId, imgUrl: item.imgUrl });
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
                margin: '20px 0',
                width: '100%',
                padding: '0 20px'
            }}>
                <Button onClick={async () => {
                    setLoadingView(true);
                    const postData = {
                        buildingId: buildingId,
                        ticketId: tickedNftInfo.tokenId,
                        imgUrl: tickedNftInfo.imgUrl
                    };
                    const res = await postRequest(env.SERVER_URL + "/api/placement/set_ticket", postData);
                    if (!res) {
                        toast.error("Something wrong with server!");
                        setLoadingView(false);
                        return;
                    }
                    if (!res.result) {
                        toast.error(res.error);
                        setLoadingView(false);
                        return;
                    }
                    toast.success('success!');
                    onClickSetTicketBtn();
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
                    disabled={tickedNftInfo === null}
                >
                    Select Ticket
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

export default SetTicketDlg;
