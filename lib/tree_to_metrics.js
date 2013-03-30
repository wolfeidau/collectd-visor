var wrench = require('wrench')
  , path = require('path');

/**
 * Scans a directory structure and builds an object containing the hierarchy enclosing our collectd rrd files.
 *
 * Will need to make the model to a plugin in the future so it can be redis backed, rather than all in memory.
 *
 * @param dataPath
 * @param callback
 */
exports.scanDirectoryForMetrics = function (dataPath, callback) {

  var hostMetrics = {};

  // iterate over the tree
  wrench.readdirRecursive(dataPath, function (error, curFiles) {
    if (curFiles == null) {
      console.log('metrics loaded.')
      callback(error, hostMetrics);
    } else {
      curFiles.forEach(function (file) {
        if (path.extname(file) == '.rrd') {
          var pathEntries = file.split(path.sep);
          // should have three entries host/element/metric.rrd
          if (pathEntries.length == 3) {
            var metric = path.basename(pathEntries.pop(), '.rrd')  // use path.basename to be safe.
              , element = pathEntries.pop()
              , host = pathEntries.pop();
            if (!hostMetrics[host]) {
              hostMetrics[host] = {}; // place holder for the host
            }
            if (!hostMetrics[host][element]) {
              hostMetrics[host][element] = []; // place holder for the element
            }
            if (!hostMetrics[host][element][metric]) {
              hostMetrics[host][element].push(metric); // an arbitrary number to represent the metric is set
            }
          }
          if (pathEntries.length == 3) {
            console.err('path deeper than expected');
          }
        }

      });

    }
  });
};
