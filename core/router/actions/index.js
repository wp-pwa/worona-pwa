import * as types from '../types';

export const routeChangeRequested = ({ asPath }) => ({
  type: types.ROUTE_CHANGE_REQUESTED,
  asPath,
});
export const routeChangeSucceed = ({ asPath, query, pathname }) => ({
  type: types.ROUTE_CHANGE_SUCCEED,
  asPath,
  query,
  pathname,
});
export const routeChangeFailed = ({ asPath, error }) => ({
  type: types.ROUTE_CHANGE_FAILED,
  asPath,
  error,
});
