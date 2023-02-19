import axios from 'axios';

import * as env from "../env";
import setAuthToken from '../utils/setAuthToken';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
} from './types';

// Load user
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get(env.SERVER_URL + '/api/auth/load_user');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Login user
export const login = (accountId) => async dispatch => {
  try {
    const res = await axios.post(env.SERVER_URL + '/api/auth/login', { accountId: accountId });
    console.log(res);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
