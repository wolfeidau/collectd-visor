var treeToMetrics = require('./tree_to_metrics')
  , Hapi = require('hapi');

var pkgInfo = require('../package.json');

var internal = {};

var S = Hapi.Types.String;
var N = Hapi.Types.Number;

// this is used as single store of path validations which can be used in routes
internal.pathSchema = {
  path: {
    hostname: S().regex(/^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/)
    , metric: S().regex(/^[0-9A-Za-z\-]+$/)
    , startTimestamp: N()
    , EndTimestamp: N()
  }
};

var CollectdVisor = function () {
  // need to move this preflight stuff to a hapi plugin.
  this.updateHostMetricCache(function (err, data) {
    if (err) {
      throw Error('Unable to index rrd files within the specified path.');
    } else {
      internal.hostMetrics = data;
    }
  });
};

/**
 * This method scans the path where collectd stores it's rrd files and builds a cache of the directories/files.
 */
CollectdVisor.prototype.updateHostMetricCache = function (callback) {
  treeToMetrics.scanDirectoryForMetrics('./data/collectd/rrd', function (err, data) {
    callback(err, data);
  });
};

var rootHandler = function (request) {
  request.reply.view('index', {
    title: 'Index | CollectD Visor', message: 'Index - Hello World!', version: pkgInfo.version
  }).send();
};

var aboutHandler = function (request) {
  request.reply.view('about', {
    title: 'About | CollectD Visor', message: 'About - Hello World!', version: pkgInfo.version
  }).send();
};

var getHostsHandler = function (request) {
  request.reply(Object.getOwnPropertyNames(internal.hostMetrics));
};

var getHostDetailsHandler = function (request) {
  if (internal.hostMetrics[request.params.hostname]) {
    request.reply({hostname: request.params.hostname});
  } else {
    request.reply(Hapi.Error.notFound('Unable to locate a host with this name.'));
  }
};

var getHostMetricsDetailsHandler = function (request) {
  if (internal.hostMetrics[request.params.hostname]) {
    request.reply(internal.hostMetrics[request.params.hostname]);
  } else {
    request.reply(Hapi.Error.notFound('Unable to locate a host with this name.'));
  }
};

var getHostMetricDetailsHandler = function (request) {
  if (internal.hostMetrics[request.params.hostname]) {
    request.reply(internal.hostMetrics[request.params.hostname]);
  } else {
    request.reply(Hapi.Error.notFound('Unable to locate a host with this name.'));
  }
};

CollectdVisor.prototype.routes = function (server) {
  // Serve the public folder with listing enabled
  server.route({ method: 'GET', path: '/{path*}', handler: { directory: { path: './public/'} } });
  server.route({ method: 'GET', path: '/', handler: rootHandler });
  server.route({ method: 'GET', path: '/about', handler: aboutHandler });
  server.route({ method: 'GET', path: '/hosts', handler: getHostsHandler });
  server.route({ method: 'GET', path: '/host/{hostname}',
    config: { handler: getHostDetailsHandler, validate: internal.pathSchema } // note passed in validation schema for path attributes.
  });
  server.route({ method: 'GET', path: '/host/{hostname}/metrics',
    config: { handler: getHostMetricsDetailsHandler, validate: internal.pathSchema } // note passed in validation schema for path attributes.
  });
  server.route({ method: 'GET', path: '/host/{hostname}/metric/{metric}',
    config: { handler: getHostMetricDetailsHandler, validate: internal.pathSchema } // note passed in validation schema for path attributes.
  });
};


CollectdVisor.prototype.defaultConfig = function () {
  return {auth: this.defaultAuthConfig(), views: this.defaultViewConfig()};
};
CollectdVisor.prototype.defaultAuthConfig = function () {
  return {
    scheme: 'basic',
    loadUserFunc: function (username, callback) {
      callback(null, { id: 'test', password: 'test' });
    }
  };
};

CollectdVisor.prototype.defaultViewConfig = function () {
  return {
    path: __dirname + './../views',
    engine: {
      module: 'jade',
      extension: 'jade'
    },
    compileOptions: {
      pretty: true
    }
  };
};


module.exports = new CollectdVisor();