import { SELECTED_MUSIC, SET_MUTE, SET_MUSIC_CHANGED, SET_VOLUME_CHANGED, SET_VOLUME } from './types';

export const selectMusic = (musicName, muteState, volumeValue) => dispatch => {
  dispatch({
    type: SELECTED_MUSIC,
    musicName: musicName,
    muteState: muteState,
    volumeValue: volumeValue
  });
};

export const setMute = (flag) => dispatch => {
  dispatch({
    type: SET_MUTE,
    payload: flag
  });
};

export const setMusicChanged = flag => dispatch => {
  dispatch({
    type: SET_MUSIC_CHANGED,
    payload: flag
  });
};

export const setVolumeChanged = flag => dispatch => {
  dispatch({
    type: SET_VOLUME_CHANGED,
    payload: flag
  });
};

export const setVolume = value => dispatch => {
  dispatch({
    type: SET_VOLUME,
    payload: value
  });
};
