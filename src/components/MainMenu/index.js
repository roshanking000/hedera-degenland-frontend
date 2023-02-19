import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainMenuDlg from './MainMenuDlg';
import AboutDlg from './AboutDlg';
import InviteOfferDlg from './InviteOfferDlg';
import FriendListDlg from "./FriendListDlg";
import FriendInfoDlg from "./FriendListDlg/FriendInfoDlg";
import CreateOfferDlg from './CreateOfferDlg';
import EditOfferDlg from './EditOfferDlg';
import OfferManageDlg from './OfferManageDlg';
import OfferDetailDlg from './OfferManageDlg/OfferDetailDlg';
import PrivateMessageDlg from "./PrivateMessageDlg";
import ChatPlayerDlg from './PrivateMessageDlg/ChatPlayerDlg';
import BuyPalTokenDlg from './BuyPalTokenDlg';
import SendFriendRequestDlg from './FriendListDlg/SendFriendRequestDlg';
import VisitPlaceDlg from './VisitPlaceDlg';
import MyInfoDlg from './OfferManageDlg/MyInfoDlg';
import SetTicketDlg from './SetTicketDlg';
import ProfileDlg from './ProfileDlg';
import EditUsernameDlg from './EditUsernameDlg';

import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import MusicNoteIcon from '@mui/icons-material/MusicNote';
import WidgetsIcon from '@mui/icons-material/Widgets';
import NotificationsIcon from '@mui/icons-material/Notifications';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import PaidIcon from '@mui/icons-material/Paid';

import * as env from "../../env";

import { useHashConnect } from "../../assets/api/HashConnectAPIProvider.tsx";
import { getRequest, postRequest } from "../../assets/api/apiRequests";

const MAIN_COLOR = '#ffc0ff';
const BUTTON_COLOR = '#fb497e';

const BADGE_STYLE = {
    'z-index': '0'
};

const SMALL_BTN_STYLE = {
    width: '42px',
    height: '42px',
    border: '3px solid',
    borderColor: `${BUTTON_COLOR}`,
    color: `${BUTTON_COLOR}`,
    padding: '0',
    '&:focus': {
        outline: 'none'
    }
};

const MAIN_BTN_STYLE = {
    width: '96px',
    height: '96px',
    marginTop: '-8px',
    padding: '0',
    backgroundColor: `${BUTTON_COLOR}`,
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
    '&:hover': {
        backgroundColor: `${BUTTON_COLOR}`
    },
    '&:focus': {
        outline: 'none'
    }
};

const ALERT_TYPE_INVITE_FRIEND = 'invite friend';
const ALERT_TYPE_DECLINED_INVITATION = 'declined invite friend';
const ALERT_TYPE_PRIVATE_MESSAGE = 'private message';
const ALERT_TYPE_NFT_SWAP_OFFER = 'nft swap offer';
const ALERT_TYPE_REWARD = 'reward notification';

const PAL_DECIMAL = 8;

let nftSwapOfferId = undefined;
let declinedNftSwapOfferId = undefined;

function MainMenu(props) {
    let history = useHistory();

    const { walletData, receiveReward } = useHashConnect();
    const { accountIds } = walletData;

    const [mainMenuDlgViewFlag, setMainMenuDlgViewFlag] = useState(false);
    const [aboutDlgViewFlag, setAboutDlgViewFlag] = useState(false);
    const [inviteOfferDlgViewFlag, setInviteOfferDlgViewFlag] = useState(false);
    const [friendListViewFlag, setFriendListViewFlag] = useState(false);
    const [friendInfoDlgViewFlag, setFriendInfoDlgViewFlag] = useState(false);
    const [myInfoDlgViewFlag, setMyInfoDlgViewFlag] = useState(false);
    const [createOfferDlgViewFlag, setCreateOfferDlgViewFlag] = useState(false);
    const [editOfferDlgViewFlag, setEditOfferDlgViewFlag] = useState(false);
    const [offerManageDlgViewFlag, setOfferManageDlgViewFlag] = useState(false);
    const [offerDetailDlgViewFlag, setOfferDetailDlgViewFlag] = useState(false);
    const [privateMessageDlgViewFlag, setPrivateMessageDlgViewFlag] = useState(false);
    const [chatPlayerDlgViewFlag, setChatPlayerDlgViewFlag] = useState(false);
    const [buyPalTokenViewFlag, setBuyPalTokenViewFlag] = useState(false);
    const [sendFriendRequestViewFlag, setSendFriendRequestViewFlag] = useState(false);
    const [visitPlaceViewFlag, setVisitPlaceViewFlag] = useState(false);
    const [ticketViewFlag, setTicketViewFlag] = useState(false);
    const [profileViewFlag, setProfileViewFlag] = useState(false);
    const [editUsernameViewFlag, setEditUsernameViewFlag] = useState(false);

    // staked Nft Info
    const [stakedNftsFlag, setStakedNftsFlag] = useState(false);

    // offer
    const [nftSwapOffer, setNftSwapOffer] = useState({});
    const [offerList, setOfferList] = useState({});
    const [claimableOfferList, setClaimableOfferList] = useState({});
    const [offerType, setOfferType] = useState("");
    const [offerState, setOfferState] = useState("");
    const [claimableState, setClaimableState] = useState(false);

    // private message list
    const [messageList, setMessageList] = useState([]);
    const [countOfMessage, setCountOfMessage] = useState(0);
    const [chatFriendInfo, setChatFriendInfo] = useState({});

    // selected friend
    const [selectedFriendInfo, setSelectedFriendInfo] = useState({});

    // selected nft
    const [selectedNftInfo, setSelectedNftInfo] = useState({});

    // set nightclub ticket
    const [buildingId, setBuildingId] = useState(null);

    const [alertInfo, setAlertInfo] = useState([]);
    const [selectedAlertInfo, setSelectedAlertInfo] = useState({});

    const [alertMenuAnchor, setAlertMenuAnchor] = useState(null);
    const alertMenuOpenFlag = Boolean(alertMenuAnchor);

    const [loadingView, setLoadingView] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const sceneStore = useSelector(state => state.scene);
    const placeStore = useSelector(state => state.placeinfo);
    const notificationStore = useSelector(state => state.notification);
    const playerinfoStore = useSelector(state => state.playerinfo);
    const friendsStore = useSelector(state => state.friends);
    const buildinginfoStore = useSelector(state => state.buildinginfo);

    // My token balance
    const [balanceInfo, setBalanceInfo] = useState({ hbar: 0, pal: 0 });

    const [landNftInfo, setLandNftInfo] = useState({});
    const [normalNftInfo, setNormalNftInfo] = useState({});
    const [walletNftCount, setWalletNftCount] = useState({});

    useEffect(() => {
        if (accountIds?.length > 0) {
            props.props.loadFriendList(accountIds[0]);
            getWalletBalance(accountIds[0]);
        }
    }, [accountIds]);

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
        await props.props.setPalBalance(parseInt(changeToRealValue(g_palBalance, PAL_DECIMAL), 10));
        setLoadingView(false);
    }

    // axios get
    const getInfoResponse = async (urlStr_) => {
        try {
            return await axios.get(urlStr_);
        } catch (error) {
            console.log(error);
        }
    };

    //Get Wallet NFT Count from mirror node
    const getWalletNftCount = async (accountId_) => {
        setLoadingView(true);

        let _nextLink = null;
        let _newWalletNftInfo = {
            degenlandCount: 0,
            tycoonCount: 0,
            mogulCount: 0,
            investorCount: 0
        };
        let _WNinfo = await axios.get(env.MIRROR_NET_URL + "/api/v1/accounts/" + accountId_ + "/nfts");
        if (_WNinfo && _WNinfo.data.nfts.length > 0)
            _nextLink = _WNinfo.data.links.next;

        while (1) {
            let _tempNftInfo = _WNinfo.data.nfts;

            for (let i = 0; i < _tempNftInfo.length; i++) {
                if (_tempNftInfo[i].token_id === env.DEGENLAND_NFT_ID) {
                    _newWalletNftInfo.degenlandCount += 1;
                } else if (_tempNftInfo[i].token_id === env.TYCOON_NFT_ID) {
                    _newWalletNftInfo.tycoonCount += 1;
                } else if (_tempNftInfo[i].token_id === env.MOGUL_NFT_ID) {
                    _newWalletNftInfo.mogulCount += 1;
                } else if (_tempNftInfo[i].token_id === env.INVESTOR_NFT_ID) {
                    _newWalletNftInfo.investorCount += 1;
                }
            }

            if (!_nextLink || _nextLink === null) break;

            _WNinfo = await axios.get(env.MIRROR_NET_URL + _nextLink);
            _nextLink = null;
            if (_WNinfo && _WNinfo.data.nfts.length > 0)
                _nextLink = _WNinfo.data.links.next;
        }
        setWalletNftCount(_newWalletNftInfo);

        const postData = {
            accountId: accountIds[0],
            NftCount: _newWalletNftInfo
        }
        const _postResult = await postRequest(env.SERVER_URL + "/api/account/set_nft_count", postData);
        if (!_postResult) {
            toast.error("Something wrong with server!");
            setLoadingView(false);
            return;
        }

        setRefreshFlag(!refreshFlag);
        setLoadingView(false);
    }

    // Complete loading notification
    useEffect(() => {
        if (notificationStore.data != null) {
            let newNotificationList = [];
            let tmpNoti = undefined;
            for (let i = 0; i < notificationStore.data.length; i++) {
                if (notificationStore.data[i].alertType == 'declined invite friend') {
                    if (tmpNoti != notificationStore.data[i]) {
                        tmpNoti = notificationStore.data[i];
                        newNotificationList.push(notificationStore.data[i]);
                    }
                }
                else
                    newNotificationList.push(notificationStore.data[i]);
            }
            setAlertInfo(newNotificationList);
        }
    }, [notificationStore.data]);

    const onClickAlertBtn = (event) => {
        setAlertMenuAnchor(event.currentTarget);
    };
    const alertMenuClose = () => {
        setAlertMenuAnchor(null);
    };

    const getReward = async () => {
        setLoadingView(true);

        // get reward amount
        const _getRewardRes = await getRequest(env.SERVER_URL + "/api/reward/get_reward_amount?accountId=" + accountIds[0]);
        if (!_getRewardRes) {
            toast.error("Something wrong with server!");
            setLoadingView(false);
            return false;
        }

        if (!_getRewardRes.result) {
            toast.error(_getRewardRes.error);
            setLoadingView(false);
            return false;
        }

        const _rewardAmount = parseInt(_getRewardRes.data, 10);

        // check reward claim state
        const _getClaimState = await getRequest(env.SERVER_URL + "/api/reward/get_state?accountId=" + accountIds[0]);
        if (!_getClaimState) {
            toast.error("Something wrong with server!");
            setLoadingView(false);
            return false;
        }

        if (!_getClaimState.result) {
            toast.error(_getClaimState.error);
            setLoadingView(false);
            return false;
        }
        console.log(_getClaimState.data);

        if (_getClaimState.data == false) {
            // send claim request
            const _claimData = {
                a: btoa(accountIds[0]),
                b: btoa(_rewardAmount)
            };
            const _claimRequestResult = await postRequest(env.SERVER_URL + "/api/reward/claim_request", _claimData);
            if (!_claimRequestResult) {
                toast.error("Something wrong with server!");
                setLoadingView(false);
                return false;
            }
    
            if (!_claimRequestResult.result) {
                toast.error(_claimRequestResult.error);
                setLoadingView(false);
                return false;
            }

            // set claimable state
            const _claimStateData = {
                accountId: accountIds[0],
                status: 'claimable'
            };
            const _setClaimRequest = await postRequest(env.SERVER_URL + "/api/reward/set_state", _claimStateData);
            if (!_setClaimRequest) {
                toast.error("Something wrong with server!");
                setLoadingView(false);
                return false;
            }

            if (!_setClaimRequest.result) {
                toast.error(_setClaimRequest.error);
                setLoadingView(false);
                return false;
            }
        }

        const _receiveResult = await receiveReward(_rewardAmount);
        if (!_receiveResult) {
            toast.error(`Something wrong with claim!`);
            setLoadingView(false);
            return false;
        }

        // set success state
        const _claimStateData = {
            accountId: accountIds[0],
            status: 'success'
        };
        const _setClaimRes = await postRequest(env.SERVER_URL + "/api/reward/set_state", _claimStateData);
        if (!_setClaimRes) {
            toast.error("Something wrong with server!");
            setLoadingView(false);
            return false;
        }

        if (!_setClaimRes.result) {
            toast.error(_setClaimRes.error);
            setLoadingView(false);
            return false;
        }

        toast.success("Claim reward successful!");
        setLoadingView(false);
        return true;
    }

    const onClickAlertMenuItem = async (alertItemInfo) => {
        if (alertItemInfo.alertType === ALERT_TYPE_INVITE_FRIEND) {
            if (alertItemInfo.state == 'unread') {
                const resData = await getInfoResponse(env.SERVER_URL + "/api/account/get_player_nft_count?accountId=" + alertItemInfo.playerInfo.accountId);
                const nftCount = resData.data.data;

                alertItemInfo.playerInfo.degenlandNftCount = nftCount.degenlandCount;
                alertItemInfo.playerInfo.tycoonNftCount = nftCount.tycoonCount;
                alertItemInfo.playerInfo.mogulNftCount = nftCount.mogulCount;
                alertItemInfo.playerInfo.investorNftCount = nftCount.investorCount;

                setSelectedAlertInfo(alertItemInfo);
                setInviteOfferDlgViewFlag(true);
            }
            else {
                await axios.post(env.SERVER_URL + "/api/notification/set_read", { id: alertItemInfo._id });
                props.props.loadNotification(playerinfoStore.data.accountId);
            }
        }
        else if (alertItemInfo.alertType === ALERT_TYPE_NFT_SWAP_OFFER) {
            await axios.post(env.SERVER_URL + "/api/notification/set_read", { id: alertItemInfo._id});
            props.props.loadNotification(playerinfoStore.data.accountId);
        }
        else if (alertItemInfo.alertType === ALERT_TYPE_PRIVATE_MESSAGE) {
            await showMessageList();
            await axios.post(env.SERVER_URL + "/api/notification/set_read", { id: alertItemInfo._id});
            props.props.loadNotification(playerinfoStore.data.accountId);
        }
        else if (alertItemInfo.alertType === ALERT_TYPE_REWARD) {
            const result = await getReward();
            if (result == true)
                props.props.loadNotification(playerinfoStore.data.accountId);
        }
    }

    const showOfferList = async () => {
        const offerList = await axios.get(env.SERVER_URL + "/api/nftswapoffer/get_offer_list?accountId=" + playerinfoStore.data.accountId);
        setOfferList(offerList.data.data);
        setClaimableOfferList(offerList.data.data.claimableOfferList);
        setLoadingView(false);
        setOfferManageDlgViewFlag(true);
    }

    const filterObject = (target_, filter_) => {
        const _result = target_.filter(function (item) {
            for (var key in filter_) {
                if (item[key] === undefined || item[key] !== filter_[key])
                    return false;
            }
            return true;
        });
        return _result;
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
        await postRequest(env.SERVER_URL + "/api/nftswapoffer/edit_offer", { offerId: oldOfferInfo._id, newOfferInfo: newOfferInfo });
    }

    //show private message list
    const showMessageList = async () => {
        setLoadingView(true);

        const _result = await getRequest(env.SERVER_URL + "/api/message/get_message_list?accountId=" + accountIds[0]);

        console.log(friendsStore);
        if (!_result) {
            setLoadingView(false);
            toast.error("Something wrong with server!");
        }

        else {
            let msgList = [];
            _result.data.map((item, index) => {
                if (item.senderAccountId == accountIds[0]) {
                    for (let i = 0; i < friendsStore.friendlist.length; i++) {
                        if (item.receiverAccountId == friendsStore.friendlist[i].accountId) {
                            let data = {
                                playerInfo: friendsStore.friendlist[i],
                                message: item.chatContent,
                                type: 'send'
                            };
                            msgList.push(data);
                        }
                    }
                }
                else {
                    for (let i = 0; i < friendsStore.friendlist.length; i++) {
                        if (item.senderAccountId == friendsStore.friendlist[i].accountId) {
                            let data = {
                                playerInfo: friendsStore.friendlist[i],
                                message: item.chatContent,
                                type: 'receive'
                            };
                            msgList.push(data);
                        }
                    }
                }
            });
            setCountOfMessage(_result.data.length);
            setMessageList(msgList);
        }
        setLoadingView(false);
        setPrivateMessageDlgViewFlag(true);
    }

    props.socket.on('createdOffer', async (id) => {
        if (playerinfoStore.data != null) {
            if (nftSwapOfferId != id) {
                nftSwapOfferId = id;
                showOfferList();
            }
        }
    });

    //Alert declined offer
    props.socket.on('alertOfferDeclined', async (notification) => {
        if (declinedNftSwapOfferId != notification._id) {
            declinedNftSwapOfferId = notification._id;

            const accountId = notification.accountId;
            props.props.loadNotification(accountId);
        }
    });

    //Alert declined offer
    props.socket.on('setTicket', async (buildingId) => {
        setBuildingId(buildingId);
        setTicketViewFlag(true);
    });

    return (
        <div onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()}
            style={{
                position: 'absolute',
                top: 0,
                left: 'calc(50% - 180px)',
                width: '360px',
                height: '64px',
            }}>
            <div style={{
                width: '100%',
                height: '100%',
                padding: '10px 55px',
                backgroundColor: `${MAIN_COLOR}`,
                borderBottomLeftRadius: '64px',
                borderBottomRightRadius: '64px',
                borderBottom: '5px solid',
                borderColor: `${BUTTON_COLOR}`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
            }}>
                <IconButton
                    onClick={() => { setAboutDlgViewFlag(true) }}
                    sx={SMALL_BTN_STYLE}>
                    <MusicNoteIcon fontSize='medium' />
                </IconButton>
                <IconButton
                    onClick={() => {
                        setMainMenuDlgViewFlag(true);
                        props.props.loadFriendList(playerinfoStore.data.accountId);
                    }}
                    sx={MAIN_BTN_STYLE}>
                    <WidgetsIcon sx={{
                        fontSize: '42px',
                        color: `${MAIN_COLOR}`
                    }} />
                </IconButton>
                <IconButton
                    onClick={onClickAlertBtn}
                    sx={SMALL_BTN_STYLE}>
                    <Badge sx={BADGE_STYLE} badgeContent={alertInfo.length} color='success'>
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </div>
            {
                <Menu
                    anchorEl={alertMenuAnchor}
                    id='account-menu'
                    open={alertMenuOpenFlag}
                    onClose={alertMenuClose}
                    onClick={alertMenuClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                left: 16,
                                width: 10,
                                height: 10,
                                backgroundColor: 'white',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0
                            }
                        }
                    }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                >
                    {
                        alertInfo.length > 0 &&
                        alertInfo.map((item, index) => {
                            return <div key={index}>
                                <MenuItem onClick={() => { onClickAlertMenuItem(item) }}>
                                    {
                                        item.alertType === ALERT_TYPE_NFT_SWAP_OFFER &&
                                        <SwapHorizontalCircleIcon />
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_INVITE_FRIEND &&
                                        <Diversity1OutlinedIcon />
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_PRIVATE_MESSAGE &&
                                        <MailOutlineOutlinedIcon />
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_REWARD &&
                                        <PaidIcon />
                                    }
                                    {/** Nft swap offer */}
                                    {
                                        item.alertType === ALERT_TYPE_REWARD &&
                                        <p style={{
                                            fontSize: 13,
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            You can get reward
                                        </p>
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state != 'accepted' &&
                                        <p style={{
                                            fontSize: 13,
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            {item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state == 'unread' ? 'Got NFT swap offer from' :
                                                item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state == 'declined' ? 'Declined your NFT swap offer by' : ''}
                                        </p>
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state != 'accepted' &&
                                        <p style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: '#8b1832',
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            {item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state == 'unread' ? item.playerInfo.playerId :
                                                item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state == 'declined' ? item.playerInfo.playerId : ''}
                                        </p>
                                    }
                                    {/* approved nft swap offer notification */}
                                    {
                                        item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state == 'approved' &&
                                        <p style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: '#8b1832',
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            {item.playerInfo.playerId}
                                        </p>
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state == 'approved' &&
                                        <p style={{
                                            fontSize: 13,
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            has approved offer
                                        </p>
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state == 'accepted' &&
                                        <p style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: '#8b1832',
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            {item.playerInfo.playerId}
                                        </p>
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_NFT_SWAP_OFFER && item.state == 'accepted' &&
                                        <p style={{
                                            fontSize: 13,
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            has accepted your offer
                                        </p>
                                    }
                                    {/** friend invite */}
                                    {
                                        item.alertType === ALERT_TYPE_INVITE_FRIEND && item.state == 'accepted' &&
                                        <p style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: '#8b1832',
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            {item.playerInfo.playerId}
                                        </p>
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_INVITE_FRIEND && item.state == 'accepted' &&
                                        <p style={{
                                            fontSize: 13,
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            has accepted your request
                                        </p>
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_INVITE_FRIEND && item.state != 'accepted' &&
                                        <p style={{
                                            fontSize: 13,
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            {item.alertType === ALERT_TYPE_INVITE_FRIEND && item.state == 'unread' ? 'Got friend request from' :
                                                item.alertType === ALERT_TYPE_INVITE_FRIEND && item.state == 'declined' ? 'Declined your request by' : ''}
                                        </p>
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_INVITE_FRIEND && item.state != 'accepted' &&
                                        <p style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: '#8b1832',
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            {item.alertType === ALERT_TYPE_INVITE_FRIEND && item.state == 'unread' ? item.playerInfo.playerId :
                                                item.alertType === ALERT_TYPE_INVITE_FRIEND && item.state == 'declined' ? item.playerInfo.playerId : ''}
                                        </p>
                                    }
                                    {
                                        item.alertType === ALERT_TYPE_PRIVATE_MESSAGE && item.state === 'unread' &&
                                        <p style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: '#8b1832',
                                            margin: '0 0 0 5px',
                                            textTransform: 'none'
                                        }}>
                                            Got private message from {item.playerInfo.playerId}
                                        </p>
                                    }
                                </MenuItem>
                                {
                                    index < alertInfo.length - 1 &&
                                    <Divider />
                                }
                            </div>
                        })
                    }
                    {
                        alertInfo?.length == 0 &&
                        <div>
                            <MenuItem>
                                <p style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: '#8b1832',
                                    margin: '0 0 0 5px',
                                    textTransform: 'none'
                                }}>
                                    No notification
                                </p>
                            </MenuItem>
                        </div>
                    }
                </Menu>
            }
            <Dialog open={mainMenuDlgViewFlag} scroll='body' >
                <MainMenuDlg
                    onClickBuyPalTokenBtn={() => {
                        setMainMenuDlgViewFlag(false);
                        setBuyPalTokenViewFlag(true);
                    }}
                    onClickFriendsBtn={() => {
                        setMainMenuDlgViewFlag(false);
                        setFriendListViewFlag(true);
                    }}
                    onClickOffersBtn={() => {
                        showOfferList();
                    }}
                    onClickVisitPlaceBtn={() => {
                        setVisitPlaceViewFlag(true);
                    }}
                    onClickSetTicketBtn={() => {
                        setTicketViewFlag(true);
                        setBuildingId(buildinginfoStore.ticket.buildingId);
                    }}
                    onClickMessagesBtn={async () => {
                        //                        props.props.loadFriendList(playerinfoStore.data.accountId);
                        await showMessageList();
                    }}
                    onClickGoOutBtn={() => {
                        setMainMenuDlgViewFlag(false);
                        props.props.setGoOut(true);
                    }}
                    onClickProfileBtn={() => {
                        setProfileViewFlag(true);
                    }}
                    onClickMainMapBtn={async () => {
                        setMainMenuDlgViewFlag(false);
                        window.location.reload(false);
                    }}
                    onClickLogoutBtn={async () => {
                        setLoadingView(true);
                        const _postResult = await postRequest(env.SERVER_URL + "/api/account/logout", { accountId: accountIds[0] });
                        if (!_postResult) {
                            toast.error("Something wrong with server!");
                            setLoadingView(false);
                            return;
                        }
                        history.push("login");
                    }}
                    onClickCancelBtn={() => { setMainMenuDlgViewFlag(false) }}
                />
            </Dialog>
            <Dialog open={buyPalTokenViewFlag} scroll='body' >
                <BuyPalTokenDlg
                    myData={playerinfoStore.data}
                    onClickBuyBtn={async () => {
                        await getWalletBalance(accountIds[0]);
                        //calculate level
                        props.props.calculateLevel(accountIds[0]);
                        setBuyPalTokenViewFlag(false);
                    }}
                    onClickCancelBtn={() => {
                        setBuyPalTokenViewFlag(false);
                    }}
                />
            </Dialog>
            <Dialog open={aboutDlgViewFlag} scroll='body' >
                <AboutDlg
                    onClickOKBtn={() => { setAboutDlgViewFlag(false) }}
                    onClickMute={(flag, volumeValue) => {
                        props.props.setMute(flag);
                        props.props.setVolume(volumeValue);
                        props.props.setVolumeChanged(true);
                    }}
                    onChangeVolume={(value) => {
                        props.props.setVolume(value);
                        props.props.setVolumeChanged(true);
                    }}
                    changeMusic={(musicName, muteState, volumeValue) => {
                        props.props.selectMusic(musicName, muteState, volumeValue);
                        props.props.setMusicChanged(true);
                    }}
                />
            </Dialog>
            {
                inviteOfferDlgViewFlag == true &&
                <Dialog open={inviteOfferDlgViewFlag} scroll='body' >
                    <InviteOfferDlg
                        myInfo={playerinfoStore.data}
                        inviteInfo={selectedAlertInfo}
                        DEGENLAND_IMG_URL={"imgs/front/nfts/degenland.png"}
                        TYCOON_IMG_URL={"imgs/front/nfts/tycoon.png"}
                        MOGUL_IMG_URL={"imgs/front/nfts/mogul.png"}
                        INVESTOR_IMG_URL={"imgs/front/nfts/investor.png"}
                        onClickAcceptBtn={async () => {
                            setInviteOfferDlgViewFlag(false);
                            await props.props.setFriend(playerinfoStore.data.accountId, selectedAlertInfo.playerInfo.accountId);
                            await props.props.loadFriendList(playerinfoStore.data.accountId);

                            const senderAccountId = playerinfoStore.data.accountId;
                            const senderPlayerId = playerinfoStore.data.playerId;
                            const notificationInfo = selectedAlertInfo;
                            props.socket.emit("setAccept", senderAccountId, senderPlayerId, notificationInfo);
                        }}
                        onClickDeclineBtn={async () => {
                            setInviteOfferDlgViewFlag(false);

                            const senderAccountId = playerinfoStore.data.accountId;
                            const senderPlayerId = playerinfoStore.data.playerId;
                            const notificationInfo = selectedAlertInfo;
                            props.socket.emit("setDecline", senderAccountId, senderPlayerId, notificationInfo);
                        }}
                    />
                </Dialog>
            }

            {
                friendListViewFlag == true &&
                <Dialog
                    open={friendListViewFlag}
                    fullWidth={false}
                    scroll='body'
                    maxWidth='md'
                >
                    <FriendListDlg
                        friendList={friendsStore?.friendlist}
                        countOfFriend={friendsStore?.friendlist?.length}
                        onClickChatBtn={(friendInfo) => {
                            setChatFriendInfo(friendInfo);
                            setChatPlayerDlgViewFlag(true);
                        }}
                        onClickMeetFriendBtn={(item) => {
                            let friendInfo = {
                                address: item.address,
                                targetPos: item.targetPos,
                                buildingId: item.buildingInsideInfo.buildingId
                            }
                            props.props.moveToFriend(friendInfo);
                            setFriendListViewFlag(false);
                        }}
                        onClickFriendInfo={(friendInfo) => {
                            setSelectedFriendInfo(friendInfo);

                            setFriendListViewFlag(false);
                            setFriendInfoDlgViewFlag(true);
                        }}
                        onClickAddFriendBtn={() => {
                            setSendFriendRequestViewFlag(true);
                        }}
                        onClickCancelBtn={() => {
                            setFriendListViewFlag(false);
                        }}
                        searchByStr={(str, sortType) => {
                            props.props.loadFriendList(playerinfoStore.data.accountId, str, sortType);
                        }}
                        onClickSortBtn={(str, sortType) => {
                            props.props.loadFriendList(playerinfoStore.data.accountId, str, sortType);
                        }}
                    />
                </Dialog>
            }

            <Dialog
                open={friendInfoDlgViewFlag}
                fullWidth={true}
                scroll='body'
                maxWidth='sm'
            >
                <FriendInfoDlg
                    selectedFriendInfo={selectedFriendInfo}
                    onClickCreateOfferBtn={(selectedNftInfo) => {
                        setSelectedNftInfo(selectedNftInfo);
                        setFriendInfoDlgViewFlag(false);
                        setCreateOfferDlgViewFlag(true);
                    }}
                    onClickCancelBtn={() => {
                        setFriendInfoDlgViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog
                open={myInfoDlgViewFlag}
                fullWidth={true}
                scroll='body'
                maxWidth='sm'
            >
                <MyInfoDlg
                    myInfo={playerinfoStore.data}
                    onClickOKBtn={() => {
                        setMyInfoDlgViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog sx={{
                margin: '0 auto',
            }}
                open={createOfferDlgViewFlag}
                fullWidth={true}
                scroll='body'
                maxWidth='lg'
            >
                <CreateOfferDlg
                    myData={playerinfoStore.data}
                    selectedFriendNftInfo={selectedNftInfo}
                    onClickSendOfferBtn={async (friendNftInfo, friendHbar, friendPal, myNftInfo, myHbar, myPal) => {
                        console.log(friendNftInfo, friendHbar, friendPal, myNftInfo, myHbar, myPal);
                        setLoadingView(true);
                        const offerInfo = {
                            friendNftInfo: friendNftInfo,
                            friendHbar: friendHbar,
                            friendPal: friendPal,
                            myNftInfo: myNftInfo,
                            myHbar: myHbar,
                            myPal: myPal
                        };
                        props.socket.emit("sendOffer", playerinfoStore.data, selectedFriendInfo.accountId, offerInfo);
                        setCreateOfferDlgViewFlag(false);
                    }}
                    onClickCancelBtn={() => {
                        setCreateOfferDlgViewFlag(false);
                    }}
                />
            </Dialog>
            {/** Edit Offer Dialog */}
            <Dialog sx={{
                margin: '0 auto',
            }}
                open={editOfferDlgViewFlag}
                fullWidth={true}
                scroll='body'
                maxWidth='lg'
            >
                <EditOfferDlg
                    myData={playerinfoStore.data}
                    offerInfo={nftSwapOffer.offerInfo}
                    myBalanceInfo={balanceInfo}
                    onClickApproveBtn={async (approveResult, oldOfferInfo) => {
                        if (approveResult == true) {
                            setEditOfferDlgViewFlag(false);
                            setOfferDetailDlgViewFlag(false);
                            setMainMenuDlgViewFlag(false);
                            toast.success("Approve success!");
                            props.socket.emit("setOfferApproved", oldOfferInfo);
                        }
                    }}
                    onClickEditOfferBtn={async (oldOfferInfo, friendNftInfo, friendHbar, friendPal, myNftInfo, myHbar, myPal) => {
                        await editOffer(oldOfferInfo, friendNftInfo, friendHbar, friendPal, myNftInfo, myHbar, myPal);
                        setEditOfferDlgViewFlag(false);
                    }}
                    onClickCancelBtn={() => {
                        setEditOfferDlgViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog
                open={offerManageDlgViewFlag}
                scroll='body'
                maxWidth='lg'
            >
                <OfferManageDlg
                    offerList={offerList}
                    claimableOfferList={claimableOfferList}
                    onClickAcceptedOfferDetail={async (offer) => {
                        const offerInfo = {
                            offerInfo: offer,
                            providerInfo: offer.providerInfo
                        };

                        setNftSwapOffer(offerInfo);

                        let stakedNftResult = await axios.get(env.SERVER_URL + "/api/stake/load_staked_nfts?accountId=" + btoa(offer.providerInfo.accountId));
                        const stakedNfts = stakedNftResult.data.data;
                        let stakedCount = 0;
                        for (let i = 0; i < offer.providerNfts.length; i++) {
                            for (let j = 0; j < stakedNfts.length; j++) {
                                if (offer.providerNfts[i].tokenId == stakedNfts[j].tokenId && offer.providerNfts[i].serialNum == stakedNfts[j].serialNum)
                                    stakedCount++;
                            }
                        }
                        if (stakedCount == offer.providerNfts.length) {
                            setStakedNftsFlag(true);
                        }
                        else {
                            setStakedNftsFlag(false);
                        }

                        setOfferState(offer.state);
                        setClaimableState(offer.claimableState);
                        if (offerInfo.providerInfo.accountId == accountIds[0])
                            setOfferType("myOffer");
                        else
                            setOfferType("receivedOffer");
                        setOfferDetailDlgViewFlag(true);
                        setOfferManageDlgViewFlag(false);
                    }}
                    onClickMyOfferDetail={async (offer) => {
                        const offerInfo = {
                            offerInfo: offer,
                            providerInfo: offer.providerInfo
                        };

                        setNftSwapOffer(offerInfo);

                        let stakedNftResult = await axios.get(env.SERVER_URL + "/api/stake/load_staked_nfts?accountId=" + btoa(offer.providerInfo.accountId));
                        const stakedNfts = stakedNftResult.data.data;
                        let stakedCount = 0;
                        for (let i = 0; i < offer.providerNfts.length; i++) {
                            for (let j = 0; j < stakedNfts.length; j++) {
                                if (offer.providerNfts[i].tokenId == stakedNfts[j].tokenId && offer.providerNfts[i].serialNum == stakedNfts[j].serialNum)
                                    stakedCount++;
                            }
                        }
                        if (offer.providerNfts.length == 0) {
                            setStakedNftsFlag(false);
                            setOfferManageDlgViewFlag(false);
                            setEditOfferDlgViewFlag(true);
                        }
                        else {
                            if (stakedCount == offer.providerNfts.length) {
                                setStakedNftsFlag(true);
                                setOfferManageDlgViewFlag(false);
                                setOfferState(offer.state);
                                setClaimableState(offer.claimableState);
                                setOfferType("myOffer");
                                setOfferDetailDlgViewFlag(true);
                            }
                            else {
                                setStakedNftsFlag(false);
                                setOfferManageDlgViewFlag(false);
                                setEditOfferDlgViewFlag(true);
                            }
                        }
                    }}
                    onClickReceivedOfferDetail={async (offer) => {
                        const offerInfo = {
                            offerInfo: offer,
                            providerInfo: offer.providerInfo
                        };

                        setNftSwapOffer(offerInfo);

                        let stakedNftResult = await axios.get(env.SERVER_URL + "/api/stake/load_staked_nfts?accountId=" + btoa(offer.providerInfo.accountId));
                        const stakedNfts = stakedNftResult.data.data;
                        console.log("stakedNfts log ", stakedNfts);
                        console.log(offer);
                        let stakedCount = 0;
                        for (let i = 0; i < offer.providerNfts.length; i++) {
                            for (let j = 0; j < stakedNfts.length; j++) {
                                if (offer.providerNfts[i].tokenId == stakedNfts[j].tokenId && offer.providerNfts[i].serialNum == stakedNfts[j].serialNum)
                                    stakedCount++;
                            }
                        }
                        if (stakedCount == offer.providerNfts.length) {
                            setStakedNftsFlag(true);
                        }
                        else {
                            setStakedNftsFlag(false);
                        }

                        setOfferState(offer.state);
                        setClaimableState(offer.claimableState);
                        setOfferType("receivedOffer");
                        setOfferDetailDlgViewFlag(true);
                        setOfferManageDlgViewFlag(false);
                    }}
                    onClickCreateOfferBtn={() => {
                        setOfferManageDlgViewFlag(false);
                        setMainMenuDlgViewFlag(false);
                        setFriendListViewFlag(true);
                    }}
                    onClickViewMyNFTBtn={() => {
                        setMyInfoDlgViewFlag(true);
                    }}
                    onClickCancelBtn={() => {
                        setOfferManageDlgViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog
                open={offerDetailDlgViewFlag}
                scroll='body'
                maxWidth='md'
            >
                <OfferDetailDlg
                    providerInfo={nftSwapOffer.providerInfo}
                    offerInfo={nftSwapOffer.offerInfo}
                    isStaked={stakedNftsFlag}
                    offerState={offerState}
                    claimableState={claimableState}
                    offerType={offerType}
                    onClickFriend={(friendAccountId) => {
                        for (let i = 0; i < friendsStore.friendlist.length; i++) {
                            if (friendsStore.friendlist[i].accountId == friendAccountId) {
                                setChatFriendInfo(friendsStore.friendlist[i]);
                                setChatPlayerDlgViewFlag(true);
                            }
                        }
                    }}
                    onClickClaimBtn={(successFlag) => {
                        if (successFlag == true) {
                            setOfferDetailDlgViewFlag(false);
                            setMainMenuDlgViewFlag(false);
                            window.location.reload(false);
                        }
                    }}
                    onClickAcceptBtn={async (offerInfo, result) => {
                        if (result == true)
                            props.socket.emit("setAcceptOffer", offerInfo);
                        setOfferDetailDlgViewFlag(false);
                        setMainMenuDlgViewFlag(false);
                    }}
                    onClickDeclineBtn={(offerInfo) => {
                        props.socket.emit("setOfferDecline", offerInfo);
                        setOfferDetailDlgViewFlag(false);
                    }}
                    onClickCancelBtn={() => {
                        setOfferDetailDlgViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog
                open={privateMessageDlgViewFlag}
                scroll='body'
            >
                <PrivateMessageDlg
                    myInfo={playerinfoStore.data}
                    messageList={messageList}
                    countOfMessage={countOfMessage}
                    onClickChatBtn={(friendInfo) => {
                        setChatFriendInfo(friendInfo);
                        setChatPlayerDlgViewFlag(true);
                    }}
                    onClickCancelBtn={() => {
                        setPrivateMessageDlgViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog open={chatPlayerDlgViewFlag} scroll='body' >
                <ChatPlayerDlg
                    friendInfo={chatFriendInfo}
                    onClickSendPVMsgBtn={(val, friendAccountId, friendPlayerId) => {
                        props.socket.emit("sendPrivateMsg", accountIds[0], friendAccountId, friendPlayerId, val);
                    }}
                    onClickDetailBtn={(friendInfo) => {
                        setSelectedFriendInfo(friendInfo);
                        setChatPlayerDlgViewFlag(false);
                        setFriendInfoDlgViewFlag(true);
                    }}
                    onClickCancelBtn={() => {
                        setChatPlayerDlgViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog open={sendFriendRequestViewFlag} >
                <SendFriendRequestDlg
                    onClickSendFriendRequest={(result, playerId, accountId) => {
                        if (result) {
                            props.socket.emit("inviteToFriend", accountIds[0], accountId, playerId);
                            setSendFriendRequestViewFlag(false);
                        }
                    }}
                    onClickCancelBtn={() => {
                        setSendFriendRequestViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog open={visitPlaceViewFlag}>
                <VisitPlaceDlg
                    onClickVisitBtn={(_address, _pos) => {
                        setVisitPlaceViewFlag(false);
                        setMainMenuDlgViewFlag(false);
                        props.props.setVisitPlace(_address + ':' + _pos);
                    }}
                    onClickCancelBtn={() => {
                        setVisitPlaceViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog
                open={ticketViewFlag}
                fullWidth={true}
                scroll='body'
                maxWidth='sm'
            >
                <SetTicketDlg
                    myInfo={playerinfoStore.data}
                    buildingId={buildingId}
                    onClickSetTicketBtn={() => {
                        setTicketViewFlag(false);
                    }}
                    onClickCancelBtn={() => {
                        setTicketViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog
                open={profileViewFlag}
                fullWidth={true}
                scroll='body'
                maxWidth='sm'
            >
                <ProfileDlg
                    onClickEditBtn={() => {
                        setEditUsernameViewFlag(true);
                    }}
                    onClickCancelBtn={() => {
                        setProfileViewFlag(false);
                    }}
                />
            </Dialog>

            <Dialog
                open={editUsernameViewFlag}
                scroll='body'
                maxWidth='sm'
            >
                <EditUsernameDlg
                    props={props.props}
                    onClickOKBtn={() => {
                        setEditUsernameViewFlag(false);
                    }}
                    onClickCancelBtn={() => {
                        setEditUsernameViewFlag(false);
                    }}
                />
            </Dialog>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingView}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    );
}

export default MainMenu;
