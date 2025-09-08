#!/usr/bin/env node

const cors_proxy = require('./lib/pixel-connector');

const port = process.env.PORT || 1337;
const host = '0.0.0.0'; // Required for Heroku and public access

const allowedDomains = [
  'https://streamwink.com',
  'https://xignos.com'
];

cors_proxy.createServer({
  originWhitelist: [], // Allow all origins (CORS-wise)
  requireHeader: ['origin', 'x-requested-with', 'content-type', 'accept'],
  removeHeaders: ['cookie', 'cookie2'],
  checkRateLimit: function(req) {
    try {
      const referer = req.headers.referer || '';
      const origin = req.headers.origin || '';

      // Treat missing headers as anonymous hotlink attempt
      if (!referer && !origin) {
        return new Error('Forbidden: Missing origin or referer');
      }

      const isAllowed = allowedDomains.some(domain =>
        referer.startsWith(domain) || origin.startsWith(domain)
      );

      if (!isAllowed) {
        return new Error('Forbidden: Hotlink protection triggered');
      }

      return null; // Allow request
    } catch (err) {
      console.error('Hotlink check failed:', err);
      return new Error('Internal proxy error');
    }
  }
}).listen(port, host, () => {
  console.log(`Running Pixel Connector with hotlink protection on ${host}:${port}`);
});
