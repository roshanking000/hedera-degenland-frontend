import axios from 'axios';
import * as env from "../env";

import { LOAD_FRIENDLIST, MOVE_TO_FRIEND } from './types';

export const loadFriendList = (accountId, searchStr='', sortType='none') => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/account/get_friendlist?accountId=" + accountId + "&searchStr=" + searchStr + "&sortType=" + sortType);
  dispatch({
    type: LOAD_FRIENDLIST,
    payload: res.data.data
  });
};

export const moveToFriend = (friendInfo) => async dispatch => {
  dispatch({
    type: MOVE_TO_FRIEND,
    payload: friendInfo
  });
};