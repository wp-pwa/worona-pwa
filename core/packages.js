/* eslint-disable no-eval */
import React from 'react';
import PropTypes from 'prop-types';
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
  'saturn-app-theme-worona': {
    namespace: 'theme',
    DynamicComponent: dynamic(import('../packages/saturn-app-theme-worona/src/pwa')),
    importPackage: () => import('../packages/saturn-app-theme-worona/src/pwa'),
    requirePackage: () => eval('require("../packages/saturn-app-theme-worona/src/pwa")'),
    importServerSagas: () =>
      import('../packages/saturn-app-theme-worona/src/pwa/sagas/server'),
  },
};

const App = ({ pkgs }) =>
  <div>
    {/* Add all the dynamic components of the activated packages to make next SSR work. */}
    {pkgs
      .map(name => ({ DynamicPackage: packages[name].DynamicComponent, name }))
      .map(({ DynamicPackage, name }) => <DynamicPackage key={name} />)}
  </div>;
App.propTypes = {
  pkgs: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default connect(state => ({
  pkgs: getPackages(state),
}))(App);
