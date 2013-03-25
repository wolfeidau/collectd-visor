// Load modules
var chai = require('chai')
  , Hapi = require('hapi');

var collectdVisor = require('../../lib');

var expect = chai.expect;

describe('Routes', function () {

  var server;

  before(function(){
    server = new Hapi.Server(collectdVisor.defaultConfig());
    collectdVisor.routes(server);
  });

  it('should respond to / with 200 status code', function (done) {
    server.inject({ method: 'GET', url: '/' }, function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  it('should respond to /about with 200 status code', function (done) {
    server.inject({ method: 'GET', url: '/about' }, function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  it('should respond to /hosts with 200 status code', function (done) {
    server.inject({ method: 'GET', url: '/hosts' }, function (res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

});