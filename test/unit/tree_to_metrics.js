// Load modules
var chai = require('chai')
  , Hapi = require('hapi');

var treeToMetrics = require('../../lib/tree_to_metrics');

var expect = chai.expect;

describe('Directory Tree', function () {
  it('should locate a host and some metrics in the data directory', function(done){

    var hostMetrics = {};

    treeToMetrics.scanDirectoryForMetrics(hostMetrics, function(err){
      expect(err).to.not.exist;
      expect(hostMetrics['ubuntu1204-2server01']).to.exist;
      expect(hostMetrics['ubuntu1204-2server01']['cpu-0']['cpu-idle']).to.exist;
      done()
    })


  })
});