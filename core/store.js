import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

let store = null;

const composeDevTools =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const composeEnhancers = composeWithDevTools({
  serialize: false,
});

const sagaMiddleware = createSagaMiddleware();

const clientMiddleware = [sagaMiddleware, logger];
const serverMiddleware = [sagaMiddleware];

export const initStore = ({ reducer, initialState = {} }) => {
  if (typeof window === 'undefined') {
    return createStore(reducer, initialState, compose(applyMiddleware(...serverMiddleware)));
  } else {
    if (!store) {
      store = createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(...clientMiddleware))
      );
    }
    return store;
  }
};

export const runSaga = sagaMiddleware.run.bind(sagaMiddleware);
