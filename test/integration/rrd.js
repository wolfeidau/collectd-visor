// Load modules
var chai = require('chai');

var RRDTool = require('../../lib/rrd');

var expect = chai.expect;

describe('RRD', function () {

  it('should return a version string', function (done) {

    var rrd = new RRDTool();

    rrd.version(function (err, data) {
      expect(err).to.not.exist;
      expect(data).to.exist;
      done();
    });

  });

  it('should return an error with bad command path', function (done) {

    var rrd = new RRDTool({path: 'bad_command'});

    rrd.version(function (err, data) {
      expect(err).to.exist;
      expect(data).to.not.exist;
      done();
    });

  });

  it('should return info for a rrd file', function (done) {

    var rrd = new RRDTool();

    rrd.info('./data/collectd/rrd/ubuntu1204-2server01/load/load.rrd', function (err, data) {
      expect(err).to.not.exist;
      // {
      // shortterm: { index: 0, type: 'GAUGE', min: 0, max: 100, value: 0 }
      // , midterm: { index: 1, type: 'GAUGE', min: 0, max: 100, value: 0.03 }
      // , longterm: { index: 2, type: 'GAUGE', min: 0, max: 100, value: 0.15 }
      // }
      expect(data['shortterm']['index']).to.exist;
      expect(data['midterm']['index']).to.exist;
      expect(data['longterm']['index']).to.exist;
      done();
    });

  });

});
