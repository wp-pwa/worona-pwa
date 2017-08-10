import React from 'react';
import { setStatic, compose } from 'recompose';
import * as actions from './actions';
import * as types from './types';
import reducers from './reducers';
import sagas from './sagas/client';
import * as selectors from './selectors';
import * as components from './components';

const Router = () => null;

export default compose(
  setStatic('actions', actions),
  setStatic('types', types),
  setStatic('reducers', reducers),
  setStatic('sagas', sagas),
  setStatic('selectors', selectors),
  setStatic('components', components),
)(Router);
