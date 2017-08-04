import { Component } from 'react';
import { combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import dynamic from '@worona/next/dynamic';
import { normalize } from 'normalizr';
import request from 'superagent';
import { find } from 'lodash';
import { initStore } from '../core/store';
import reducers from '../core/reducers';
import sagasClient from '../core/sagas.client';
import { settingsSchema } from '../core/schemas';
import { settingsUpdated } from '../core/settings/actions';

const dev = process.env.NODE_ENV !== 'production';

const packages = [
  {
    namespace: 'generalSettings',
    name: 'general-app-extension-worona',
    DynamicComponent: dynamic(import('../packages/general-app-extension-worona')),
    importPackage: () => import('../packages/general-app-extension-worona'),
    importServerSagas: () => import('../packages/general-app-extension-worona/sagas/server'),
  },
  {
    namespace: 'theme',
    name: 'starter-app-theme-worona',
    DynamicComponent: dynamic(import('../packages/starter-app-theme-worona')),
    importPackage: () => import('../packages/starter-app-theme-worona'),
  },
  {
    namespace: 'connection',
    name: 'wp-org-connection-app-extension-worona',
    DynamicComponent: dynamic(import('../packages/wp-org-connection-app-extension-worona')),
    importPackage: () => import('../packages/wp-org-connection-app-extension-worona'),
  },
  {
    namespace: 'notUsed',
    name: 'not-used-app-extension-worona',
    DynamicComponent: dynamic(import('../packages/not-used-app-extension-worona')),
    importPackage: () => import('../packages/not-used-app-extension-worona'),
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

  static async getInitialProps(params) {
    // Server side rendering.
    if (params.req) {
      const sagas = (await import('../core/sagas.server')).default;
      // Retrieve site settings.
      const cdn = process.env.PROD ? 'cdn' : 'precdn';
      const { body } = await request(
        `https://${cdn}.worona.io/api/v1/settings/site/${params.query.siteId}/app/prod/live`
      );
      const { results, entities: { settings } } = normalize(body, settingsSchema);
      // Populate reducers.
      const activatedPackages = Object.keys(settings).filter(
        name => name !== 'site-general-settings-worona'
      );
      for (const name of activatedPackages) {
        const pkg = find(packages, { name });
        if (!pkg) throw new Error(`Worona Package ${name} not installed.`);
        const module = (await pkg.importPackage()).default;
        if (module.reducers) reducers[pkg.namespace] = module.reducers;
        if (pkg.importServerSagas) sagas[name] = (await pkg.importServerSagas()).default;
      }
      // Create server redux store to pass initialState on SSR.
      const store = initStore({ reducer: combineReducers(reducers) });
      // Add settings to the state.
      store.dispatch(settingsUpdated({ settings }));
      // Run and wait until all the server sagas have run.
      const startSagas = new Date();
      const sagaPromises = Object.values(sagas).map(saga => store.runSaga(saga, params).done);
      await Promise.all(sagaPromises);
      if (dev) console.log(`\nTime to run server sagas: ${new Date() - startSagas}ms\n`);
      // Return server props.
      return { initialState: store.getState(), activatedPackages };
    } else if (params.serverProps) {
      // Client first rendering.
      // Populate reducers on client (async) for client redux store.
      const startStore = new Date();
      const reducerPromises = params.serverProps.activatedPackages.map(async name => {
        const { namespace, importPackage } = find(packages, { name });
        const pkg = (await importPackage()).default;
        if (!pkg) throw new Error(`Worona Package ${name} not received.`);
        return pkg.reducers;
      });
      const packageReducers = await Promise.all(reducerPromises);
      packageReducers.forEach((value, index) => {
        reducers[packages[index].namespace] = value;
      });
      if (dev) console.log(`Time to create store: ${new Date() - startStore}ms`);
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
