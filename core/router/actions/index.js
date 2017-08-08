import * as types from '../types';

export const routeChangeRequested = ({ ulr }) => ({
  type: types.ROUTE_CHANGE_REQUESTED,
  url,
});
export const routeChangeSucceed = ({ ulr }) => ({
  type: types.ROUTE_CHANGE_SUCCEED,
  url,
});
export const routeChangeFailed = ({ ulr, error }) => ({
  type: types.ROUTE_CHANGE_FAILED,
  url,
  error,
});
