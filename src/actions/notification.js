import axios from 'axios';
import * as env from "../env";

import { LOAD_NOTIFICATION } from './types';

export const loadNotification = accountId => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/notification/get_notification?accountId=" + accountId);
  dispatch({
    type: LOAD_NOTIFICATION,
    payload: res.data.data
  });
};
