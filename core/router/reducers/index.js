import { combineReducers } from 'redux';
import * as types from '../types';

export const asPath = (state = {}, { type, asPath }) => {
  if (type === types.ROUTE_CHANGE_SUCCEED) return asPath;
  return state;
};

export const query = (state = {}, { type, query }) => {
  if (type === types.ROUTE_CHANGE_SUCCEED) return query;
  return state;
};

export const pathname = (state = {}, { type, pathname }) => {
  if (type === types.ROUTE_CHANGE_SUCCEED) return pathname;
  return state;
};

export default combineReducers({
  asPath,
  query,
  pathname,
});
