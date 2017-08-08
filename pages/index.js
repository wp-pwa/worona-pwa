import { Component } from 'react';
import { combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import dynamic from '@worona/next/dynamic';
import Link from '@worona/next/link';
import { normalize } from 'normalizr';
import request from 'superagent';
import { find } from 'lodash';
import promiseProps from 'promise-props';
import { initStore } from '../core/store';
import reducers from '../core/reducers';
import clientSagas from '../core/sagas.client';
import { settingsSchema } from '../core/schemas';
import { activatedPackagesUpdated } from '../core/packages/actions';
import { settingsUpdated } from '../core/settings/actions';

const dev = process.env.NODE_ENV !== 'production';

const packages = {
  'general-app-extension-worona': {
    namespace: 'generalSettings',
    DynamicComponent: dynamic(import('../packages/general-app-extension-worona/src/pwa')),
    importPackage: () => import('../packages/general-app-extension-worona/src/pwa'),
    requirePackage: () => eval('require("../packages/general-app-extension-worona/src/pwa")'),
    importServerSagas: () =>
      import('../packages/general-app-extension-worona/src/pwa/sagas/server'),
  },
  'starter-app-theme-worona': {
    namespace: 'theme',
    DynamicComponent: dynamic(import('../packages/starter-app-theme-worona/src/pwa')),
    importPackage: () => import('../packages/starter-app-theme-worona/src/pwa'),
    requirePackage: () => eval('require("../packages/starter-app-theme-worona/src/pwa")'),
    Home: dynamic(import('../packages/starter-app-theme-worona/src/pwa/components/Home')),
    Post: dynamic(import('../packages/starter-app-theme-worona/src/pwa/components/Post')),
  },
  'wp-org-connection-app-extension-worona': {
    namespace: 'connection',
    DynamicComponent: dynamic(import('../packages/wp-org-connection-app-extension-worona/src/pwa')),
    importPackage: () => import('../packages/wp-org-connection-app-extension-worona/src/pwa'),
    requirePackage: () =>
      eval('require("../packages/wp-org-connection-app-extension-worona/src/pwa")'),
  },
  'not-used-app-extension-worona': {
    namespace: 'notUsed',
    DynamicComponent: dynamic(import('../packages/not-used-app-extension-worona/src/pwa')),
    importPackage: () => import('../packages/not-used-app-extension-worona/src/pwa'),
    requirePackage: () => eval('require("../packages/not-used-app-extension-worona/src/pwa")'),
  },
};

const getModules = async (activatedPackages, functionName = 'importPackage') => {
  // Get (and start) all the promises.
  const importPromises = activatedPackages
    .map(name => {
      if (!packages[name]) throw new Error(`Worona Package ${name} failed (${functionName}).`);
      return packages[name][functionName]
        ? { name, importPackage: packages[name][functionName] }
        : false;
    })
    .filter(item => item)
    .reduce((obj, { name, importPackage }) => ({ ...obj, [name]: importPackage() }), {});
  // Wait until all the promises have been resolved.
  const packageDefaultModules = await promiseProps(importPromises);
  // Iterate internally to get rid of 'default'.
  const packageModules = Object.entries(packageDefaultModules).reduce(
    (obj, [name, module]) => ({ ...obj, [name]: module.default }),
    {}
  );
  return packageModules;
};

class Index extends Component {
  constructor(props) {
    super(props);
    // Init the store for the Provider using the initialState from getInitialProps.
    this.store = initStore({
      reducer: combineReducers(reducers),
      initialState: props.initialState,
      sagas: clientSagas,
    });
  }

  static async getInitialProps(params) {
    // Server side rendering.
    if (params.req) {
      // Get all the core server sagas.
      const serverSagas = (await import('../core/sagas.server')).default;
      // Retrieve and normalize site settings.
      const cdn = process.env.PROD ? 'cdn' : 'precdn';
      const { body } = await request(
        `https://${cdn}.worona.io/api/v1/settings/site/${params.query.siteId}/app/prod/live`
      );
      const { results, entities: { settings } } = normalize(body, settingsSchema);

      // Extract activated packages array from settings.
      const activatedPackages = Object.values(settings)
        .filter(pkg => pkg.woronaInfo.namespace !== 'generalSite')
        .reduce((obj, pkg) => ({ ...obj, [pkg.woronaInfo.namespace]: pkg.woronaInfo.name }), {});

      // Wait until all the modules have been loaded, then add the reducers to the system.
      const packageModules = await getModules(Object.values(activatedPackages), 'requirePackage');
      Object.entries(packageModules).map(([name, module]) => {
        if (module.reducers) reducers[packages[name].namespace] = module.reducers;
      });

      // Wait until all the server sagas have been loaded, then add the server sagas to the system.
      const packageServerSagas = await getModules(
        Object.values(activatedPackages),
        'importServerSagas'
      );
      Object.entries(packageServerSagas).map(([name, serverSaga]) => {
        if (serverSaga) serverSagas[name] = serverSaga;
      });

      // Create server redux store to pass initialState on SSR.
      const store = initStore({ reducer: combineReducers(reducers) });

      // Add settings to the state.
      store.dispatch(activatedPackagesUpdated({ packages: activatedPackages }));
      store.dispatch(settingsUpdated({ settings }));

      // Run and wait until all the server sagas have run.
      const startSagas = new Date();
      const sagaPromises = Object.values(serverSagas).map(saga => store.runSaga(saga, params).done);
      await Promise.all(sagaPromises);
      console.log(`\nTime to run server sagas: ${new Date() - startSagas}ms\n`);

      // Return server props.
      return { initialState: store.getState(), activatedPackages };

      // Client first rendering.
    } else if (params.serverProps) {
      // Populate reducers and sagas on client (async) for client redux store.
      const startStore = new Date();
      const packageModules = await getModules(Object.values(params.serverProps.activatedPackages));
      Object.entries(packageModules).map(([name, module]) => {
        if (module.reducers) reducers[packages[name].namespace] = module.reducers;
        if (module.sagas) clientSagas[packages[name].namespace] = module.sagas;
      });
      console.log(`Time to create store: ${new Date() - startStore}ms`);
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
          <Link href="?p=57">
            <a>Link</a>
          </Link>
          {/* Add all the dynamic components of the activated packages to make next SSR work. */}
          {Object.values(this.props.activatedPackages).map(name => {
            const DynamicComponent = packages[name].DynamicComponent;
            return <DynamicComponent key={name} />;
          })}
          {Object.values(this.props.activatedPackages)
            .filter(name => packages[name].namespace === 'theme')
            .map(name => {
              const DynamicComponent = packages[name].Home;
              return <DynamicComponent key={name} />;
            })}
        </div>
      </Provider>
    );
  }
}

export default Index;
