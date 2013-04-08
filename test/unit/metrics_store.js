// Load modules
var chai = require('chai');

var MetricsStore = require('../../lib/metrics_store');

var expect = chai.expect;

describe('Metrics Store', function () {

  var metricsStore;

  before(function (done) {

    metricsStore = new MetricsStore('./data/collectd/rrd');
    metricsStore.load(function (err) {
      if (err) throw err;
      done()
    });
  });

  it('should locate metrics for two hosts', function () {
    expect(metricsStore.hosts()).eql(['ubuntu1204-2server01', 'ubuntu1204-2server02']);
  });


  it('should return the correct host', function () {
    expect(metricsStore.hostMetrics('ubuntu1204-2server01')).to.exist;
  });

  it('should perform a successful rrd file exists check for a set of params', function(){
    expect(metricsStore.checkMetricFile('ubuntu1204-2server01', 'cpu-0', 'cpu-idle')).to.eql(true);
  })

  it('should perform a successful metric exists check for a set of params', function(){
    expect(metricsStore.checkMetricExists('ubuntu1204-2server01', 'cpu-0', 'cpu-idle')).to.eql(true);
  })
});
