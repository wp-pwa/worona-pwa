var argv = require('minimist')(process.argv.slice(2));

// NODE_PATH
module.exports.NODE_PATH =
  'node_modules' +
  ':packages/wp-org-connection-app-extension-worona/node_modules' +
  ':packages/saturn-app-theme-worona/node_modules' +
  ':packages/general-app-extension-worona/node_modules';

// PUBLIC_PATH
if (argv.wp) {
  console.log('> Using PUBLIC_PATH=http://localhost:3000');
  module.exports.PUBLIC_PATH = 'http://localhost:3000';
} else if (argv.now) {
  console.log('> Using PUBLIC_PATH=https://pwa.worona.io');
  module.exports.PUBLIC_PATH = 'https://pwa.worona.io';
} else if (argv.public) {
  console.log('> Using PUBLIC_PATH=' + argv.public + '');
  module.exports.PUBLIC_PATH = argv.public;
}

// NODE_ENV
if (argv.prod) {
  console.log('> Using NODE_ENV=production');
  module.exports.NODE_ENV = 'production';
}
