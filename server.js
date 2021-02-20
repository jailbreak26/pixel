#!/usr/bin/env node
var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
var port = process.env.PORT || 1337;

var cors_proxy = require('./lib/edge-connector');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with', 'content-type', 'accept'],
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running EDGE Connector on ' + host + ':' + port);
});
