var treeToMetrics = require('./tree_to_metrics')
  , Hapi = require('hapi');

var pkgInfo = require('../package.json');

var internal = {};

var S = Hapi.Types.String;

// this is used as single store of path validations which can be used in routes
internal.pathSchema = {
  path: {
    hostname: S().regex(/^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/)
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

var getHostsHandler = function () {
  var hosts = [];
  for (var host in internal.hostMetrics) {
    if (internal.hostMetrics.hasOwnProperty(host)) {
      hosts.push(host);
    }
  }
  this.reply(hosts);
};

var getHostDetailsHandler = function () {
  if (internal.hostMetrics[this.params.hostname]) {
    this.reply(internal.hostMetrics[this.params.hostname]);
  } else {
    this.reply(Hapi.Error.notFound('Unable to locate a host with this name.'));
  }
};

CollectdVisor.prototype.routes = function (server) {
  server.route({ method: 'GET', path: '/', handler: rootHandler });
  server.route({ method: 'GET', path: '/about', handler: aboutHandler });
  server.route({ method: 'GET', path: '/hosts', handler: getHostsHandler });
  server.route({ method: 'GET', path: '/host/{hostname}',
    config: { handler: getHostDetailsHandler, validate: internal.pathSchema } // note passed in validation schema for path attributes.
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