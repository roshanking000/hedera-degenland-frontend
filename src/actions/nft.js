import { SELECT_NFT, NFT_LIST_CHANGED, SET_WALLET_NFT_LIST } from './types';

export const selectNFT = name => dispatch => {
  dispatch({
    type: SELECT_NFT,
    payload: name
  });
};

export const nftListChange = flag => dispatch => {
  dispatch({
    type: NFT_LIST_CHANGED,
    payload: flag
  });
};

export const setWalletNftList = value => dispatch => {
  dispatch({
    type: SET_WALLET_NFT_LIST,
    payload: value
  });
};