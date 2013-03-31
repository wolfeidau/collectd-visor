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
  var path = this.getPath()
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

};

/**
 * Just call the rrdtool command to ensure it is installed.
 * @param callback
 */
RRDTool.prototype.version = function (callback) {
  this.rrdExec(['--help'] // supplying no args results in usage being printed to stdout
    , callback
    , function (data) {
      var result = this._locateText(/^RRDtool ([0-9\.]+)/, data); //either null or contains items.
      if (!result) {
        callback('Unable to locate version string.');
      } else {
        callback(null, result[0]);
      }
    }.bind(this)
  );
};

/**
 * Uses the info action within rrdtool to provide a summary of the supplied rrd file content.
 *
 * @param filePath
 * @param callback
 */
RRDTool.prototype.info = function (filePath, callback) {

  var self = this;

  this.rrdExec(['info', filePath] // supplying no args results in usage being printed to stdout
    , callback
    , function (data) {

      var info = {};

      var lines = data.split("\n");

      lines.forEach(function (line) {
        var result = self._locateText(/^ds\[([a-zA-Z]+)\]\.([a-zA-Z]+) = (.*)$/, line);
        if (result && result.length == 4) {
          if (!info[result[1]]) {
            info[result[1]] = {};
          }
          var value = Number(result[3]);
          if (Number.isNaN(value)){
            info[result[1]][result[2]] = result[3].replace(/['"]/g, '');
          } else {
            info[result[1]][result[2]] = Number(result[3]);
          }
        }
      });
//      console.log('info', info)
      callback(null, info);

    }.bind(this)
  );
};


module.exports = RRDTool;