import { Component } from 'react';
import { compose, createStore, applyMiddleware } from 'redux';
import { connect } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import logger from 'redux-logger';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { lifecycle } from 'recompose';
import Link from 'next/link';
import styled from 'styled-components';

const Themes = ['some-theme', 'other-theme'];

const ThemesComponents = Themes.reduce(
  (obj, key) => ({ ...obj, [key]: require(`../packages/${key}/components`) }),
  {}
);

const CurrentTheme = 'some-theme';
const CurrentHome = ThemesComponents[CurrentTheme].Home;

const OtherPackage = dynamic(import('../packages/other-package'));

const Button = styled.button`
  color: red;
`;

class Index extends Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps({ req, serverProps }) {
    if (req) {
      return {
        fromServer: 1,
      };
    }
    if (serverProps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        fromFirstRender: 2,
      };
    }
    return {
      fromOtherRenders: 3,
    };
  }

  static runInitialPropsAgain({ serverProps }) {
    return true;
  }

  async componentDidMount() {
    // const start = new Date();
    // const imp = await import('../packages/other-package');
    // const end = new Date();
    // console.log(end - start);
    // console.log(imp.actions);
    // console.log(imp.types);
  }
  render() {
    // console.log(this.props);
    return (
      <div>
        {this.props.isServer && 'isServerRendered'}
        <CurrentHome />
        <Button onClick={this.props.theAction}>PUSH!</Button>
        <Button onClick={this.props.theOtherAction}>OTHER PUSH!</Button>
        <Link prefetch href="/post?p=2">
          <a>
            Post 2 {this.props.hi}
          </a>
        </Link>
        <OtherPackage />
      </div>
    );
  }
}

const reducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const makeStore = initialState => {
  return createStore(reducer, initialState, composeEnhancers(applyMiddleware(logger)));
};

const pkgs = {
  OtherPackage: 'other-package',
  SomePackage: 'some-package',
};

const dep = namespace => require(`../packages/${pkgs[namespace]}/import`).default;

export default compose(
  // withRedux(makeStore),
  // connect(null, dispatch => ({
  //   theAction: async () => {
  //     const start = new Date();
  //     const OtherPackage = await import('../packages/other-package');
  //     dispatch(OtherPackage.actions.otherAction());
  //     const end = new Date();
  //     console.log(end - start);
  //   },
  //   theOtherAction: async () => {
  //     const start = new Date();
  //     dispatch({ type: 'HI' });
  //     const end = new Date();
  //     console.log(end - start);
  //   },
  // }))
)(Index);
