import * as types from '../types';

export const activatedPackagesUpdated = ({ packages }) => ({
  type: types.ACTIVATED_PACKAGES_UPDATED,
  packages,
});

export const initServerSagas = () => ({
  type: types.INIT_SERVER_SAGAS,
});

export const initClientSagas = () => ({
  type: types.INIT_CLIENT_SAGAS,
});
