var pkgInfo = require('../package.json');

var CollectdVisor = function () {

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
  this.reply({ status: 'ok' });
};

var getHostDetailsHandler = function () {
  this.reply({ status: 'ok' });
};

CollectdVisor.prototype.routes = function (server) {
  server.route({ method: 'GET', path: '/', handler: rootHandler });
  server.route({ method: 'GET', path: '/about', handler: aboutHandler });
  server.route({ method: 'GET', path: '/hosts', handler: getHostsHandler });
  server.route({ method: 'GET', path: '/host/{host}', handler: getHostDetailsHandler });
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
}


module.exports = new CollectdVisor();