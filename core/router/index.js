import { setStatic, compose } from 'recompose';
import * as actions from './actions';
import * as types from './types';
import reducers from './reducers';
import sagas from './sagas/client';
import * as sagaHelpers from './sagaHelpers';
import * as selectors from './selectors';

const Router = () => null;

export default compose(
  setStatic('actions', actions),
  setStatic('types', types),
  setStatic('reducers', reducers),
  setStatic('sagas', sagas),
  setStatic('sagaHelpers', sagaHelpers),
  setStatic('selectors', selectors),
)(Router);
