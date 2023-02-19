import { combineReducers } from 'redux';
import scene from './scene';
import nft from './nft';
import placeinfo from './placeinfo';
import chat from './chat';
import construction from './construction';
import playerinfo from './playerinfo';
import friendinfo from './friendinfo';
import buildingcounter from './buildingcounter';
import notification from './notification';
import friends from './friends';
import music from './music';
import auth from './auth';
import buildinginfo from './buildinginfo';

export default combineReducers({
  auth,
  scene,
  nft,
  placeinfo,
  chat,
  construction,
  playerinfo,
  friendinfo,
  buildingcounter,
  notification,
  friends,
  music,
  buildinginfo
});
