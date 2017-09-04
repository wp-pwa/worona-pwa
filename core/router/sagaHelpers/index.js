import { delay } from 'redux-saga';
import { call, select } from 'redux-saga/effects';
import { dep } from 'worona-deps';

export function* prefetch({ dynamicImport, ms }) {
  if (ms) yield delay(ms);
  yield call(dynamicImport);
}

export function* isCors() {
  // If this is the server, isCors is not needed.
  if (typeof window === 'undefined') return false;
  const getSetting = dep('settings', 'selectorCreators', 'getSetting');
  const url = yield select(getSetting('generalSite', 'url'));
  // Only in case of a https connection and a http WordPres, cors is needed.
  return url.startsWith('http://') && window.location.host === 'https';
}
