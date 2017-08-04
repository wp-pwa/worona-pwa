import { combineReducers } from 'redux';
import { SETTINGS_UPDATED } from '../types';

export const collection = (state = {}, action) => {
  if (action.type === SETTINGS_UPDATED)
    return { ...state, ...action.settings };
  return state;
};

export default combineReducers({
  collection,
});
