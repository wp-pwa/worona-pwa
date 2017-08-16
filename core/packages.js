import React from 'react';
import { connect } from 'react-redux';
import dynamic from '@worona/next/dynamic';
import { getPackages } from './build/selectors';

export const packages = {
  'general-app-extension-worona': {
    namespace: 'generalSettings',
    DynamicComponent: dynamic(import('../packages/general-app-extension-worona/src/pwa')),
    importPackage: () => import('../packages/general-app-extension-worona/src/pwa'),
    requirePackage: () => eval('require("../packages/general-app-extension-worona/src/pwa")'),
    importServerSagas: () =>
      import('../packages/general-app-extension-worona/src/pwa/sagas/server'),
  },
  'wp-org-connection-app-extension-worona': {
    namespace: 'connection',
    DynamicComponent: dynamic(import('../packages/wp-org-connection-app-extension-worona/src/pwa')),
    importPackage: () => import('../packages/wp-org-connection-app-extension-worona/src/pwa'),
    requirePackage: () =>
      eval('require("../packages/wp-org-connection-app-extension-worona/src/pwa")'),
    importServerSagas: () =>
      import('../packages/wp-org-connection-app-extension-worona/src/pwa/sagas/server'),
  },
  'starter-app-theme-worona': {
    namespace: 'theme',
    DynamicComponent: dynamic(import('../packages/starter-app-theme-worona/src/pwa')),
    importPackage: () => import('../packages/starter-app-theme-worona/src/pwa'),
    requirePackage: () => eval('require("../packages/starter-app-theme-worona/src/pwa")'),
  },
  'saturn-app-theme-worona': {
    namespace: 'theme',
    DynamicComponent: dynamic(import('../packages/saturn-app-theme-worona/src/pwa')),
    importPackage: () => import('../packages/saturn-app-theme-worona/src/pwa'),
    requirePackage: () => eval('require("../packages/saturn-app-theme-worona/src/pwa")'),
  },
};

const App = ({ pkgs }) =>
  <div>
    {/* Add all the dynamic components of the activated packages to make next SSR work. */}
    {pkgs
      .map(name => packages[name].DynamicComponent)
      .map((DynamicPackage, index) => <DynamicPackage key={index} />)}
  </div>;

export default connect(state => ({
  pkgs: getPackages(state),
}))(App);
