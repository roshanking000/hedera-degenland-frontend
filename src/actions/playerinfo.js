import axios from 'axios';
import * as env from "../env";

import { CALCULATE_LEVEL, SET_PLAYERINFO, UPDATE_PLAYERINFO, SET_PAL_BALANCE, SET_DANCING, SET_BUILDING_STATE, SET_VISIT_PLACE } from './types';

export const setVisitPlace = (name) => async dispatch => {
  dispatch({
    type: SET_VISIT_PLACE,
    payload: name
  });
};

export const setBuildingState = (address, pos, accountId) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/buybuilding/get_state?address=" + address + "&pos=" + pos + "&accountId=" + accountId);
  dispatch({
    type: SET_BUILDING_STATE,
    payload: res.data.data
  });
};

export const calculateLevel = (accountId) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/account/calculate_level?accountId=" + accountId);
  dispatch({
    type: CALCULATE_LEVEL,
    payload: res.data.data
  });
};

export const updatePlayerInfo = (accountId) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/account/update_player_info?accountId=" + accountId);
  dispatch({
    type: UPDATE_PLAYERINFO,
    payload: res.data.data
  });
};

export const setPlayerInfo = data => dispatch => {
  dispatch({
    type: SET_PLAYERINFO,
    payload: data
  });
};

export const setPalBalance = balance => dispatch => {
  dispatch({
    type: SET_PAL_BALANCE,
    payload: balance
  });
};

export const setDancing = flag => dispatch => {
  dispatch({
    type: SET_DANCING,
    payload: flag
  });
};
