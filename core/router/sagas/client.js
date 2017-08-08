import Router from '@worona/next/router';
import { fork, take, put, race, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as actions from '../actions';

const routeChangeRequested = () =>
  eventChannel(emitter => {
    Router.routeChangeStart = url => emitter({ url });
    return () => (Router.routeChangeStart = null);
  });
const routeChangeSucceed = () =>
  eventChannel(emitter => {
    Router.routeChangeComplete = url => emitter({ url });
    return () => (Router.routeChangeComplete = null);
  });
const routeChangeFailed = () =>
  eventChannel(emitter => {
    Router.routeChangeError = (url, error) => emitter({ url, error });
    return () => (Router.routeChangeError = null);
  });

function* routeChangeSaga() {
  const requestedEvents = routeChangeRequested();
  const succeedEvents = routeChangeSucceed();
  const failedEvents = routeChangeFailed();
  while (true) {
    const { start, complete, failed } = yield race({
      requested: take(requestedEvents),
      succeed: take(succeedEvents),
      failed: take(failedEvents),
    });
    if (requested) yield put(actions.routeChangeRequested(requested));
    else if (succeed) yield put(actions.routeChangeSucceed(succeed));
    else if (failed) yield put(actions.routeChangeFailed(failed));
  }
}

export default function* routerClientSagas() {
  yield all([fork(routeChangeSaga)]);
}
