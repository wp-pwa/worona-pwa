const { createServer } = require('http');
const { parse } = require('url');
const next = require('@worona/next');
const changePath = require('./change-path');

const dev = process.env.NODE_ENV !== 'production';
const publicPath = process.env.PUBLIC_PATH || false;

// If we are in WordPress dev mode, change the paths. If not, remove the paths.
if (dev) publicPath ? changePath(publicPath) : changePath('');

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { query } = parsedUrl;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if (!query.siteId) {
      app.render(req, res, '/siteIdMissing', query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
