import { SELECT_NFT, NFT_LIST_CHANGED, SET_WALLET_NFT_LIST } from '../actions/types';

const initialState = {
  name: '',
  nftListChanged: false,
  walletNftList: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SELECT_NFT:
      return {
        ...state,
        name: payload
      };
    case NFT_LIST_CHANGED:
      return {
        ...state,
        nftListChanged: payload
      };
    case SET_WALLET_NFT_LIST:
      return {
        ...state,
        walletNftList: payload
      }
    default:
      return state;
  }
};