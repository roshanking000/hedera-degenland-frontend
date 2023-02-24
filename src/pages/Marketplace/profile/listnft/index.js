import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    Avatar,
    Backdrop,
    Button,
    LinearProgress,
    CircularProgress,
    Box,
    Grid,
    Paper,
    TextField,
} from '@mui/material';

import {
    PersonOutline,
    Add,
    EventNoteOutlined
} from '@mui/icons-material';

import { useHashConnect } from "../../../../assets/api/HashConnectAPIProvider.tsx";
import { getRequest, postRequest } from "../../../../assets/api/apiRequests";
import * as env from "../../../../env";

import NavBar from '../../../../components/NavBar';

export default function ListNFT() {
    const { token_id, serial_number } = useParams();
    let history = useHistory();

    const { walletData, allowanceNft } = useHashConnect();
    const { accountIds } = walletData;

    const [loadingView, setLoadingView] = useState(false);
    const [nftInfo, setNftInfo] = useState(null);
    const [nftPrice, setNftPrice] = useState(100000);
    const [nftDetailInfo, setNftDetailInfo] = useState(null);
    const [listState, setListState] = useState(null);

    useEffect(() => {
        const getNftInfoFromMirrorNet = async (tokenId_, serialNum_) => {
            setLoadingView(true);
            const g_singleNftInfo = await getRequest(`${env.MIRROR_NET_URL}/api/v1/tokens/${tokenId_}/nfts?serialNumber=${serialNum_}`);
            if (g_singleNftInfo && g_singleNftInfo.nfts.length > 0) {
                let g_preMdUrl = base64ToUtf8(g_singleNftInfo.nfts[0].metadata).split("//");

                let _metadataUrl = env.IPFS_URL + g_preMdUrl[g_preMdUrl.length - 1];
                const _metadataInfo = await getRequest(_metadataUrl); // get NFT metadata
                if (_metadataInfo && _metadataInfo.image != undefined) {
                    let _imageUrlList = _metadataInfo.image.split('/');
                    let _imageUrlLen = _imageUrlList?.length;
                    const _imageUrl = env.IPFS_URL + _imageUrlList[_imageUrlLen - 2] + "/" + _imageUrlList[_imageUrlLen - 1];

                    const _metaData = {
                        token_id: tokenId_,
                        serial_number: serialNum_,
                        attributes: _metadataInfo.attributes,
                        creator: _metadataInfo.creator,
                        description: _metadataInfo.description,
                        name: _metadataInfo.name,
                        imageUrl: _imageUrl
                    };
                    setNftInfo(_metaData);
                    setLoadingView(false);
                    console.log("getNftInfoFromMirrorNet");
                    return;
                }
                toast.error("Something wrong with server!");
                setLoadingView(false);
                return;
            }
            toast.error("Something wrong with server!");
            return;
        }

        const getDetailInfo = async (tokenId_, serialNum_) => {
            setLoadingView(true);
            const _nftDetailRes = await getRequest(`${env.MIRROR_NET_URL}/api/v1/tokens/${tokenId_}`);
            if (!_nftDetailRes) {
                toast.error("Something wrong with server!");
                setLoadingView(false);
                return;
            }
            let _nftDetailList = [];
            _nftDetailList.push({ name: 'Token ID', value: tokenId_ });
            _nftDetailList.push({ name: 'Serial Number', value: serialNum_ });
            _nftDetailList.push({ name: 'Supply', value: _nftDetailRes.total_supply });
            if (_nftDetailRes.custom_fees?.royalty_fees?.length > 0 && _nftDetailRes.custom_fees.royalty_fees[0].fallback_fee) {
                const g_fallback = _nftDetailRes.custom_fees.royalty_fees[0].fallback_fee.amount / 100000000;
                _nftDetailList.push({ name: 'Fallback Fees', value: g_fallback + " HBAR" });
            }
            if (_nftDetailRes.custom_fees?.royalty_fees?.length > 0) {
                let totalRoyalties = 0;
                for (let i = 0; i < _nftDetailRes.custom_fees.royalty_fees.length; i++)
                    totalRoyalties += _nftDetailRes.custom_fees.royalty_fees[i].amount.numerator * 100 / _nftDetailRes.custom_fees.royalty_fees[i].amount.denominator;
                _nftDetailList.push({ name: 'Artist Royalties', value: totalRoyalties.toFixed(2) + "%" });
            }
            _nftDetailList.push({ name: 'Transaction Fee', value: '2%' });
            _nftDetailList.push({ name: 'Listing/delisting network fee', value: '$0.05' });
            setNftDetailInfo(_nftDetailList);
            console.log("getDetailInfo");
            return;
        }

        getNftInfoFromMirrorNet(token_id, serial_number);
        getDetailInfo(token_id, serial_number);
        checkList(token_id, serial_number);
    }, []);

    const checkList = async (tokenId_, serialNum_) => {
        const _res = await getRequest(env.SERVER_URL + "/api/marketplace/check_nft?token_id=" + tokenId_ + "&serial_number=" + serialNum_);
        if (!_res) {
            toast.error("Something wrong with server!");
            setLoadingView(false);
            return;
        }
        if (!_res.result) {
            toast.error(_res.error);
            setLoadingView(false);
            return;
        }
        setLoadingView(false);
        setListState(_res.data);
        return;
    }

    // convert metadata base64 string to utf8
    const base64ToUtf8 = (base64Str_) => {
        // create a buffer
        const _buff = Buffer.from(base64Str_, 'base64');

        // decode buffer as UTF-8
        const _utf8Str = _buff.toString('utf-8');

        return _utf8Str;
    }

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    return (
        <Box sx={{ flexGrow: 1 }}>
            <NavBar />
            {
                nftInfo &&
                <Box component="main" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#ffc0ff',
                    marginLeft: '5rem'
                }}>
                    <Paper
                        sx={{
                            padding: '10px',
                            maxWidth: 1216,
                            my: 1,
                            mx: 'auto',
                            p: 2,
                            backgroundColor: '#ffc0ff',
                            boxShadow: 'none',
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '5px',
                                        margin: '5px',
                                        maxWidth: '600px',
                                    }}>
                                    <img alt='' src={nftInfo.imageUrl} style={{
                                        borderRadius: '0.375rem',
                                    }} />
                                    <video style={{
                                        borderRadius: '0.375rem',
                                    }} autoPlay loop>
                                        <source src={nftInfo.imageUrl} />
                                    </video>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                {/* 1 part */}
                                <h1 style={{
                                    letterSpacing: '-.025em',
                                    fontWeight: '800',
                                    fontSize: '1.875rem',
                                    lineHeight: '2.25rem',
                                    textTransform: 'none',
                                    margin: '0'
                                }}>
                                    {nftInfo.name}
                                </h1>
                                <p style={{
                                    color: 'blue',
                                    marginTop: '0.25rem',
                                    fontWeight: '500',
                                }}>
                                    {nftInfo.creator}
                                </p>
                                {/* 2 part */}
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    backgroundColor: 'darkseagreen',
                                    fontWeight: '600',
                                }}>
                                    First make sure the HashPack Chrome extension is open and unlocked. To list your NFT input the amount of HBAR you would like to sell it for (mininum 2 HBAR). Click "List this NFT". A transaction will be sent to your HashPack wallet, which needs to be approved.
                                    <div style={{
                                        display: 'flex',
                                        paddingBottom: '0.75rem',
                                        marginTop: '0.75rem'
                                    }}>
                                        {
                                            listState && listState.status == false &&
                                            <div style={{
                                                display: 'flex',
                                                marginTop: '2.5rem'
                                            }}>
                                                <div style={{
                                                    position: 'relative',
                                                    borderRadius: '0.375rem',
                                                    marginRight: '0.5rem',
                                                }}>
                                                    <TextField
                                                        label="price"
                                                        type="text"
                                                        size="small"
                                                        value={nftPrice}
                                                        onChange={(e) => {
                                                            const regex = /^[0-9\b]+$/;
                                                            if (e.target.value == "" || regex.test(e.target.value))
                                                                setNftPrice(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                                <Button onClick={async () => {
                                                    setLoadingView(true);
                                                    // Allowance nft
                                                    const _approveResult = await allowanceNft(token_id, serial_number);
                                                    if (!_approveResult) {
                                                        toast.error("Error! The transaction was rejected, or failed!");
                                                        setLoadingView(false);
                                                        return;
                                                    }

                                                    const _postData = {
                                                        owner_accountid: accountIds[0],
                                                        token_id: token_id,
                                                        serial_number: serial_number,
                                                        price: nftPrice,
                                                        name: nftInfo.name,
                                                        creator: nftInfo.creator,
                                                        imageUrl: nftInfo.imageUrl
                                                    };

                                                    const _nftListRes = await postRequest(env.SERVER_URL + "/api/marketplace/set_list", _postData);
                                                    if (!_nftListRes) {
                                                        toast.error("Something wrong with server!");
                                                        setLoadingView(false);
                                                        return;
                                                    }
                                                    if (!_nftListRes.result) {
                                                        toast.error(_nftListRes.error);
                                                        setLoadingView(false);
                                                        return;
                                                    }
                                                    checkList(token_id, serial_number);
                                                    // success
                                                    toast.success(_nftListRes.msg);
                                                    setLoadingView(false);
                                                }}
                                                    variant='outlined'
                                                    sx={{
                                                        padding: '1rem, 0.25rem',
                                                        marginRight: '1rem',
                                                        borderRadius: '21px',
                                                        textTransform: 'none',
                                                        fontSize: 16,
                                                        fontWeight: 700,
                                                        color: 'blueviolet',
                                                        border: '1px solid #e74895',
                                                        '&:hover': {
                                                            backgroundColor: 'blueviolet',
                                                            border: '2px solid blueviolet',
                                                            color: 'white',
                                                            boxShadow: 'none',
                                                        },
                                                        '&:focus': {
                                                            outline: 'none',
                                                            boxShadow: 'none',
                                                        }
                                                    }}>
                                                    List this NFT
                                                </Button>
                                            </div>
                                        }
                                        {
                                            listState && listState.status == true && listState.id &&
                                            <div style={{
                                                display: 'flex',
                                                marginTop: '2.5rem'
                                            }}>
                                                <Button
                                                    sx={{
                                                        display: 'flex',
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
                                                        history.push(`/item-details/${listState.id}`);
                                                    }}
                                                >
                                                    View NFT listing
                                                </Button>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {/* 3 part */}
                                <Box sx={{
                                    marginTop: '1rem'
                                }}>
                                    {/* About collection */}
                                    <Box>
                                        <button style={{
                                            display: 'flex',
                                            height: '46px',
                                            position: 'relative',
                                            textAlign: 'left',
                                            paddingTop: '0.5rem',
                                            paddingBottom: '0.5rem',
                                            borderWidth: '1px',
                                            borderRadius: '0.5rem',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                            padding: '0',
                                            lineHeight: 'inherit',
                                            color: 'inherit',
                                            backgroundColor: 'transparent',
                                            backgroundImage: 'none',
                                            fontFamily: 'inherit',
                                            fontSize: '100%',
                                            margin: '0'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                paddingLeft: '1rem',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <PersonOutline sx={{
                                                    display: 'block',
                                                    color: 'blue',
                                                    verticalAlign: 'middle',
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    marginRight: '0.5rem'
                                                }} />
                                                <span style={{
                                                    fontWeight: '700',
                                                    verticalAlign: 'middle'
                                                }}>
                                                    About {nftInfo.creator}
                                                </span>
                                            </div>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginLeft: '1.5rem',
                                                marginRight: '0.5rem'
                                            }}>
                                                {/* <Add sx={{
                                                    display: 'block',
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    verticalAlign: 'middle',
                                                    color: 'gray'
                                                }} /> */}
                                            </span>
                                        </button>
                                        <div style={{
                                            paddingTop: '0.5rem',
                                            paddingBottom: '0.5rem',
                                            paddingLeft: '1.5rem',
                                            paddingRight: '1.5rem',
                                            backgroundColor: 'darksalmon',
                                            borderWidth: '1px',
                                            borderRadius: '0.5rem',
                                            marginTop: '0.5rem',
                                            marginBottom: '0.5rem',
                                            fontWeight: '600',
                                        }}>
                                            {nftInfo.description}
                                        </div>
                                    </Box>
                                    {/* About Attributes */}
                                    <Box>
                                        <button style={{
                                            display: 'flex',
                                            height: '46px',
                                            position: 'relative',
                                            textAlign: 'left',
                                            paddingTop: '0.5rem',
                                            paddingBottom: '0.5rem',
                                            borderWidth: '1px',
                                            borderRadius: '0.5rem',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                            padding: '0',
                                            lineHeight: 'inherit',
                                            color: 'inherit',
                                            backgroundColor: 'transparent',
                                            backgroundImage: 'none',
                                            fontFamily: 'inherit',
                                            fontSize: '100%',
                                            margin: '0'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                paddingLeft: '1rem',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <EventNoteOutlined sx={{
                                                    display: 'block',
                                                    color: 'blue',
                                                    verticalAlign: 'middle',
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    marginRight: '0.5rem'
                                                }} />
                                                <span style={{
                                                    fontWeight: '700',
                                                    verticalAlign: 'middle'
                                                }}>
                                                    Attributes
                                                </span>
                                            </div>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginLeft: '1.5rem',
                                                marginRight: '0.5rem'
                                            }}>
                                                {/* <Add sx={{
                                                    display: 'block',
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    verticalAlign: 'middle',
                                                    color: 'gray'
                                                }} /> */}
                                            </span>
                                        </button>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
                                            paddingTop: '0.25rem',
                                            paddingBottom: '0.25rem',
                                            paddingLeft: '0.5rem',
                                            paddingRight: '0.5rem',
                                            backgroundColor: 'darksalmon',
                                            borderWidth: '1px',
                                            borderRadius: '0.5rem',
                                            marginTop: '0.5rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {
                                                nftInfo.attributes.map((item, index) => {
                                                    return <div key={index} style={{
                                                        padding: '0.75rem',
                                                        backgroundColor: 'black',
                                                        borderRadius: '0.5rem',
                                                        margin: '0.25rem'
                                                    }}>
                                                        <div style={{
                                                            lineHeight: '1rem',
                                                            marginBottom: '0.25rem',
                                                            color: 'darkgray'
                                                        }}>
                                                            {item.trait_type}
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            rowGap: '0.25rem',
                                                            columnGap: '1rem',
                                                            color: 'whitesmoke'
                                                        }}>
                                                            {item.value}
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </Box>
                                    {/* About Details */}
                                    <Box>
                                        <button style={{
                                            display: 'flex',
                                            height: '46px',
                                            position: 'relative',
                                            textAlign: 'left',
                                            paddingTop: '0.5rem',
                                            paddingBottom: '0.5rem',
                                            borderWidth: '1px',
                                            borderRadius: '0.5rem',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                            padding: '0',
                                            lineHeight: 'inherit',
                                            color: 'inherit',
                                            backgroundColor: 'transparent',
                                            backgroundImage: 'none',
                                            fontFamily: 'inherit',
                                            fontSize: '100%',
                                            margin: '0'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                paddingLeft: '1rem',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <EventNoteOutlined sx={{
                                                    display: 'block',
                                                    color: 'blue',
                                                    verticalAlign: 'middle',
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    marginRight: '0.5rem'
                                                }} />
                                                <span style={{
                                                    fontWeight: '700',
                                                    verticalAlign: 'middle'
                                                }}>
                                                    Details
                                                </span>
                                            </div>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginLeft: '1.5rem',
                                                marginRight: '0.5rem'
                                            }}>
                                                {/* <Add sx={{
                                                    display: 'block',
                                                    width: '1.75rem',
                                                    height: '1.75rem',
                                                    verticalAlign: 'middle',
                                                    color: 'gray'
                                                }} /> */}
                                            </span>
                                        </button>
                                        <div style={{
                                            paddingTop: '0.5rem',
                                            paddingBottom: '0.5rem',
                                            paddingLeft: '1.5rem',
                                            paddingRight: '1.5rem',
                                            backgroundColor: 'darksalmon',
                                            borderWidth: '1px',
                                            borderRadius: '0.5rem',
                                            marginTop: '0.5rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {
                                                nftDetailInfo &&
                                                nftDetailInfo.map((item, index) => {
                                                    return <div key={index} style={{
                                                        display: 'flex',
                                                        position: 'relative',
                                                        textAlign: 'left',
                                                        paddingTop: '0.25rem',
                                                        paddingBottom: '0.25rem',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            fontWeight: '600',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}>
                                                            {item.name}
                                                        </div>
                                                        <span style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginLeft: '1.5rem',
                                                            color: 'unset',
                                                            fontWeight: '600',
                                                        }}>
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingView}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer autoClose={5000} draggableDirection="x" />
        </Box>
    );
}
