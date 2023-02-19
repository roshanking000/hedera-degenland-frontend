import { SELECTED_MUSIC, SET_MUTE, SET_MUSIC_CHANGED, SET_VOLUME_CHANGED, SET_VOLUME } from '../actions/types';

const initialState = {
  name: localStorage.getItem('degenlandMusicName'),
  mute: localStorage.getItem('degenlandMusicMute'),
  volume: localStorage.getItem('degenlandMusicVolume'),
  musicChanged: false,
  volumeChanged: false
};

export default (state = initialState, action) => {
  const { type, payload, musicName, muteState, volumeValue } = action;
  switch (type) {
    case SELECTED_MUSIC:
      return {
        ...state,
        name: musicName,
        mute: muteState,
        volume: volumeValue
      };
    case SET_MUTE:
      return {
        ...state,
        mute: payload
      };
    case SET_MUSIC_CHANGED:
      return {
        ...state,
        musicChanged: payload
      }
    case SET_VOLUME_CHANGED:
      return {
        ...state,
        volumeChanged: payload
      }
    case SET_VOLUME:
      return {
        ...state,
        volume: payload
      }
    default:
      return state;
  }
};