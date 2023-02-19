import axios from 'axios';
import * as env from "../env";

import { SHOW_FRIENDINFO_DIALOG, GET_INVITE_STATE, HIDE_FRIENDINFO_DIALOG, SET_FRIEND } from './types';

export const showFriendInfoDlg = (accountId) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/account/get_player?accountId=" + accountId);
  dispatch({
    type: SHOW_FRIENDINFO_DIALOG,
    payload: res.data.data
  });
};

export const getInviteState = (myAccountId, otherAccountId) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/notification/get_invite_state?myAccountId=" + myAccountId + "&otherAccountId=" + otherAccountId);
  dispatch({
    type: GET_INVITE_STATE,
    payload: res.data.result
  });
};

export const hideFriendInfoDlg = () => dispatch => {
  dispatch({
    type: HIDE_FRIENDINFO_DIALOG
  });
};

export const setFriend = (accountId1, accountId2) => async dispatch => {
  const res = await axios.post(env.SERVER_URL + "/api/account/set_friend", {id1: accountId1, id2: accountId2});
  dispatch({
    type: SET_FRIEND,
    payload: res.data.data
  });
};
