import * as types from '../types';

export const siteIdUpdated = ({ siteId }) => ({ type: types.SITE_ID_UPDATED, siteId });
export const settingsUpdated = ({ settings }) => ({ type: types.SETTINGS_UPDATED, settings });
