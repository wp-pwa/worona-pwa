import { delay } from 'redux-saga';
import { call } from 'redux-saga/effects';

export function* prefetch({ dynamicImport, ms }) {
  if (ms) yield delay(ms);
  yield call(module);
}
