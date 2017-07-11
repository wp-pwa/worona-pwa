import request from 'superagent';
import { normalize, schema } from 'normalizr';
import { compose, createStore } from 'redux';
import { connect } from 'react-redux';
import withRedux from 'next-redux-wrapper';

const settingSchema = new schema.Entity(
  'settings',
  {},
  { idAttribute: setting => setting.woronaInfo.name }
);
const settingsSchema = [settingSchema];

const reducer = (state = { settings: {}, siteId: false }, action) => {
  switch (action.type) {
    case 'SETTINGS_ADDED':
      return { ...state, settings: action.settings };
    case 'SITE_ID_ADDED':
      return { ...state, siteId: action.siteId };
    default:
      return state;
  }
};

const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const makeStore = initialState => {
  return createStore(reducer, initialState, composeEnhancers());
};

const Post = ({ query, siteId }) =>
  <div>i am a post with id {query.p} and siteId {siteId}</div>;

Post.getInitialProps = async ({ store, query, isServer }) => {
  if (isServer) {
    const cdn = 'precdn';
    const siteId = query.siteId;
    const env = 'prod';
    const preview = 'live';
    const { body } = await request(
      `https://${cdn}.worona.io/api/v1/settings/site/${siteId}/app/${env}/${preview}`
    );
    const { results, entities: { settings } } = normalize(body, settingsSchema);
    store.dispatch({ type: 'SITE_ID_ADDED', siteId });
    store.dispatch({ type: 'SETTINGS_ADDED', settings });
    return { query };
  }
  return { query };
};

export default compose(withRedux(makeStore), connect(state => ({ siteId: state.siteId })))(
  Post
);
