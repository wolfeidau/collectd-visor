var Hapi = require('hapi');
var collectdVisor = require('./lib');

var options = collectdVisor.defaultConfig();

var http = new Hapi.Server('localhost', 8000, options);

var options = {
};

// load routes
collectdVisor.routes(http);

// Start server
http.start();