import axios from 'axios';
import * as env from "../env";

import { LOAD_BUILDING_INFO, SET_ENTERED, CLEAR_DATA, SET_GO_OUT, SET_TICKET, SET_ADS, CLEAR_ADS } from './types';

export const setAds = (id, name, billboardInfo, mimetype) => async dispatch => {
  dispatch({
    type: SET_ADS,
    payload: {
      id: id,
      name: name,
      billboardInfo: billboardInfo,
      mimetype: mimetype
    }
  });
};

export const clearAds = () => async dispatch => {
  dispatch({
    type: CLEAR_ADS
  });
};

export const getTicket = (_address, _pos) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + '/api/placement/get_ticket?address=' + _address + '&pos=' + _pos);
  let data;
  if (!res.data.data)
    data = null;
  else
    data = res.data.data;
  dispatch({
    type: SET_TICKET,
    payload: data
  });
};

export const loadBuildingInfo = (_address, _pos, _index, _sno) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/placement/get_id?address=" + _address + "&pos=" + _pos + "&index=" + _index + "&sno=" + _sno);
  dispatch({
    type: LOAD_BUILDING_INFO,
    buildingId: res.data.buildingId,
    buildingInfo: res.data.buildingInfo,
    ownerInfo: res.data.ownerInfo
  });
};

export const setEntered = (flag) => async dispatch => {
  dispatch({
    type: SET_ENTERED,
    payload: flag
  });
};

export const clearData = () => async dispatch => {
  dispatch({
    type: CLEAR_DATA
  });
};

export const setGoOut = (flag) => async dispatch => {
  dispatch({
    type: SET_GO_OUT,
    payload: flag
  });
};