import { schema } from 'normalizr';

export const settingSchema = new schema.Entity(
  'settings',
  {},
  { idAttribute: setting => setting.woronaInfo.namespace }
);
export const settingsSchema = [settingSchema];
