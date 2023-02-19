import React from 'react';
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';

const MAIN_COLOR = '#ffc0ff';
const BUTTON_COLOR = '#fb497e';
const TITLE_COLOR = '#8b1832';

const MAIN_BUTTON_STYLE = {
    width: '100%',
    height: '48px',
    borderRadius: '24px',
    textTransform: 'none',
    fontSize: 18,
    fontWeight: 700,
    color: 'white',
    padding: '0 25px',
    backgroundColor: `${BUTTON_COLOR}`,
    margin: '5px 0',
    '&:hover': {
        backgroundColor: `${BUTTON_COLOR}`,
        boxShadow: 'none',
    },
    '&:focus': {
        outline: 'none',
        boxShadow: 'none',
    }
};

function MainMenuDlg({
    onClickBuyPalTokenBtn,
    onClickFriendsBtn,
    onClickOffersBtn,
    onClickMessagesBtn,
    onClickGoOutBtn,
    onClickProfileBtn,
    onClickMainMapBtn,
    onClickVisitPlaceBtn,
    onClickSetTicketBtn,
    onClickLogoutBtn,
    onClickCancelBtn
}) {
    const sceneStore = useSelector(state => state.scene);
    const buildinginfoStore = useSelector(state => state.buildinginfo);

    return (
        <div
            style={{
                backgroundColor: `${MAIN_COLOR}`,
                width: '400px',
                padding: '20px 20px'
            }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h1 style={{
                    fontWeight: '700',
                    margin: '0 0 10px 0',
                    color: `${TITLE_COLOR}`
                }}>DEGENLAND</h1>
                <Button onClick={() => { onClickOffersBtn() }}
                    sx={MAIN_BUTTON_STYLE}>
                    Trade NFT
                </Button>
                <Button onClick={() => { onClickBuyPalTokenBtn() }}
                    sx={MAIN_BUTTON_STYLE}>
                    Buy Pal Token
                </Button>
                {
                    sceneStore.scenename == "totalmap" &&
                    <Button onClick={() => { onClickVisitPlaceBtn() }}
                        sx={MAIN_BUTTON_STYLE}>
                        Visit place
                    </Button>
                }
                {
                    sceneStore.scenename == "construction" && buildinginfoStore.ticket != null &&
                    <Button onClick={() => { onClickSetTicketBtn() }}
                        sx={MAIN_BUTTON_STYLE}>
                        Set Ticket
                    </Button>
                }
                <Button onClick={() => { onClickFriendsBtn() }}
                    sx={MAIN_BUTTON_STYLE}>
                    Friends
                </Button>
                <Button onClick={() => { onClickMessagesBtn() }}
                    sx={MAIN_BUTTON_STYLE}>
                    Messages
                </Button>
                <Button onClick={() => { onClickProfileBtn() }}
                    sx={MAIN_BUTTON_STYLE}>
                    Profile
                </Button>
                <Button onClick={() => { onClickMainMapBtn() }}
                    sx={MAIN_BUTTON_STYLE}>
                    Main Map
                </Button>
                {
                    sceneStore.scenename == "building1" &&
                    <Button onClick={() => { onClickGoOutBtn() }}
                        sx={MAIN_BUTTON_STYLE}>
                        Go out
                    </Button>
                }
                <Button onClick={() => { onClickCancelBtn() }}
                    sx={MAIN_BUTTON_STYLE}>
                    Cancel
                </Button>
            </div>
        </div >
    );
}

export default MainMenuDlg;