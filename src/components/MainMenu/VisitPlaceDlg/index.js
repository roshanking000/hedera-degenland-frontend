import React, { useState } from 'react';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { getRequest } from "../../../assets/api/apiRequests";

import * as env from "../../../env";

const TITLE_COLOR = '#8b1832';

function VisitPlaceDlg({
    onClickVisitBtn,
    onClickCancelBtn
}) {
    const [placeType, setPlaceType] = useState('degen');
    const [placeNumber, setPlaceNumber] = useState(1);
    const [loadingView, setLoadingView] = useState(false);

    return (
        <div
            style={{
                backgroundColor: '#ffc0ff',
                width: '480px',
                padding: '15px',
                overflow: 'hidden'
            }}>
            {/* Place info */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}>
                {
                    placeType == 'degen' &&
                    <Avatar alt="Degenland" src="imgs/front/nfts/degenland.png"
                        sx={{
                            width: 128,
                            height: 128,
                            fontSize: '64px',
                            backgroundColor: '#e0e0e0',
                            border: '2px solid white',
                            alignItems: 'center',
                        }}
                    />
                }
                {
                    placeType == 'tycoon' &&
                    <Avatar alt="Tycoon" src="imgs/front/nfts/tycoon.png"
                        sx={{
                            width: 128,
                            height: 128,
                            fontSize: '64px',
                            backgroundColor: '#e0e0e0',
                            border: '2px solid white'
                        }}
                    />
                }
                {
                    placeType == 'mogul' &&
                    <Avatar alt="Mogul" src="imgs/front/nfts/mogul.png"
                        sx={{
                            width: 128,
                            height: 128,
                            fontSize: '64px',
                            backgroundColor: '#e0e0e0',
                            border: '2px solid white'
                        }}
                    />
                }
                {
                    placeType == 'investor' &&
                    <Avatar alt="Investor" src="imgs/front/nfts/investor.png"
                        sx={{
                            width: 128,
                            height: 128,
                            fontSize: '64px',
                            backgroundColor: '#e0e0e0',
                            border: '2px solid white'
                        }}
                    />
                }
            </div>
            <div
                style={{
                    width: '100%',
                    height: '2px',
                    marginTop: '15px',
                    backgroundColor: `${TITLE_COLOR}`,
                    position: 'relative'
                }}
            >
            </div>
            <Box sx={{
                minWidth: 120,
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <FormControl variant="standard" sx={{ m: 1, width: 150 }}>
                    <InputLabel id="demo-simple-select-label">Place Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={placeType}
                        label="Place Type"
                        onChange={(e) => {
                            setPlaceType(e.target.value);
                        }}
                    >
                        <MenuItem value={'degen'}>Degen</MenuItem>
                        <MenuItem value={'tycoon'}>Tycoon</MenuItem>
                        <MenuItem value={'mogul'}>Mogul</MenuItem>
                        <MenuItem value={'investor'}>Investor</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1, width: 150 }}>
                    <TextField
                        id="standard-password-input"
                        label="Place Number"
                        variant="standard"
                        value={placeNumber}
                        onChange={(e) => {
                            const regex = /^[0-9\b]+$/;
                            if (e.target.value == "" || regex.test(e.target.value))
                                setPlaceNumber(e.target.value)
                        }}
                    />
                </FormControl>
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
                <Button onClick={async () => {
                    setLoadingView(true);
                    let place_number = 1;
                    if (placeNumber == '')
                        place_number = 1;
                    else
                        place_number = placeNumber;
                    
                    const _result = await getRequest(env.SERVER_URL + "/api/place/get_place_info_by_name?name=" + placeType + '-' + place_number);
                    console.log(_result);
                    if (!_result) {
                        toast.error("Something wrong with server!");
                        setLoadingView(false);
                        return;
                    }
                    if (!_result.status) {
                        toast.error(_result.message);
                        setLoadingView(false);
                        return;
                    }
                    const _address = _result.data.address;
                    const _pos = _result.data.pos;
                    if (_address == '' || _pos == '') {
                        toast.error('This place is wasteland!');
                        setLoadingView(false);
                        return;
                    }
                    onClickVisitBtn(_address, _pos);
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
                    Visit
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingView}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    );
}

export default VisitPlaceDlg;