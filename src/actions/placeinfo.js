import axios from 'axios';
import * as env from "../env";

import { UPDATE_PLACEINFO, GET_PLACEINFO, SET_PLACEINFO, SET_CUSTOMER, HANDLE_PLACEDETAIL_DIALOG, SET_TELEPORT_DATA, CLEAR_TELEPORT_DATA } from './types';

export const getPlaceInfo = (nftdata) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/place/get_place_info?nftdata=" + JSON.stringify(nftdata));
  dispatch({
    type: GET_PLACEINFO,
    payload: res.data.data
  });
};

export const setTeleportData = (nftdata) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/place/get_place_info?nftdata=" + JSON.stringify(nftdata));
  dispatch({
    type: SET_TELEPORT_DATA,
    payload: res.data.data
  });
};

export const clearTeleportData = () => async dispatch => {
  dispatch({
    type: CLEAR_TELEPORT_DATA
  });
};

export const updatePlaceInfo = (address, targetPos) => async dispatch => {
  const res = await axios.get(env.SERVER_URL + "/api/place/update_place_info?address=" + address + "&targetPos=" + targetPos);
  dispatch({
    type: UPDATE_PLACEINFO,
    payload: res.data.data
  });
};

export const setPlaceInfo = data => dispatch => {
  dispatch({
    type: SET_PLACEINFO,
    payload: data
  });
};

export const setCustomer = value => dispatch => {
  dispatch({
    type: SET_CUSTOMER,
    payload: value
  });
};

export const handlePlaceDetailDialog = flag => dispatch => {
  dispatch({
    type: HANDLE_PLACEDETAIL_DIALOG,
    payload: flag
  });
};
