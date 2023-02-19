import { SET_CHATCONTENT, SET_EMOJI, ADD_CHAT_HISTORY } from './types';

export const setChatContent = content => dispatch => {
  dispatch({
    type: SET_CHATCONTENT,
    payload: content
  });
};

export const setEmoji = emoji => dispatch => {
  dispatch({
    type: SET_EMOJI,
    payload: emoji
  });
};

export const addChatHistory = content => dispatch => {
  dispatch({
    type: ADD_CHAT_HISTORY,
    payload: content
  });
};
