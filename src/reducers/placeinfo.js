import { UPDATE_PLACEINFO, GET_PLACEINFO, SET_PLACEINFO, SET_CUSTOMER, HANDLE_PLACEDETAIL_DIALOG, SET_TELEPORT_DATA, CLEAR_TELEPORT_DATA } from '../actions/types';

const initialState = {
  data: null,
  customer: 0,
  show: false,
  teleportData: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_PLACEINFO:
      return {
        ...state,
        data: payload
      };
    case GET_PLACEINFO:
      return {
        ...state,
        data: payload
      };
    case SET_TELEPORT_DATA:
      return {
        ...state,
        teleportData: payload
      };
    case CLEAR_TELEPORT_DATA:
      return {
        ...state,
        teleportData: null
      };
    case SET_PLACEINFO:
      return {
        ...state,
        data: payload
      };
    case SET_CUSTOMER:
      return {
        ...state,
        customer: payload
      };
    case HANDLE_PLACEDETAIL_DIALOG:
      return {
        ...state,
        show: payload
      };
    default:
      return state;
  }
};