const replace = require('replace-in-file');

function changePath(path) {
  const onDemandEntriesClient = {
    files: 'node_modules/@worona/next/dist/client/on-demand-entries-client.js',
    from: /'(?:https?:\/\/)?.*(\/_next\/on-demand-entries-ping)\?/,
    to: '\'' + path + '$1?',
  };
  const webpackHotMiddlewareClient = {
    files: 'node_modules/@worona/next/dist/client/webpack-hot-middleware-client.js',
    from: /(path=).*(\/_next\/webpack-hmr)/,
    to: '$1' + path + '$2',
  };

  try {
    const changedFiles = [
      ...replace.sync(onDemandEntriesClient),
      ...replace.sync(webpackHotMiddlewareClient),
    ];
  }
  catch (error) {
    throw new Error('Error occurred:', error);
  }
}

module.exports = changePath;
