import Router from '@worona/next/router';
import { fork, take, put, race, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as actions from '../actions';
import worona from '../../worona';

const dev = process.env.NODE_ENV !== 'production';

const routeChangeRequested = () =>
  eventChannel(emitter => {
    Router.onRouteChangeStart = asPath => emitter({ asPath });
    return () => (Router.onRouteChangeStart = null);
  });
const routeChangeSucceed = () =>
  eventChannel(emitter => {
    Router.onRouteChangeComplete = asPath => emitter({ asPath });
    return () => (Router.onRouteChangeComplete = null);
  });
const routeChangeFailed = () =>
  eventChannel(emitter => {
    Router.onRouteChangeError = (asPath, error) => emitter({ asPath, error });
    return () => (Router.onRouteChangeError = null);
  });

const getPath = () =>
  Object.entries(Router.query)
    .map(([key, value]) => `${key}=${value}`)
    .reduce(
      (acc, q, i) => `${acc}${i !== 0 ? '&' : ''}${q}`,
      `${window.location.origin}${Router.pathname}?`
    );

function* routeChangeSaga() {
  // Add router to worona for development.
  if (dev) {
    worona.router = Router;
    worona.router.getPath = getPath;
  }

  // Initializate router event channels.
  const requestedEvents = routeChangeRequested();
  const succeedEvents = routeChangeSucceed();
  const failedEvents = routeChangeFailed();

  // Track router events and dispatch them to redux.
  while (true) {
    const { requested, succeed, failed } = yield race({
      requested: take(requestedEvents),
      succeed: take(succeedEvents),
      failed: take(failedEvents),
    });
    if (requested) yield put(actions.routeChangeRequested(requested));
    else if (succeed) {
      const { query, pathname } = Router;
      yield put(actions.routeChangeSucceed({ query, pathname, asPath: succeed.asPath }));
    } else if (failed) yield put(actions.routeChangeFailed(failed));
  }
}

export default function* routerClientSagas() {
  yield all([fork(routeChangeSaga)]);
}
