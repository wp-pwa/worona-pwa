import { combineReducers } from 'redux';
import * as types from '../types';

export const url = (state = {}, { type, url }) => {
  if (type === types.ROUTE_CHANGE_SUCCEED) return url;
  return state;
};

export default combineReducers({
  url,
});
