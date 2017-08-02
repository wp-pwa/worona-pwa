import { Component } from 'react';
import { combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import dynamic from '@worona/next/dynamic';
import { initStore } from '../core/store';
import settings from '../core/settings/reducers';

const packages = [
  {
    namespace: 'generalSettings',
    DynamicComponent: dynamic(import('../packages/general-settings-app-extension-worona')),
    importFunction: () => import('../packages/general-settings-app-extension-worona'),
    requireFunction: () => eval('require("../packages/general-settings-app-extension-worona")'),
  },
];

const reducers = {
  settings,
};

class Index extends Component {
  constructor(props) {
    super(props);
    const reducer = combineReducers(reducers);
    this.store = initStore({ reducer, initialState: props.initialState });
  }

  static async getInitialProps({ req, serverProps }) {
    if (req) {
      // Populate reducers and create server redux store to pass initialState on SSR.
      packages.forEach(
        ({ namespace, requireFunction }) =>
          (reducers[namespace] = requireFunction().default.reducers)
      );
      const reducer = combineReducers(reducers);
      const store = initStore({ reducer, initialState: {} });
      return { initialState: store.getState() };
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
