import { LOAD_BUILDING_INFO, SET_ENTERED, CLEAR_DATA, SET_GO_OUT, SET_TICKET, SET_ADS, CLEAR_ADS } from '../actions/types';

const initialState = {
  buildingId: null,
  buildingInfo: null,
  ownerInfo: null,
  ticket: null,
  entered: false,
  goout: false,
  ads: null
};

export default (state = initialState, action) => {
  const { type, payload, buildingId, buildingInfo, ownerInfo } = action;
  switch (type) {
    case SET_ADS:
      return {
        ...state,
        ads: payload
      }
    case CLEAR_ADS:
      return {
        ...state,
        ads: null
      }
    case SET_TICKET:
      return {
        ...state,
        ticket: payload
      }
    case LOAD_BUILDING_INFO:
      return {
        ...state,
        buildingId: buildingId,
        buildingInfo: buildingInfo,
        ownerInfo: ownerInfo
      }
    case SET_ENTERED:
      return {
        ...state,
        entered: payload
      }
    case CLEAR_DATA:
      return {
        ...state,
        buildingId: null
      }
    case SET_GO_OUT:
      return {
        ...state,
        goout: payload
      }
    default:
      return state;
  }
};