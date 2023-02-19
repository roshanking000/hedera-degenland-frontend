import { SET_BUILDING_COUNTER, SHOW_COUNTER } from './types';

export const setBuildingCounter = time => dispatch => {
  dispatch({
    type: SET_BUILDING_COUNTER,
    payload: time
  });
};

export const showCounter = () => dispatch => {
  dispatch({
    type: SHOW_COUNTER
  });
};
