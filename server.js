#!/usr/bin/env node

const cors_proxy = require('./lib/pixel-connector');

const port = process.env.PORT || 1337;
const host = '0.0.0.0';

const allowedOrigins = [
  'https://streamwink.com',
  'https://xignos.com'
];

cors_proxy.createServer({
  originWhitelist: [], // Allow all origins (CORS-wise)
  requireHeader: ['origin'],
  removeHeaders: ['cookie', 'cookie2'],
  setHeaders: function(req, res) {
    const origin = req.headers.origin || '';

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    } else {
      // Explicitly block CORS for unauthorized origins
      res.removeHeader('Access-Control-Allow-Origin');
    }
  }
}).listen(port, host, () => {
  console.log(`Running Pixel Connector with strict CORS enforcement on ${host}:${port}`);
});
