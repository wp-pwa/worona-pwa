import { combineReducers } from 'redux';

export const items = (state = { someSetting: 123 }, action) => {
  return state;
};

export default combineReducers({
  items,
});
