import { SET_SCENENAME, SET_BUILDINGIMAGES, SET_LOADING } from '../actions/types';

const initialState = {
  scenename: '',
  buildingimages: null,
  loading: false,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_SCENENAME:
      return {
        ...state,
        scenename: payload
      };
    case SET_BUILDINGIMAGES:
      return {
        ...state,
        buildingimages: payload
      };
    case SET_LOADING:
      return {
        ...state,
        loading: payload
      };
    default:
      return state;
  }
};