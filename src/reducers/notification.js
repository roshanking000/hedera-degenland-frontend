import { LOAD_NOTIFICATION } from '../actions/types';

const initialState = {
  data: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_NOTIFICATION:
      return {
        ...state,
        data: payload
      };
    default:
      return state;
  }
};