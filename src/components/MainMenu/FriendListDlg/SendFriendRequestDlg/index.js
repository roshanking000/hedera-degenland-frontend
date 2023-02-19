import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getRequest } from "../../../../assets/api/apiRequests";

import * as env from "../../../../env";

const BACKGROUND_COLOR = '#ffc0ff';

function SendFriendRequestDlg({
    onClickSendFriendRequest,
    onClickCancelBtn,
}) {
    const playerInfoStore = useSelector(state => state.playerinfo);
    const [playerId, setPlayerId] = useState('');
    return (
        <div
            style={{
                width: '400px',
                backgroundColor: `${BACKGROUND_COLOR}`,
                padding: '25px 25px 15px',
                overflow: 'hidden'
            }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: 300,
                    position: 'relative'
                }}>
                    <TextField
                        hiddenLabel
                        placeholder='Enter a Username'
                        size='small'
                        value={playerId}
                        onChange={(e) => { setPlayerId(e.target.value) }}
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
                </div>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'right',
                padding: '15px 0 0 0',
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
                    onClick={async () => {
                        //check playerId
                        if (playerInfoStore.data.playerId == playerId) {
                            toast.error("Failed send friend request!");
                            return;
                        }

                        const result = await getRequest(env.SERVER_URL + "/api/account/get_player_by_id?playerId=" + btoa(playerId) + "&myAccountId=" + btoa(playerInfoStore.data.accountId));
                        if (!result) {
                            toast.error("Something wrong with server!");
                            onClickSendFriendRequest(false, playerId, null);
                        }
                        if (!result.result) {
                            toast.error(result.error);
                            onClickSendFriendRequest(false, playerId, null);
                        }
                        else {
                            const accountId = result.data;
                            toast.success('success!');
                            onClickSendFriendRequest(true, playerId, accountId);
                        }
                    }}
                >
                    Send Friend Request
                </Button>
                <Button onClick={() => {
                    setPlayerId('');
                    onClickCancelBtn();
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

export default SendFriendRequestDlg;
