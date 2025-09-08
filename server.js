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

      // Treat missing headers as anonymous
      const isAnonymous = !referer && !origin;

      // Check if request is from allowed domain
      const isAllowed = allowedDomains.some(domain =>
        referer.startsWith(domain) || origin.startsWith(domain)
      );

      if (isAnonymous || !isAllowed) {
        return new Error('Forbidden: Unauthorized or anonymous domain');
      }

      return null;
    } catch (err) {
      console.error('RateLimit check failed:', err);
      return new Error('Internal proxy error');
    }
  },
  handleProxyErrors: true // Optional: ensure upstream errors like 429 are passed through
}).listen(port, host, () => {
  console.log(`Running Pixel Connector on ${host}:${port}`);
});
