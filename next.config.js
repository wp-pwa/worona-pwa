/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';
const publicPath = process.env.PUBLIC_PATH || false;
const woronaVersion = process.env.WORONA_VERSION || 'dev';

module.exports = {
  // We need to point to localhost on dev because we are loading next in a different url.
  assetPrefix: publicPath || '',
  webpack: (config, { dev }) => {
    // We need this publicPath in order to make HMR work.
    if (publicPath) config.output.publicPath = publicPath + '/_next/' + woronaVersion + '/webpack/';
    // Ignore server sagas.
    config.plugins.push(new webpack.IgnorePlugin(/sagas\/server\.js/));
    config.devtool = false
    return config;
  },
};
