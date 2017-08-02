import { Component } from 'react';
import { combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import dynamic from '@worona/next/dynamic';
import { normalize } from 'normalizr';
import request from 'superagent';
import { initStore } from '../core/store';
import reducers from '../core/reducers';
import { settingsSchema } from '../core/schemas';

const packages = [
  {
    namespace: 'generalSettings',
    DynamicComponent: dynamic(import('../packages/general-settings-app-extension-worona')),
    importFunction: () => import('../packages/general-settings-app-extension-worona'),
    requireFunction: () => eval('require("../packages/general-settings-app-extension-worona")'),
  },
];

class Index extends Component {
  constructor(props) {
    super(props);
    // Init the store for the Provider using the initialState from getInitialProps.
    this.store = initStore({
      reducer: combineReducers(reducers),
      initialState: props.initialState,
    });
  }

  static async getInitialProps({ req, serverProps, query }) {
    // Server side rendering.
    if (req) {
      // Retrieve site settings.
      const cdn = process.env.PROD ? 'cdn' : 'precdn';
      const { body } = await request(
        `https://${cdn}.worona.io/api/v1/settings/site/${query.siteId}/app/prod/live`
      );
      const { results, entities: { settings } } = normalize(body, settingsSchema);
      // Populate reducers and create server redux store to pass initialState on SSR.
      packages.forEach(
        ({ namespace, requireFunction }) =>
          (reducers[namespace] = requireFunction().default.reducers)
      );
      const store = initStore({ reducer: combineReducers(reducers) });
      return { initialState: store.getState(), settings };
      // Client first rendering.
    } else if (serverProps) {
      // Populate reducers on client (async) for client redux store.
      const start = new Date();
      const reducerPromises = packages.map(
        async ({ namespace, importFunction }) => (await importFunction()).default.reducers
      );
      const packageReducers = await Promise.all(reducerPromises);
      packageReducers.forEach((value, index) => {
        reducers[packages[index].namespace] = value;
      });
      const end = new Date();
      console.log(end - start);
    }
    // Client, rest of the renders.
    return {};
  }

  static runInitialPropsAgain({ serverProps }) {
    return true;
  }

  render() {
    return (
      <Provider store={this.store}>
        <div>
          hola
          {packages.map(({ namespace, DynamicComponent }) => <DynamicComponent key={namespace} />)}
        </div>
      </Provider>
    );
  }
}

export default Index;
