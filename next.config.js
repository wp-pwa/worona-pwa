const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  // You may only need to add assetPrefix in the production.
  assetPrefix: isProd ? 'http://localhost:3000' : 'http://localhost:3000',
  webpack: (config, { dev }) => {
    // Perform customizations to webpack config
    config.output.publicPath = 'http://localhost:3000';
    // Important: return the modified config
    return config
  },
  webpackDevMiddleware: config => {
    // Perform customizations to webpack dev middleware config
    config.publicPath = 'http://localhost:3000';
    // Important: return the modified config
    return config;
  },
};
