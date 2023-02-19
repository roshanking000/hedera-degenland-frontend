import { CALCULATE_LEVEL, SET_PLAYERINFO, UPDATE_PLAYERINFO, SET_PAL_BALANCE, SET_DANCING, SET_BUILDING_STATE, SET_VISIT_PLACE } from '../actions/types';

const initialState = {
  data: null,
  buildingState: null,
  palBalance: 0,
  isdancing: false,
  visitPlace: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_VISIT_PLACE:
      return {
        ...state,
        visitPlace: payload
      };
    case CALCULATE_LEVEL:
      return {
        ...state,
        data: payload
      };
    case UPDATE_PLAYERINFO:
      return {
        ...state,
        data: payload
      };
    case SET_PLAYERINFO:
      return {
        ...state,
        data: payload
      };
    case SET_BUILDING_STATE:
      return {
        ...state,
        buildingState: payload
      };
    case SET_PAL_BALANCE:
      return {
        ...state,
        palBalance: payload
      }
    case SET_DANCING:
      return {
        ...state,
        isdancing: payload
      }
    default:
      return state;
  }
};