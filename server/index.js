/* eslint-disable no-console */
const { createServer } = require('https');
const fs = require('fs');
const { parse } = require('url');
const next = require('@worona/next');
const changePath = require('./change-path');

const options = {
  key: fs.readFileSync('./server/worona.localhost'),
  cert: fs.readFileSync('./server/worona.localhost.crt'),
};

const dev = process.env.NODE_ENV !== 'production';
const publicPath = process.env.PUBLIC_PATH || false;

// If we are in WordPress dev mode, change the paths. If not, remove the paths.
if (dev && publicPath) changePath(publicPath);
else if (dev) changePath('');

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(options, (req, res) => {
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
    console.log('> Ready on https://localhost:3000');
  });
});
