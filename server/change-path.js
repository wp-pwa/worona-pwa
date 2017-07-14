const replace = require('replace-in-file');

function changePath(path) {
  const nextPath = {
    files: 'next.path.js',
    from: /(module.exports = ').*(';)/,
    to: '$1' + path + '$2',
  };
  const onDemandEntriesClient = {
    files: 'node_modules/next/dist/client/on-demand-entries-client.js',
    from: /'(?:https?:\/\/)?.*(\/_next\/on-demand-entries-ping)\?/,
    to: '\'' + path + '$1?',
  };
  const webpackHotMiddlewareClient = {
    files: 'node_modules/next/dist/client/webpack-hot-middleware-client.js',
    from: /(path=).*(\/_next\/webpack-hmr)/,
    to: '$1' + path + '$2',
  };

  try {
    const changedFiles = [
      ...replace.sync(nextPath),
      ...replace.sync(onDemandEntriesClient),
      ...replace.sync(webpackHotMiddlewareClient),
    ];
  }
  catch (error) {
    throw new Error('Error occurred:', error);
  }
}

module.exports = changePath;
