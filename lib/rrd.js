/*
 The aim of this module is to provide an API which matches as closely as possible the intent of the rrdtool CLI
 interface.
 */
var exec = require('child_process').exec;

var RRDTool = function (options) {
  this.options = options || {};
  if (this.options.hasOwnProperty('path')) {
    this.path = this.options.path;
  }
};

RRDTool.prototype.getPath = function () {
  return this.path || 'rrdtool';
};

RRDTool.prototype._locateText = function (regex, text) {
  return text.match(regex);
};

/**
 * Method to exec the rrdtool command with the supplied args.
 *
 * @param argsArray
 * @param onErr
 * @param onSuccess
 */
RRDTool.prototype.rrdExec = function (argsArray, onErr, onSuccess) {
  var path =  this.getPath()
    , args = [path].concat(argsArray)
    , child = exec(args.join(' ')       // TODO keep a track of child processes.
    , function (err, stdout, stderr) {  // rrdtool currently doesn't seem to use stderr at all..
      if (err !== null) {
        onErr(err);
      } else {
        onSuccess(stdout);
      }
    }
  );


}

/**
 * Just call the rrdtool command to ensure it is installed.
 * @param callback
 */
RRDTool.prototype.version = function (callback) {

  var self = this;

  this.rrdExec(['--help'] // supplying no args results in usage being printed to stdout
    , callback
    , function (data) {
      var result = self._locateText(/^RRDtool ([0-9\.]+)/, data); //either null or contains items.
      if (!result) {
        callback('Unable to locate version string.');
      } else {
        callback(null, result[0]);
      }
    }
  );
};


module.exports = RRDTool;