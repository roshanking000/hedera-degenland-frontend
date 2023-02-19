import { SET_CHATCONTENT, SET_EMOJI, ADD_CHAT_HISTORY } from '../actions/types';

const initialState = {
  content: '',
  emoji: '',
  chatInfo: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_CHATCONTENT:
      return {
        ...state,
        content: payload
      };
    case SET_EMOJI:
      return {
        ...state,
        emoji: payload
      };
    case ADD_CHAT_HISTORY:
      return {
        ...state,
        chatInfo: payload
      }
    default:
      return state;
  }
};