import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import MuiInput from '@mui/material/Input';

import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const MAIN_COLOR = '#ffc0ff';
const BUTTON_COLOR = '#fb497e';
const TITLE_COLOR = '#8b1832';

const MAIN_BUTTON_STYLE = {
    width: '150px',
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

function AboutDlg({
    onClickOKBtn,
    onClickMute,
    onChangeVolume,
    changeMusic
}) {
    const [musicName, setMusicName] = useState('');
    const [muteState, setMuteState] = useState(false);
    const [volumeValue, setVolumeValue] = useState(100);
    const musicStore = useSelector(state => state.music);

    const onhandleMute = (e) => {
        setMuteState(e.target.checked);
        onClickMute(e.target.checked, volumeValue);
    }

    const handleSliderChange = (e) => {
        setVolumeValue(e.target.value);
        onChangeVolume(e.target.value);
    }

    useEffect(() => {
        if (musicStore.name != null)
            setMusicName(musicStore.name);
        else {
            localStorage.setItem('degenlandMusicName', "ES_nevermind-dreem");
            setMusicName("ES_nevermind-dreem");
        }
        if (musicStore.mute != null) {
            let mute = JSON.parse(musicStore.mute);
            setMuteState(mute);
        }
        else {
            localStorage.setItem('degenlandMusicMute', false);
            setMuteState(false);
        }
        if (musicStore.volume != null) {
            let volume = JSON.parse(musicStore.volume);
            setVolumeValue(volume);
        }
        else {
            localStorage.setItem('degenlandMusicVolume', 100);
            setVolumeValue(100);
        }
        console.log(musicStore);
    }, []);

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
                <p style={{
                    fontWeight: '700',
                    color: `${TITLE_COLOR}`,
                    fontSize: 16
                }}>version 1.0</p>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl variant="standard" sx={{ m: 1, width: 250 }}>
                        <InputLabel id="demo-simple-select-label">Music</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={musicName}
                            label="Music"
                            onChange={(e) => {
                                setMusicName(e.target.value);
                                changeMusic(e.target.value, muteState, volumeValue);
                            }}
                        >
                            <MenuItem value={'ES_nevermind-dreem'}><em>ES_nevermind-dreem</em></MenuItem>
                            <MenuItem value={'ES_Leveled-AGST'}>ES_Leveled-AGST</MenuItem>
                            <MenuItem value={'ES_Change-AGST'}>ES_Change-AGST</MenuItem>
                            <MenuItem value={'ES_PressXTwice-Lexica'}>ES_PressXTwice-Lexica</MenuItem>
                            <MenuItem value={'ES_Riversides-Tape-Machines'}>ES_Riversides-Tape-Machines</MenuItem>
                            <MenuItem value={'ES_Furious-Squiid'}>ES_Furious-Squiid</MenuItem>
                            <MenuItem value={'ES_Hype'}>ES_Hype</MenuItem>
                            <MenuItem value={'ES_NightBus-Focality'}>ES_NightBus-Focality</MenuItem>
                            <MenuItem value={'ES_O.T.T-Ruzer'}>ES_O.T.T-Ruzer</MenuItem>
                            <MenuItem value={'ES_This Is How I Feel Inside - Ruzer'}>ES_This Is How I Feel Inside - Ruzer</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Grid container spacing={2} alignItems="center" sx={{ width: 250 }}>
                    <Grid item>
                        <Checkbox onClick={onhandleMute} checked={muteState} icon={<VolumeUpIcon fontSize='large' />} checkedIcon={<VolumeOffIcon fontSize='large' />} />
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={volumeValue}
                            onChange={handleSliderChange}
                        />
                    </Grid>
                </Grid>
                <Button onClick={() => { onClickOKBtn() }}
                    sx={MAIN_BUTTON_STYLE}>
                    OK
                </Button>
            </div>
        </div >
    );
}

export default AboutDlg;