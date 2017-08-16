import * as types from '../types';

export const activatedPackagesUpdated = ({ packages }) => ({
  type: types.ACTIVATED_PACKAGES_UPDATED,
  packages,
});

export const serverStarted = () => ({
  type: types.SERVER_STARTED,
});

export const serverFinished = ({ timeToRunSagas }) => ({
  type: types.SERVER_FINISHED,
  timeToRunSagas,
});

export const serverSagasInitialized = () => ({
  type: types.SERVER_SAGAS_INITIALIZED,
});

export const clientStarted = () => ({
  type: types.CLIENT_STARTED,
});

export const clientSagasInitialized = () => ({
  type: types.CLIENT_SAGAS_INITIALIZED,
});

export const clientReactRendered = () => ({
  type: types.CLIENT_REACT_RENDERED,
});
