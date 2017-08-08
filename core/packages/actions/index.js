import * as types from '../types';

export const activatedPackagesUpdated = ({ packages }) => ({
  type: types.ACTIVATED_PACKAGES_UPDATED,
  packages,
});
