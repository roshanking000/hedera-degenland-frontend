import { SHOW_FRIENDINFO_DIALOG, GET_INVITE_STATE, HIDE_FRIENDINFO_DIALOG, SET_FRIEND } from '../actions/types';

const initialState = {
  data: null,
  isinvited: false,
  showdlg: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SHOW_FRIENDINFO_DIALOG:
      return {
        ...state,
        data: payload,
        showdlg: true
      }
    case HIDE_FRIENDINFO_DIALOG:
      return {
        ...state,
        showdlg: false
      }
    case GET_INVITE_STATE:
      return {
        ...state,
        isinvited: payload
      }
    case SET_FRIEND:
      return {
        ...state,
        data: payload
      }
    default:
      return state;
  }
};