import { Component } from 'react';
import { combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import dynamic from '@worona/next/dynamic';
import { normalize } from 'normalizr';
import request from 'superagent';
import { find } from 'lodash';
import { initStore } from '../core/store';
import reducers from '../core/reducers';
import { settingsSchema } from '../core/schemas';
import { settingsUpdated } from '../core/settings/actions';

const packages = [
  {
    namespace: 'generalSettings',
    name: 'general-app-extension-worona',
    DynamicComponent: dynamic(import('../packages/general-app-extension-worona')),
    importFunction: () => import('../packages/general-app-extension-worona'),
    requireFunction: () => eval('require("../packages/general-app-extension-worona")'),
  },
  {
    namespace: 'theme',
    name: 'starter-app-theme-worona',
    DynamicComponent: dynamic(import('../packages/starter-app-theme-worona')),
    importFunction: () => import('../packages/starter-app-theme-worona'),
    requireFunction: () => eval('require("../packages/starter-app-theme-worona")'),
  },
  {
    namespace: 'connection',
    name: 'wp-org-connection-app-extension-worona',
    DynamicComponent: dynamic(import('../packages/wp-org-connection-app-extension-worona')),
    importFunction: () => import('../packages/wp-org-connection-app-extension-worona'),
    requireFunction: () => eval('require("../packages/wp-org-connection-app-extension-worona")'),
  },
  {
    namespace: 'notUsed',
    name: 'not-used-app-extension-worona',
    DynamicComponent: dynamic(import('../packages/not-used-app-extension-worona')),
    importFunction: () => import('../packages/not-used-app-extension-worona'),
    requireFunction: () => eval('require("../packages/not-used-app-extension-worona")'),
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
      const activatedPackages = Object.keys(settings).filter(
        name => name !== 'site-general-settings-worona'
      );
      activatedPackages.forEach(name => {
        const pkg = find(packages, { name });
        if (!pkg) throw new Error(`Worona Package ${name} not installed.`);
        reducers[pkg.namespace] = pkg.requireFunction().default.reducers;
      });
      const store = initStore({ reducer: combineReducers(reducers) });
      store.dispatch(settingsUpdated({ settings }));
      return { initialState: store.getState(), activatedPackages };
      // Client first rendering.
    } else if (serverProps) {
      // Populate reducers on client (async) for client redux store.
      const start = new Date();
      const reducerPromises = serverProps.activatedPackages.map(async name => {
        const { namespace, importFunction } = find(packages, { name });
        const pkg = (await importFunction()).default;
        if (!pkg) throw new Error(`Worona Package ${name} not received.`);
        return pkg.reducers;
      });
      const packageReducers = await Promise.all(reducerPromises);
      packageReducers.forEach((value, index) => {
        reducers[packages[index].namespace] = value;
      });
      const end = new Date();
      console.log(`Time to create store: ${end - start}ms`);
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
          {this.props.activatedPackages.map(name => {
            const { namespace, DynamicComponent } = find(packages, { name });
            return <DynamicComponent key={namespace} />;
          })}
        </div>
      </Provider>
    );
  }
}

export default Index;
