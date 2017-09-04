import { combineReducers } from 'redux';
import * as types from '../types';

export const siteId = (state = '', action) => {
  if (action.type === types.SITE_ID_UPDATED)
    return action.siteId;
  return state;
}

export const collection = (state = {}, { type, settings }) => {
  if (type === types.SETTINGS_UPDATED)
    return { ...state, ...settings };
  return state;
};

export default combineReducers({
  collection,
  siteId,
});
