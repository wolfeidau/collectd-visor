var treeToMetrics = require('./tree_to_metrics')
  , path = require('path')
  , fs = require('fs');

module.exports = MetricsStore = function (dataPath) {

  this.dataPath = dataPath;
  this.store = {};

  this.load = function (callback) {

    treeToMetrics.scanDirectoryForMetrics(this.dataPath, function (err, data) {
      if (!err) {
        this.store = data;
      }
      callback(err)
    }.bind(this))
  };

  this.hosts = function () {
    return Object.getOwnPropertyNames(this.store);
  };

  this.hostMetrics = function (hostname) {
    return this.store[hostname];
  };

  this.checkMetricFile = function (host, element, metric) {
    return this.store[host][element] && fs.existsSync(this._buildFilePath(host, element, metric));
  };

  this.checkMetricExists = function (host, element, metric) {
    return this.store[host][element] && this.store[host][element].some(function (val) {
      return val === metric
    });
  };

  this._buildFilePath = function(host, element, metric){
    return path.join(dataPath, host, element, metric + '.rrd');
  };

};



