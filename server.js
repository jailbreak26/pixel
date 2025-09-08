#!/usr/bin/env node

const cors_proxy = require('./lib/pixel-connector');

const port = process.env.PORT || 1337;
const host = '0.0.0.0'; // Required for Heroku and public access

const allowedOrigins = [
  'https://streamwink.com',
  'https://xignos.com'
];

cors_proxy.createServer({
  originWhitelist: [], // Allow all origins (CORS-wise)
  requireHeader: ['origin', 'x-requested-with', 'content-type', 'accept'],
  removeHeaders: ['cookie', 'cookie2'],
  setHeaders: function(req, res) {
    const origin = req.headers.origin || '';

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
  }
}).listen(port, host, () => {
  console.log(`Running Pixel Connector with scoped CORS headers on ${host}:${port}`);
});
