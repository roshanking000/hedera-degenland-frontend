import { SET_SCENENAME, SET_BUILDINGIMAGES, SET_LOADING } from './types';

export const setSceneName = name => dispatch => {
  dispatch({
    type: SET_SCENENAME,
    payload: name
  });
};

export const setBuildingImages = data => dispatch => {
  dispatch({
    type: SET_BUILDINGIMAGES,
    payload: data
  });
};

export const setLoading = flag => dispatch => {
  dispatch({
    type: SET_LOADING,
    payload: flag
  });
};
