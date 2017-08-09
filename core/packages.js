import React from 'react';
import { connect } from 'react-redux';
import NextLink from '@worona/next/link';
import dynamic from '@worona/next/dynamic';
import { getPackages, getTheme } from './build/selectors';

export const packages = {
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

const Link = connect(state => ({
  siteId: state.settings.siteId,
}))(({ href, as, children, siteId }) =>
  <NextLink href={{ ...href, query: { ...href.query, siteId } }} as={as}>
    {children}
  </NextLink>
);

const App = ({ activePackages, activeTheme }) => {
  const DynamicPackages = activePackages.map(name => packages[name].DynamicComponent);
  const DynamicTheme = packages[activeTheme].Home;
  return (
    <div>
      <Link href={{ query: { p: 57 } }} as="/holaaaa">
        <a>Link</a>
      </Link>
      <DynamicTheme />
      {/* Add all the dynamic components of the activated packages to make next SSR work. */}
      {DynamicPackages.map((DynamicPackage, index) => <DynamicPackage key={index} />)}
    </div>
  );
};

export default connect(state => ({
  activePackages: getPackages(state),
  activeTheme: getTheme(state),
}))(App);
