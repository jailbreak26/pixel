#!/usr/bin/env node

const cors_proxy = require('./lib/pixel-connector');

const port = process.env.PORT || 1337;
const host = '0.0.0.0'; // Required for Heroku and public access

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with', 'content-type', 'accept'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, () => {
    console.log(`Running Pixel Connector on ${host}:${port}`);
});
