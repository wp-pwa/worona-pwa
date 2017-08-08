import { combineReducers } from 'redux';
import * as types from '../types';

export const collection = (state = {}, action) => {
  if (action.type === types.SETTINGS_UPDATED)
    return { ...state, ...action.settings };
  return state;
};

export default combineReducers({
  collection,
});
