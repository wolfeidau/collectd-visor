var wrench = require('wrench')
  , path = require('path');

/**
 * Scans a directory structure and builds an object containing the hierarchy enclosing our collectd rrd files.
 *
 * Will need to make the model plugable in the future so it can be redis backed, rather than all in memory.
 *
 * @param hostMetrics
 * @param callback
 */
exports.scanDirectoryForMetrics = function (hostMetrics, callback) {
  // iterate over the tree
  wrench.readdirRecursive('./data/collectd/rrd', function (error, curFiles) {
    if (curFiles == null) {
      callback(error);
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
              hostMetrics[host][element] = {}; // place holder for the element
            }
            if (!hostMetrics[host][element][metric]) {
              hostMetrics[host][element][metric] = 1; // an arbitrary number to represent the metric is set
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
