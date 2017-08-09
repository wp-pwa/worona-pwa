import { createSelector } from 'reselect';

export const getExtensions = state => state.build.extensions;
export const getTheme = state => state.build.theme;

export const getPackages = createSelector(getExtensions, getTheme, (extensions, theme) => [
  ...Object.values(extensions),
  theme,
]);
