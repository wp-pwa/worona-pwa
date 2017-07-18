import request from 'superagent';
import { normalize, schema } from 'normalizr';
import { compose, createStore } from 'redux';
import { connect } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import Link from 'next/link';
import Head from 'next/head';
import { DOMProperty } from 'react-dom/lib/ReactInjection';
import { properties as DOMProperties } from 'react-dom/lib/DOMProperty';

// By default React limit the set of valid DOM elements and attributes
// (https://github.com/facebook/react/issues/140) this config whitelist
// Amp elements/attributes
if (typeof DOMProperties.amp === 'undefined') {
  DOMProperty.injectDOMPropertyConfig({
    Properties: {
      amp: DOMProperty.MUST_USE_ATTRIBUTE,
    },
    isCustomAttribute: attributeName => attributeName.startsWith('amp-'),
  });
}

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
    <Link prefetch href="/">
      <a>Home</a>
    </Link>
    <style jsx>{`
      p {
        color: blue;
      }
    `}</style>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <amp-img
      src="https://www.ampproject.org/examples/images/amp.jpg"
      width="900"
      height="508"
      layout="responsive"
    />
    <amp-youtube data-videoid="9Cfxm7cikMY" layout="responsive" width="480" height="270" />
    <script
      async
      is
      custom-element="amp-youtube"
      src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"
    />
    <script async src="https://cdn.ampproject.org/v0.js" />
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
  return { query };
};

export default compose(withRedux(makeStore), connect(state => ({ siteId: state.siteId })))(Post);
