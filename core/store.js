import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

const dev = process.env.NODE_ENV !== 'production';

let store = null;

// Add Redux Dev Tools.
const composeDevTools =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const composeEnhancers = composeWithDevTools({ serialize: false });

// Init saga and create middlewares.
const sagaMiddleware = createSagaMiddleware();
const clientMiddleware = [sagaMiddleware];
const serverMiddleware = [sagaMiddleware];

// Add logger in dev mode.
if (dev) {
  const { createLogger } = require('redux-logger');
  clientMiddleware.push(createLogger());
  // serverMiddleware.push(createLogger({
  //   titleFormatter: ({ type }) => `\n\naction: ${type}\n`,
  //   colors: {
  //     title: false,
  //     prevState: false,
  //     action: false,
  //     nextState: false,
  //     error: false,
  //   },
  // }));
}

export const initStore = ({ reducer, initialState = {}, sagas }) => {
  // Create store for the server.
  if (typeof window === 'undefined') {
    return {
      ...createStore(reducer, initialState, compose(applyMiddleware(...serverMiddleware))),
      runSaga: sagaMiddleware.run
    };
  } else {
    // Create store for the client, only if it hasn't been created before.
    if (!store) {
      store = {
        ...createStore(
          reducer,
          initialState,
          composeEnhancers(applyMiddleware(...clientMiddleware))
        ),
        runSaga: sagaMiddleware.run
      };
      if (dev) window.store = store;
      if (sagas) Object.values(sagas).forEach(saga => store.runSaga(saga));
    }
    return store;
  }
};
