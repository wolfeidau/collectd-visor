// Load modules
var chai = require('chai');

var RRDTool = require('../../lib/rrd');

var expect = chai.expect;

describe('RRD', function () {


  describe('utils', function () {

    it('should convert js date to unix timestamp', function () {
      var rrd = new RRDTool();
      var unixTime = rrd.unixTime(new Date(1318874398806));
      expect(unixTime).to.eql(1318874398);
    });

  });

  describe('actions', function () {

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

  describe('fetch', function () {

    var rrd;

    before(function () {
      rrd = new RRDTool();
    });

    it('should fetch the average from an rrd file for a given metric', function (done) {

      rrd.fetch('./data/collectd/rrd/ubuntu1204-2server01/load/load.rrd', 'AVERAGE', 1364374210, 1364407660, 3600, function (err, data) {
        expect(err).to.not.exist;
        expect(data).to.exist;
        expect(data.headers).to.eql([ 'timestamp', 'shortterm', 'midterm', 'longterm' ]);
        done();

      });
    });

    it('should fetch the min from an rrd file for a given metric', function (done) {

      rrd.fetch('./data/collectd/rrd/ubuntu1204-2server01/load/load.rrd', 'MIN', 1364374210, 1364407660, 3600, function (err, data) {
        expect(err).to.not.exist;
        expect(data).to.exist;
        expect(data.headers).to.eql([ 'timestamp', 'shortterm', 'midterm', 'longterm' ]);
        done();

      });
    });

  });

});
