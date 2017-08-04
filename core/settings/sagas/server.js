import { call } from 'redux-saga/effects';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default function* serverSagas() {
  yield call(delay, 1000);
}
