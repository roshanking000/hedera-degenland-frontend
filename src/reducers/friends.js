import { LOAD_FRIENDLIST, MOVE_TO_FRIEND } from '../actions/types';

const initialState = {
  friendlist: null,
  moveToFriend: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_FRIENDLIST:
      return {
        ...state,
        friendlist: payload
      }
    case MOVE_TO_FRIEND:
      return {
        ...state,
        moveToFriend: payload
      }
    default:
      return state;
  }
};