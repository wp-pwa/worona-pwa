import { schema } from 'normalizr'; 

export const settingSchema = new schema.Entity(
  'settings',
  {},
  { idAttribute: setting => setting.woronaInfo.name }
);
export const settingsSchema = [settingSchema];
