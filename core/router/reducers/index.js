import { combineReducers } from 'redux';
import * as types from '../types';

export const asPath = (state = {}, action) => {
  if (action.type === types.ROUTE_CHANGE_SUCCEED) return action.asPath;
  return state;
};

export const query = (state = {}, action) => {
  if (action.type === types.ROUTE_CHANGE_SUCCEED) return action.query;
  return state;
};

export const pathname = (state = {}, action) => {
  if (action.type === types.ROUTE_CHANGE_SUCCEED) return action.pathname;
  return state;
};

export default combineReducers({
  asPath,
  query,
  pathname,
});
