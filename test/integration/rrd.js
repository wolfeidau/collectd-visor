// Load modules
var chai = require('chai');

var RRDTool = require('../../lib/rrd');

var expect = chai.expect;

describe('RRD', function () {



  it('should return a version string', function(done){

    var rrd = new RRDTool();

    rrd.version(function(err, data){

      expect(err).to.not.exist;
      expect(data).to.exist;
      done();
    });

  });

});
