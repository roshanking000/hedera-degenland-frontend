import { SET_BUILDING_COUNTER, SHOW_COUNTER } from '../actions/types';

const initialState = {
  remaintime: 0,
  show: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_BUILDING_COUNTER:
      return {
        ...state,
        remaintime: payload
      };
    case SHOW_COUNTER:
      return {
        ...state,
        show: true
      }
    default:
      return state;
  }
};