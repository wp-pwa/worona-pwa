import { combineReducers } from 'redux';
import { omit, find } from 'lodash';
import * as types from '../types';

export const extensions = (state = [], action) => {
  if (action.type === types.ACTIVATED_PACKAGES_UPDATED)
    return omit(action.packages, ['theme']);
  return state;
};

export const theme = (state = '', action) => {
  if (action.type === types.ACTIVATED_PACKAGES_UPDATED)
    return find(action.packages, (name, namespace) => namespace === 'theme');
  return state;
};

const ssr = (state = true, action) => {
  if (action.type === types.CLIENT_REACT_RENDERED) return false;
  return state;
}

export default combineReducers({
  extensions,
  theme,
  ssr,
});
