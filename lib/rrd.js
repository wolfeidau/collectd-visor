/*
 The aim of this module is to provide an API which matches as closely as possible the intent of the rrdtool CLI
 interface.
 */

var exec = require('child_process').exec;

var internal = {};

var RRDTool = function (options) {
  this.options = options || {};
  if (this.options.hasOwnProperty('path')) this.path = this.options.path;
};

internal.path = function () {
  return 'rrdtool' || this.path;
};

internal.locateText = function (regex, text) {
  return text.match(regex);
};
/**
 * Just call the rrdtool command to ensure it is installed.
 * @param callback
 */
RRDTool.prototype.version = function (callback) {
  exec([internal.path()].join(' ')
    , function (err, stdout, stderr) {
      if (err !== null) {
        callback(err);
      }
      if (stderr !== '') {
        callback(stderr);

      }
      var result = internal.locateText(/^RRDtool ([0-9\.]+)/, stdout);
      if(!result) {
        callback('Unable to locate version string.');
      }
      callback(null, result[0]);
    }
  );
};



module.exports = RRDTool;