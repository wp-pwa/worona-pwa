import request from 'superagent';
import { normalize, schema } from 'normalizr';
import { compose, createStore } from 'redux';
import { connect } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import Link from '@worona/next/link';
import Head from '@worona/next/head';
import Router from '@worona/next/router';

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
  <div>
    <Head>
      <title>Hola</title>
    </Head>
    <p>
      i am a post with id {query.p} and siteId {siteId}.
    </p>
    <div onClick={() => Router.push('/post?p=7', '/post?p=7', { shallow: true })}>
      <a>Change url</a>
    </div>
    <Link href="/category"><a>Cat</a></Link>
  </div>;

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
  console.log('client getInitialProps');
  return { query };
};

export default compose(withRedux(makeStore), connect(state => ({ siteId: state.siteId })))(Post);
