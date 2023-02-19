import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getRequest, postRequest } from "../../../assets/api/apiRequests";

import * as env from "../../../env";

const TITLE_COLOR = '#8b1832';

function EditUsernameDlg({
    props,
    onClickOKBtn,
    onClickCancelBtn
}) {
    const [loadingView, setLoadingView] = useState(false);
    const myUsername = useSelector(state => state.playerinfo.data.playerId);
    const [newUsername, setNewUsername] = useState(myUsername);

    const getPlayerInfo = async (accountId_) => {
        const g_playerInfo = await getRequest(env.SERVER_URL + "/api/account/get_player?accountId=" + accountId_);

        if (!g_playerInfo) {
            toast.error("Something wrong with server!");
            setLoadingView(false);
            return;
        }

        if (!g_playerInfo.result) {
            toast.error(g_playerInfo.error);
            setLoadingView(false);
            return;
        }

        props.setPlayerInfo(g_playerInfo.data);
    }

    const editUsername = async () => {
        setLoadingView(true);

        const _postData = {
            oldUsername: myUsername,
            newUsername: newUsername
        }

        const _res = await postRequest(env.SERVER_URL + "/api/account/edit_playerId", _postData);
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
        
        // get new player info
        await getPlayerInfo(_res.accountId);
        toast.success(_res.msg);
        setLoadingView(false);
        onClickOKBtn();
    }

    return (
        <div
            style={{
                backgroundColor: '#ffc0ff',
                width: '360px',
                padding: '15px',
                overflow: 'hidden'
            }}>
            {/* Place info */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                margin: '20px 0 20px 20px',
                position: 'relative',
            }}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <DialogContentText sx={{
                        paddingBottom: '10px',
                        textAlign: 'center'
                    }}>
                        Enter a new username.
                    </DialogContentText>
                    <TextField sx={{
                        paddingTop: '10px',
                    }}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="USERNAME"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newUsername}
                        onChange={(e) => {
                            setNewUsername(e.target.value);
                        }}
                    />
                </div>
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
                    editUsername();
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
                    OK
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
            <ToastContainer autoClose={5000} draggableDirection="x" />
        </div>
    );
}

export default EditUsernameDlg;