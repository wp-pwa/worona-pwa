import React from 'react';
import { setStatic, compose } from 'recompose';
import * as actions from './actions';
import * as types from './types';
import reducers from './reducers';
import sagas from './sagas/client';
import * as sagaHelpers from './sagaHelpers';
import * as selectors from './selectors';
import * as components from './components';
import * as libs from './libs';

const Router = () => null;

export default compose(
  setStatic('actions', actions),
  setStatic('types', types),
  setStatic('reducers', reducers),
  setStatic('sagas', sagas),
  setStatic('sagaHelpers', sagaHelpers),
  setStatic('selectors', selectors),
  setStatic('components', components),
  setStatic('libs', libs),
)(Router);
