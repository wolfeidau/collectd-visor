// Load modules
var chai = require('chai')
  , Hapi = require('hapi');

var treeToMetrics = require('../../lib/tree_to_metrics');

var expect = chai.expect;

describe('Directory Tree', function () {
  it('should locate a host and some metrics in the data directory', function(done){

    treeToMetrics.scanDirectoryForMetrics('./data/collectd/rrd', function(err, data){
      expect(err).to.not.exist;
      expect(data['ubuntu1204-2server01']).to.exist;
      expect(data['ubuntu1204-2server01']['cpu-0']).to.exist;
      expect(data['ubuntu1204-2server01']['cpu-0'].length).to.eql(8);
      done()
    })


  })
});